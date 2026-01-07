<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../config/connexion-db.php';
require_once __DIR__ . '/../Manager/UserManager.php';

// Fonction pour récupérer les headers
function getRequestHeaders() {
    $headers = array();
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
    } else {
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $header = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))));
                $headers[$header] = $value;
            }
        }
    }
    return $headers;
}

$headers = getRequestHeaders();

// Chercher X-Auth-Token OU Authorization
$authHeader = null;
foreach ($headers as $key => $value) {
    if (strtolower($key) === 'x-auth-token' || strtolower($key) === 'authorization') {
        $authHeader = $value;
        break;
    }
}

if (!$authHeader) {
    http_response_code(401);
    echo json_encode(['error' => 'token manquant']);
    exit;
}

$token = str_replace('Bearer ', '', $authHeader);

$userManager = new UserManager();
$user = $userManager->findUserByToken($token);

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'token invalide']);
    exit;
}

// verification methode post
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'methode non autorisee']);
    exit;
}

// recuperation des donnees
$input = json_decode(file_get_contents('php://input'), true);

// validation des champs requis
$requiredFields = ['telephone', 'adresse', 'code_postal', 'ville'];
foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "le champ $field est requis"]);
        exit;
    }
}

// validation code postal (5 chiffres)
if (!preg_match('/^\d{5}$/', $input['code_postal'])) {
    http_response_code(400);
    echo json_encode(['error' => 'code postal invalide (5 chiffres requis)']);
    exit;
}

try {
    $pdo->beginTransaction();

    // recuperation du panier ouvert de l'utilisateur
    $panierStmt = $pdo->prepare('SELECT id FROM panier WHERE utilisateur_id = :user_id AND status = "OUVERT" LIMIT 1');
    $panierStmt->execute(['user_id' => $user['id']]);
    $panier = $panierStmt->fetch();

    if (!$panier) {
        $pdo->rollBack(); //je laisse parce que ca a servi plusieurs fois quand la bdd change et que ca fait de la merde avec les users
        http_response_code(400);
        echo json_encode(['error' => 'panier vide ou inexistant']);
        exit;
    }

    // recuperation des articles du panier
    $articlesStmt = $pdo->prepare('
        SELECT pa.box_id, pa.quantite, pa.prix_unitaire 
        FROM panier_articles pa 
        WHERE pa.panier_id = :panier_id
    ');
    $articlesStmt->execute(['panier_id' => $panier['id']]);
    $articles = $articlesStmt->fetchAll();

    if (empty($articles)) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(['error' => 'panier vide']);
        exit;
    }

    // calcul du total
    $total = 0;
    foreach ($articles as $article) {
        $total += $article['prix_unitaire'] * $article['quantite'];
    }

    // mise à jour des informations utilisateur avec les données de livraison
    $updateUserStmt = $pdo->prepare('
        UPDATE users 
        SET telephone = :telephone, adresse = :adresse, code_postal = :code_postal, ville = :ville 
        WHERE id = :user_id
    ');
    $updateUserStmt->execute([
        'telephone' => $input['telephone'],
        'adresse' => $input['adresse'],
        'code_postal' => $input['code_postal'],
        'ville' => $input['ville'],
        'user_id' => $user['id']
    ]);

    // creation de la commande
    $commandeStmt = $pdo->prepare('
        INSERT INTO commandes (utilisateur_id, nom, prenom, telephone, adresse, code_postal, ville, total, status_commande)
        VALUES (:user_id, :nom, :prenom, :telephone, :adresse, :code_postal, :ville, :total, "en_attente")
    ');
    $commandeStmt->execute([
        'user_id' => $user['id'],
        'nom' => $user['lastname'],
        'prenom' => $user['firstname'],
        'telephone' => $input['telephone'],
        'adresse' => $input['adresse'],
        'code_postal' => $input['code_postal'],
        'ville' => $input['ville'],
        'total' => $total
    ]);

    $commandeId = $pdo->lastInsertId();

    // insertion des details de la commande
    $detailStmt = $pdo->prepare('
        INSERT INTO commande_details (commande_id, id_box, quantite, total_commande)
        VALUES (:commande_id, :box_id, :quantite, :total_ligne)
    ');

    foreach ($articles as $article) {
        $detailStmt->execute([
            'commande_id' => $commandeId,
            'box_id' => $article['box_id'],
            'quantite' => $article['quantite'],
            'total_ligne' => $article['prix_unitaire'] * $article['quantite']
        ]);
    }

    // fermeture du panier
    $closePanierStmt = $pdo->prepare('UPDATE panier SET status = "VALIDE" WHERE id = :panier_id');
    $closePanierStmt->execute(['panier_id' => $panier['id']]);

    $pdo->commit();

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'commande creee avec succes',
        'commande_id' => $commandeId,
        'total' => $total
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'erreur serveur: ' . $e->getMessage()]);
}
?>
