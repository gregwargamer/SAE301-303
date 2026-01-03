<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/connexion-db.php';

    // recuperation de toutes les saveurs
    $stmt = $pdo->query("SELECT * FROM flavors ORDER BY name");
    $flavors = $stmt->fetchAll();

    echo json_encode($flavors);

?>