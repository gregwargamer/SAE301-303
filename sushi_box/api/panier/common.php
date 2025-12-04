<?php

require_once __DIR__ . '/../../config/connexion-db.php';

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

function ensurePanier(PDO $pdo): int
{
    $stmt = $pdo->prepare('SELECT id FROM panier WHERE status = "OUVERT" LIMIT 1');
    $stmt->execute();
    $panierId = $stmt->fetchColumn();

    if ($panierId) {
        return (int)$panierId;
    }

    $insert = $pdo->prepare('INSERT INTO panier (utilisateur_id) VALUES (NULL)');
    $insert->execute();

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

