import bcrypt from "bcryptjs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const error = (message, status = 400) => json({ error: message }, status);

const parseBody = async (request) => {
  try {
    const text = await request.text();
    if (!text) return {};
    return JSON.parse(text);
  } catch (err) {
    return {};
  }
};

const randomToken = () => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const trimPath = (pathname) => pathname.replace(/\/+$/, "");

async function handleBoxes(env) {
  const boxesRes = await env.DB.prepare(
    "SELECT id, name, pieces, price, image FROM boxes ORDER BY id"
  ).all();

  const foodsRes = await env.DB.prepare(
    "SELECT bf.box_id, f.name, bf.quantity FROM box_foods bf JOIN foods f ON bf.food_id = f.id"
  ).all();

  const flavorsRes = await env.DB.prepare(
    "SELECT bf.box_id, fl.name FROM box_flavors bf JOIN flavors fl ON bf.flavor_id = fl.id"
  ).all();

  const foodsByBox = foodsRes.results.reduce((acc, row) => {
    const entry = acc.get(row.box_id) ?? [];
    entry.push({ name: row.name, quantity: Number(row.quantity) });
    acc.set(row.box_id, entry);
    return acc;
  }, new Map());

  const flavorsByBox = flavorsRes.results.reduce((acc, row) => {
    const entry = acc.get(row.box_id) ?? [];
    entry.push(row.name);
    acc.set(row.box_id, entry);
    return acc;
  }, new Map());

  const boxes = boxesRes.results.map((box) => ({
    ...box,
    price: Number(box.price),
    pieces: Number(box.pieces),
    foods: foodsByBox.get(box.id) ?? [],
    flavors: flavorsByBox.get(box.id) ?? [],
  }));

  return json(boxes);
}

async function handleBoxDetail(env, id) {
  if (!id) {
    return error("id requis", 400);
  }

  const boxId = Number(id);

  const box = await env.DB.prepare(
    "SELECT id, name, pieces, price, image FROM boxes WHERE id = ?"
  )
    .bind(boxId)
    .first();

  if (!box) {
    return error("box introuvable", 404);
  }

  const foodsRes = await env.DB.prepare(
    "SELECT f.name, bf.quantity FROM box_foods bf JOIN foods f ON bf.food_id = f.id WHERE bf.box_id = ?"
  )
    .bind(boxId)
    .all();

  const flavorsRes = await env.DB.prepare(
    "SELECT fl.name FROM box_flavors bf JOIN flavors fl ON bf.flavor_id = fl.id WHERE bf.box_id = ?"
  )
    .bind(boxId)
    .all();

  const payload = {
    ...box,
    price: Number(box.price),
    pieces: Number(box.pieces),
    foods: (foodsRes.results ?? []).map((row) => ({
      name: row.name,
      quantity: Number(row.quantity),
    })),
    flavors: (flavorsRes.results ?? []).map((row) => row.name),
  };

  return json({ success: true, data: payload });
}

async function getUserFromAuth(env, request) {
  const header = request.headers.get("Authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice(7);
  const user = await env.DB.prepare(
    "SELECT id, firstname, lastname, email, api_token FROM users WHERE api_token = ?"
  )
    .bind(token)
    .first();
  return user ?? null;
}

async function ensurePanier(env, userId) {
  const existing = await env.DB.prepare(
    "SELECT id FROM panier WHERE status = 'OUVERT' AND ((? IS NULL AND utilisateur_id IS NULL) OR utilisateur_id = ?) ORDER BY id DESC LIMIT 1"
  )
    .bind(userId, userId)
    .first();

  if (existing?.id) {
    return existing.id;
  }

  const insert = await env.DB.prepare(
    "INSERT INTO panier (utilisateur_id, status, created_at, updated_at) VALUES (?, 'OUVERT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
  )
    .bind(userId)
    .run();
  return insert.lastRowId;
}

async function fetchPanier(env, panierId) {
  const itemsRes = await env.DB.prepare(
    `SELECT pa.id,
            pa.box_id,
            pa.quantite,
            pa.prix_unitaire,
            b.name,
            b.pieces,
            b.price AS current_price
     FROM panier_articles pa
     JOIN boxes b ON b.id = pa.box_id
     WHERE pa.panier_id = ?
     ORDER BY pa.id DESC`
  )
    .bind(panierId)
    .all();

  const items = (itemsRes.results ?? []).map((row) => ({
    ...row,
    quantite: Number(row.quantite),
    prix_unitaire: Number(row.prix_unitaire),
    pieces: Number(row.pieces),
    current_price: Number(row.current_price),
  }));

  const total = items.reduce(
    (acc, item) => acc + item.prix_unitaire * item.quantite,
    0
  );

  return { panierId, items, total: Math.round(total * 100) / 100 };
}

async function handlePanier(request, env) {
  const method = request.method;
  const user = await getUserFromAuth(env, request);
  const userId = user?.id ?? null;
  const body = method === "GET" ? {} : await parseBody(request);

  const panierId = await ensurePanier(env, userId);

  if (method === "GET") {
    const payload = await fetchPanier(env, panierId);
    return json(payload);
  }

  if (method === "POST") {
    if (!body.boxId) return error("boxId requis");
    const boxId = Number(body.boxId);
    const quantity = body.quantite ? Math.max(1, Number(body.quantite)) : 1;

    const box = await env.DB.prepare("SELECT price FROM boxes WHERE id = ?")
      .bind(boxId)
      .first();
    if (!box) return error("box introuvable", 404);

    const existing = await env.DB.prepare(
      "SELECT id, quantite FROM panier_articles WHERE panier_id = ? AND box_id = ?"
    )
      .bind(panierId, boxId)
      .first();

    if (existing) {
      const newQuantity = Number(existing.quantite) + quantity;
      await env.DB.prepare(
        "UPDATE panier_articles SET quantite = ?, prix_unitaire = ? WHERE id = ?"
      )
        .bind(newQuantity, box.price, existing.id)
        .run();
    } else {
      await env.DB.prepare(
        "INSERT INTO panier_articles (panier_id, box_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)"
      )
        .bind(panierId, boxId, quantity, box.price)
        .run();
    }

    const payload = await fetchPanier(env, panierId);
    return json(payload, 201);
  }

  if (method === "PUT") {
    if (!body.boxId) return error("boxId requis");
    const boxId = Number(body.boxId);
    const quantity = Math.max(0, Number(body.quantite ?? 0));

    if (quantity === 0) {
      await env.DB.prepare(
        "DELETE FROM panier_articles WHERE panier_id = ? AND box_id = ?"
      )
        .bind(panierId, boxId)
        .run();
      const payload = await fetchPanier(env, panierId);
      return json(payload);
    }

    const updated = await env.DB.prepare(
      "UPDATE panier_articles SET quantite = ? WHERE panier_id = ? AND box_id = ?"
    )
      .bind(quantity, panierId, boxId)
      .run();

    if (updated.rowsAffected === 0) {
      return error("article introuvable", 404);
    }

    const payload = await fetchPanier(env, panierId);
    return json(payload);
  }

  if (method === "DELETE") {
    if (!body.boxId) return error("boxId requis");
    const boxId = Number(body.boxId);
    await env.DB.prepare(
      "DELETE FROM panier_articles WHERE panier_id = ? AND box_id = ?"
    )
      .bind(panierId, boxId)
      .run();
    const payload = await fetchPanier(env, panierId);
    return json(payload);
  }

  return error("methode non autorisee", 405);
}

async function handleLogin(request, env) {
  const body = await parseBody(request);
  const { email, password } = body;
  if (!email || !password) return error("email et mot de passe requis", 400);

  const user = await env.DB.prepare(
    "SELECT id, password FROM users WHERE email = ?"
  )
    .bind(email)
    .first();

  if (!user) return error("identifiants invalides", 401);

  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return error("identifiants invalides", 401);

  const token = randomToken();
  await env.DB.prepare("UPDATE users SET api_token = ? WHERE id = ?")
    .bind(token, user.id)
    .run();

  return json({ success: true, token });
}

async function handleRegister(request, env) {
  const body = await parseBody(request);
  const { firstname, lastname = "", email, password } = body;
  if (!firstname || !email || !password) {
    return error("champs requis manquants", 400);
  }

  const existing = await env.DB.prepare(
    "SELECT id FROM users WHERE email = ?"
  )
    .bind(email)
    .first();
  if (existing) return error("utilisateur deja existant", 409);

  const hash = bcrypt.hashSync(password, 10);
  await env.DB.prepare(
    "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)"
  )
    .bind(firstname, lastname, email, hash)
    .run();

  return json({ response: "user created" }, 201);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const pathname = trimPath(url.pathname || "/");

    if (pathname === "" || pathname === "/") {
      return json({ status: "ok" });
    }

    if (pathname === "/boxes" || pathname === "/api/boxes" || pathname === "/boxes/index.php") {
      try {
        return await handleBoxes(env);
      } catch (err) {
        return error("erreur serveur", 500);
      }
    }

    if (pathname === "/boxes/get.php" || pathname === "/boxes/get" || pathname === "/api/boxes/get") {
      try {
        const id = url.searchParams.get("id");
        return await handleBoxDetail(env, id);
      } catch (err) {
        return error("erreur serveur", 500);
      }
    }

    if (
      pathname === "/panier" ||
      pathname === "/api/panier" ||
      pathname === "/panier/index.php"
    ) {
      try {
        return await handlePanier(request, env);
      } catch (err) {
        return error("erreur serveur", 500);
      }
    }

    if (pathname === "/user/login.php" || pathname === "/api/user/login") {
      try {
        return await handleLogin(request, env);
      } catch (err) {
        return error("erreur serveur", 500);
      }
    }

    if (pathname === "/user/add_user.php" || pathname === "/api/user/register") {
      try {
        return await handleRegister(request, env);
      } catch (err) {
        return error("erreur serveur", 500);
      }
    }

    return error("route non trouvée", 404);
  },
};
