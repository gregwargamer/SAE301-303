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

// recupere l'utilisateur a partir du token pas comme avant ou ca prenaut un truc randim 
function getCurrentUser(): ?array
{
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        return null;
    }

    $authHeader = $headers['Authorization'];
    $token = str_replace('Bearer ', '', $authHeader);

    $userManager = new UserManager();
    return $userManager->findUserByToken($token);
}

function ensurePanier(PDO $pdo): int
{
    $user = getCurrentUser();

    if (!$user) {
        respondError('Vous devez être connecté', 401);
    }

    $userId = $user['id'];

    // Cherche le panier ouvert de l'utilisateur
    $stmt = $pdo->prepare('SELECT id FROM panier WHERE utilisateur_id = :user_id AND status = "OUVERT" LIMIT 1');
    $stmt->execute(['user_id' => $userId]);
    $panierId = $stmt->fetchColumn();

    if ($panierId) {
        return (int) $panierId;
    }

    $insert = $pdo->prepare('INSERT INTO panier (utilisateur_id, status) VALUES (:user_id, "OUVERT")');
    $insert->execute(['user_id' => $userId]);

    return (int) $pdo->lastInsertId();
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

    $subtotal = array_reduce(
        $items,
        static fn(float $carry, array $item) => $carry + ((float) $item['prix_unitaire'] * (int) $item['quantite']),
        0.0
    );

    // calcul des reductions
    $user = getCurrentUser();
    $isEtudiant = $user && !empty($user['etudiant']);
    $reductionEtudiant = $isEtudiant ? round($subtotal * 0.10, 2) : 0;

    $totalApresEtudiant = $subtotal - $reductionEtudiant;
    $reduction100 = ($totalApresEtudiant > 100) ? round($totalApresEtudiant * 0.015, 2) : 0;

    $total = $totalApresEtudiant - $reduction100;

    return [
        'panierId' => $panierId,
        'items' => $items,
        'subtotal' => round($subtotal, 2),
        'reductionEtudiant' => $reductionEtudiant,
        'reduction100' => $reduction100,
        'total' => round($total, 2),
    ];
}

