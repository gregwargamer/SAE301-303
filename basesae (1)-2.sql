-- D1 (SQLite) import for database `basesae`
PRAGMA foreign_keys=off;

DROP TABLE IF EXISTS panier_articles;
DROP TABLE IF EXISTS panier;
DROP TABLE IF EXISTS commande_details;
DROP TABLE IF EXISTS commandes;
DROP TABLE IF EXISTS box_foods;
DROP TABLE IF EXISTS box_flavors;
DROP TABLE IF EXISTS foods;
DROP TABLE IF EXISTS flavors;
DROP TABLE IF EXISTS boxes;
DROP TABLE IF EXISTS users;

PRAGMA foreign_keys=on;

CREATE TABLE boxes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  pieces INTEGER NOT NULL,
  price REAL NOT NULL,
  image TEXT
);

INSERT INTO boxes (id, name, pieces, price, image) VALUES
(1, 'Tasty Blend', 12, 12.50, 'tasty-blend'),
(2, 'Amateur Mix', 18, 15.90, 'amateur-mix'),
(3, 'Saumon Original', 11, 12.50, 'saumon-original'),
(4, 'Salmon Lovers', 18, 15.90, 'salmon-lovers'),
(5, 'Salmon Classic', 10, 15.90, 'salmon-classic'),
(6, 'Master Mix', 12, 15.90, 'master-mix'),
(7, 'Sunrise', 18, 15.90, 'sunrise'),
(8, 'Sando Box Chicken Katsu', 13, 15.90, 'sando-box-chicken-katsu'),
(9, 'Sando Box Salmon Aburi', 13, 15.90, 'sando-box-salmon-aburi'),
(10, 'Super Salmon', 24, 19.90, 'super-salmon'),
(11, 'California Dream', 24, 19.90, 'california-dream'),
(12, 'Gourmet Mix', 22, 24.50, 'gourmet-mix'),
(13, 'Fresh Mix', 22, 24.50, 'fresh-mix');

CREATE TABLE flavors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO flavors (id, name) VALUES
(2, 'avocat'),
(3, 'cheese'),
(4, 'coriandre'),
(7, 'crevette'),
(1, 'saumon'),
(9, 'seriole lalandi'),
(8, 'spicy'),
(5, 'thon'),
(6, 'viande');

CREATE TABLE foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO foods (id, name) VALUES
(16, 'California Chicken Katsu'),
(15, 'California Crevette'),
(20, 'California French Salmon'),
(19, 'California French Touch'),
(4, 'California Pacific'),
(1, 'California Saumon Avocat'),
(10, 'California Thon Avocat'),
(11, 'California Thon Cuit Avocat'),
(21, 'California Yellowtail Ponzu'),
(5, 'Edamame/Salade de chou'),
(8, 'Maki Cheese Avocat'),
(14, 'Maki Salmon'),
(6, 'Maki Salmon Roll'),
(12, 'Sando Chicken Katsu'),
(13, 'Sando Salmon Aburi'),
(18, 'Signature Dragon Roll'),
(22, 'Signature Rock''n Roll'),
(3, 'Spring Avocat Cheese'),
(7, 'Spring Saumon Avocat'),
(17, 'Spring Tataki Saumon'),
(23, 'Sushi Salmon'),
(2, 'Sushi Saumon'),
(24, 'Sushi Saumon Tsukudani'),
(9, 'Sushi Thon');

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT UNIQUE,
  password TEXT,
  created_at TEXT,
  api_token TEXT
);

INSERT INTO users (id, firstname, lastname, email, password, created_at, api_token) VALUES
(10, 'Prenom', 'Nom', 'exemple@gmail.com', '$2y$10$Fpj4JOVf2Jd9T13usQQvL.m7Rg.AIQRS6E6WPndcxlrQ4ASdQDy8m', NULL, '3ea27ffb7e00a4d705d34e3439400d225e12026c9b7be3b02fd34512eb21c900'),
(11, 'Maywix', '', 'farruggia48@hotmail.com', '$2y$10$vtGDbikeQqJrYsExcO.FG.nZVDzG9Vc7N3TXJaW6cX6JecHP1waMq', NULL, '046ad52e705e1dc50213d40051148c5414b26f89d20eb310d06b5dee838fb650');

CREATE TABLE box_flavors (
  box_id INTEGER NOT NULL,
  flavor_id INTEGER NOT NULL,
  PRIMARY KEY (box_id, flavor_id),
  FOREIGN KEY (box_id) REFERENCES boxes(id) ON DELETE CASCADE,
  FOREIGN KEY (flavor_id) REFERENCES flavors(id) ON DELETE CASCADE
);

INSERT INTO box_flavors (box_id, flavor_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(3, 1),
(3, 2),
(4, 1),
(4, 2),
(4, 4),
(5, 1),
(6, 1),
(6, 2),
(6, 5),
(7, 1),
(7, 2),
(7, 3),
(7, 5),
(8, 1),
(8, 2),
(8, 3),
(8, 6),
(9, 1),
(9, 2),
(9, 5),
(10, 1),
(10, 2),
(10, 3),
(10, 4),
(11, 1),
(11, 2),
(11, 5),
(11, 6),
(11, 7),
(11, 8),
(12, 1),
(12, 2),
(12, 4),
(12, 6),
(12, 8),
(12, 9),
(13, 1),
(13, 2),
(13, 3),
(13, 5),
(13, 8);

CREATE TABLE box_foods (
  box_id INTEGER NOT NULL,
  food_id INTEGER NOT NULL,
  quantity REAL NOT NULL,
  PRIMARY KEY (box_id, food_id),
  FOREIGN KEY (box_id) REFERENCES boxes(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

INSERT INTO box_foods (box_id, food_id, quantity) VALUES
(1, 1, 3.00),
(1, 2, 3.00),
(1, 3, 3.00),
(1, 4, 3.00),
(1, 5, 1.00),
(2, 1, 3.00),
(2, 5, 1.00),
(2, 6, 3.00),
(2, 7, 3.00),
(2, 8, 6.00),
(3, 1, 6.00),
(3, 2, 5.00),
(3, 5, 1.00),
(4, 1, 6.00),
(4, 2, 6.00),
(4, 5, 1.00),
(4, 7, 6.00),
(5, 2, 10.00),
(5, 5, 1.00),
(6, 1, 3.00),
(6, 2, 4.00),
(6, 5, 1.00),
(6, 9, 2.00),
(6, 10, 3.00),
(7, 1, 6.00),
(7, 5, 1.00),
(7, 6, 6.00),
(7, 11, 6.00),
(8, 1, 6.00),
(8, 5, 1.00),
(8, 6, 6.00),
(8, 11, 6.00),
(8, 12, 0.50),
(9, 1, 6.00),
(9, 5, 1.00),
(9, 11, 6.00),
(9, 13, 0.50),
(10, 1, 6.00),
(10, 5, 1.00),
(10, 6, 6.00),
(10, 7, 6.00),
(10, 14, 6.00),
(11, 1, 6.00),
(11, 5, 1.00),
(11, 11, 6.00),
(11, 15, 6.00),
(11, 16, 6.00),
(12, 5, 1.00),
(12, 17, 6.00),
(12, 18, 4.00),
(12, 19, 3.00),
(12, 20, 6.00),
(12, 21, 3.00),
(13, 4, 6.00),
(13, 5, 1.00),
(13, 6, 6.00),
(13, 22, 4.00),
(13, 23, 4.00),
(13, 24, 2.00);

CREATE TABLE commandes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT,
  adresse TEXT,
  total REAL,
  status_commande TEXT,
  date_commande TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES users(id) ON UPDATE CASCADE
);

CREATE TABLE commande_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  commande_id INTEGER NOT NULL,
  id_box INTEGER NOT NULL,
  quantite INTEGER NOT NULL,
  total_commande REAL,
  FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_box) REFERENCES boxes(id) ON UPDATE CASCADE
);

CREATE TABLE panier (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER,
  status TEXT NOT NULL CHECK (status IN ('OUVERT','VALIDE')) DEFAULT 'OUVERT',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES users(id)
);

INSERT INTO panier (id, utilisateur_id, status, created_at, updated_at) VALUES
(43, 11, 'OUVERT', '2025-12-07 15:01:23', '2025-12-07 15:01:23');

CREATE TABLE panier_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  panier_id INTEGER NOT NULL,
  box_id INTEGER NOT NULL,
  quantite INTEGER NOT NULL DEFAULT 1,
  prix_unitaire REAL NOT NULL,
  FOREIGN KEY (panier_id) REFERENCES panier(id) ON DELETE CASCADE,
  FOREIGN KEY (box_id) REFERENCES boxes(id)
);
