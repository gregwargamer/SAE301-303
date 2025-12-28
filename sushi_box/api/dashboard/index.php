<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/connexion-db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'categories') {
        // Statistiques par saveurs
        $stmt = $pdo->query("
            SELECT f.name as categorie, COUNT(bf.box_id) as total
            FROM flavors f
            LEFT JOIN box_flavors bf ON f.id = bf.flavor_id
            GROUP BY f.id, f.name
            ORDER BY total DESC
        ");
        $data = $stmt->fetchAll();
        echo json_encode($data);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Action non valide ou manquante']);
    }