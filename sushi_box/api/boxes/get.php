<?php

// Debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../Manager/Boxmanager.php';

try {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID manquant']);
        exit;
    }

    $boxManager = new BoxManager();
    $box = $boxManager->findById($_GET['id']);

    if (!$box) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Produit non trouvé']);
        exit;
    }

    echo json_encode(['success' => true, 'data' => $box]);

} catch (\Throwable $th) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $th->getMessage()]);
}
