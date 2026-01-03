<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/connexion-db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Best-sellers : produits les plus ajoutés au panier
// On utilise la table panier_articles pour compter les ajouts
$stmt = $pdo->query("
    SELECT b.*, COALESCE(SUM(pa.quantite), 0) as total_cart_adds
    FROM boxes b
    LEFT JOIN panier_articles pa ON b.id = pa.box_id
    GROUP BY b.id
    ORDER BY total_cart_adds DESC
    LIMIT 3
");

$bestSellers = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($bestSellers);
?>