<?php

header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../Manager/UserManager.php';

// récupérer le token
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['error' => 'token manquant']);
    exit;
}

$token = $matches[1];
$userManager = new UserManager();
$user = $userManager->findUserByToken($token);

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'token invalide']);
    exit;
}

// récupérer les données
$content = file_get_contents('php://input');
$data = json_decode($content, true);

if (!isset($data['cookie']) || ($data['cookie'] !== 0 && $data['cookie'] !== 1)) {
    http_response_code(400);
    echo json_encode(['error' => 'valeur cookie invalide']);
    exit;
}

// mettre à jour le cookie
$success = $userManager->updateCookie($user['id'], $data['cookie']);

if ($success) {
    http_response_code(200);
    echo json_encode(['response' => 'cookie mis à jour']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'erreur lors de la mise à jour']);
}
?>
