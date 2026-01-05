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

$content = file_get_contents('php://input');
$data = json_decode($content, true);

if (!isset($data['email'], $data['password']) || empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'rempli les informations necessaires stp']);
    exit;
}

$userManager = new UserManager();
$user = $userManager->findUserByEmail($data['email']);
// si le mdp correspond pas ou si l'email est incorrect
if (!$user || !password_verify($data['password'], $user['password'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
    exit;
}

$token = bin2hex(random_bytes(32)); 

$userManager->updateToken($user['id'], $token);

http_response_code(200);
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'token' => $token,
    'user_id' => $user['id'],
    'firstname' => $user['firstname'],
    'lastname' => $user['lastname'],
]);
exit;
?>