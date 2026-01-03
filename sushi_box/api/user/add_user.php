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

// verification que tout est présent et non vide (sans lastname)
if (!isset($data['firstname'], $data['email'], $data['password']) || empty($data['firstname']) || empty($data['email']) || empty($data['password'])) {
    // si des champs sont pas remplis ou vides
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'missing required fields']);
    exit;
}


// si tout est bon
$userManager = new UserManager();

// verification si l'utilisateur existe deja
if ($userManager->findUserByEmail($data['email'])) {
    http_response_code(409); //repond le code 409
    header('Content-Type: application/json');
    echo json_encode(['error' => 'utilisateur deja existant']);
    exit;
}
//si n'existe pas 

// appel de UserManager puis appel de createUser (lastname et etudiant optionnels)
$lastname = isset($data['lastname']) ? $data['lastname'] : '';
$etudiant = isset($data['etudiant']) ? $data['etudiant'] : false;
$success = $userManager->createUser($data['firstname'], $lastname, $data['email'], $data['password'], $etudiant);

if ($success) {
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode(['response' => 'user created']);
} else {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['response' => 'error during user creation']);
}
?>