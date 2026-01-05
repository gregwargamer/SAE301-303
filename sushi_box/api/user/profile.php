<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../config/connexion-db.php';

// Vérifier l'authentification
$headers = apache_request_headers();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Token manquant']);
    exit();
}

$token = str_replace('Bearer ', '', $headers['Authorization']);

try {
    // Récupérer l'utilisateur à partir du token
    $stmt = $connexion->prepare('SELECT * FROM users WHERE api_token = :token');
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Token invalide']);
        exit();
    }
    
    // Ne pas renvoyer le mot de passe
    unset($user['password']);
    
    http_response_code(200);
    echo json_encode($user);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
}
