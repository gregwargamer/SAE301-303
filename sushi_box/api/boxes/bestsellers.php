<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/connexion-db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

    // meilleur ventes
    $stmt = $pdo->query("
        SELECT b.*, SUM(cd.quantite) as total_sold
        FROM boxes b
        INNER JOIN commande_details cd ON b.id = cd.id_box
        GROUP BY b.id
        ORDER BY total_sold DESC
        LIMIT 3
    ");

    $bestSellers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($bestSellers);