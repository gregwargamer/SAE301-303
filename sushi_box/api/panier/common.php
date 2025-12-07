<?php

require_once __DIR__ . '/../../config/connexion-db.php';
require_once __DIR__ . '/../Manager/UserManager.php';

function getJsonInput(): array
{
    $raw = file_get_contents('php://input');
    if ($raw !== false && $raw !== '') {
        $decoded = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }
    }

    if (!empty($_POST)) {
        return $_POST;
    }

    return $_GET ?? [];
}

function respondJson(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function respondError(string $message, int $status = 400): void
{
    respondJson(['error' => $message], $status);
}

// verifie le token et donen luser
function getAuthenticatedUser(PDO $pdo): ?array
{
    $headers = getallheaders() ?: [];
    
    //cherche le token dans la requete http et si pas de token, cherche dans server 
    if (!isset($headers['Authorization'])) {
        $headers['Authorization'] = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
    }
    
    if (empty($headers['Authorization'])) {
        return null;
    }

    $authHeader = $headers['Authorization'];
    $token = str_replace('Bearer ', '', $authHeader);
    
    if (empty($token)) {
        return null;
    }

    $userManager = new UserManager();
    $user = $userManager->findUserByToken($token);

    return $user ?: null;
}

function ensurePanier(PDO $pdo, int $userId): int
{
    // cherche le panier ouvert de luser
    $stmt = $pdo->prepare('SELECT id FROM panier WHERE status = "OUVERT" AND utilisateur_id = :user_id LIMIT 1');
    $stmt->execute(['user_id' => $userId]);
    $panierId = $stmt->fetchColumn();

    if ($panierId) {
        return (int)$panierId;
    }

    // cree un nouveau panier pour luser
    $insert = $pdo->prepare('INSERT INTO panier (utilisateur_id) VALUES (:user_id)');
    $insert->execute(['user_id' => $userId]);
    return (int)$pdo->lastInsertId();
}

function fetchPanierItems(PDO $pdo, int $panierId): array
{
    $stmt = $pdo->prepare(
        'SELECT pa.id,
                pa.box_id,
                pa.quantite,
                pa.prix_unitaire,
                b.name,
                b.pieces,
                b.price AS current_price
         FROM panier_articles pa
         JOIN boxes b ON b.id = pa.box_id
         WHERE pa.panier_id = :panier
         ORDER BY pa.id DESC'
    );
    $stmt->execute(['panier' => $panierId]);
    $items = $stmt->fetchAll();

    $total = array_reduce(
        $items,
        static fn (float $carry, array $item) => $carry + ((float)$item['prix_unitaire'] * (int)$item['quantite']),
        0.0
    );

    return [
        'panierId' => $panierId,
        'items' => $items,
        'total' => round($total, 2),
    ];
}

