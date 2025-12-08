<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

require_once 'common.php';

global $pdo;

$method = $_SERVER['REQUEST_METHOD'];
$input = getJsonInput();

try {
    if ($method === 'GET') {
        $panierId = ensurePanier($pdo);
        respondJson(fetchPanierItems($pdo, $panierId));
    }

    if ($method === 'POST') {
        if (!isset($input['boxId'])) {
            respondError("boxId is required");
        }

        $boxId = (int)$input['boxId'];
        $quantity = isset($input['quantite']) ? max(1, (int)$input['quantite']) : 1;

        $panierId = ensurePanier($pdo);

        $pdo->beginTransaction();

        $boxStmt = $pdo->prepare('SELECT price FROM boxes WHERE id = :id');
        $boxStmt->execute(['id' => $boxId]);
        $box = $boxStmt->fetch();
        if (!$box) {
            $pdo->rollBack();
            respondError('Box introuvable', 404);
        }

        $existingStmt = $pdo->prepare('SELECT id, quantite FROM panier_articles WHERE panier_id = :panier AND box_id = :box');
        $existingStmt->execute(['panier' => $panierId, 'box' => $boxId]);
        $existing = $existingStmt->fetch();

        if ($existing) {
            $newQuantity = (int)$existing['quantite'] + $quantity;
            $update = $pdo->prepare('UPDATE panier_articles SET quantite = :quantite WHERE id = :id');
            $update->execute([
                'quantite' => $newQuantity,
                'id' => $existing['id'],
            ]);
        } else {
            $insert = $pdo->prepare(
                'INSERT INTO panier_articles (panier_id, box_id, quantite, prix_unitaire)
                 VALUES (:panier, :box, :quantite, :prix)'
            );
            $insert->execute([
                'panier' => $panierId,
                'box' => $boxId,
                'quantite' => $quantity,
                'prix' => $box['price'],
            ]);
        }

        $pdo->commit();
        respondJson(fetchPanierItems($pdo, $panierId));
    }

    if ($method === 'DELETE') {
        $payload = $input ?: getJsonInput();
        if (!isset($payload['boxId'])) {
            respondError("boxId is required");
        }

        $boxId = (int)$payload['boxId'];
        $panierId = ensurePanier($pdo);

        $stmt = $pdo->prepare('DELETE FROM panier_articles WHERE panier_id = :panier AND box_id = :box');
        $stmt->execute([
            'panier' => $panierId,
            'box' => $boxId,
        ]);

        respondJson(fetchPanierItems($pdo, $panierId));
    }

    respondError('Méthode non autorisée', 405);
} catch (Throwable $th) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    respondError($th->getMessage(), 500);
}

