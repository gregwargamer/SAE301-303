<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../config/connexion-db.php';

// Fonction pour récupérer les headers de manière compatible
function getRequestHeaders() {
    $headers = array();
    
    // Essayer getallheaders() d'abord
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
    } else {
        // Fallback pour les serveurs qui ne supportent pas getallheaders()
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $header = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))));
                $headers[$header] = $value;
            }
        }
    }
    
    return $headers;
}

$headers = getRequestHeaders();

// Chercher Authorization (insensible à la casse)
$authHeader = null;
foreach ($headers as $key => $value) {
    if (strtolower($key) === 'authorization') {
        $authHeader = $value;
        break;
    }
}

if (!$authHeader) {
    http_response_code(401);
    echo json_encode(['error' => 'Token manquant']);
    exit();
}

$token = str_replace('Bearer ', '', $authHeader);

try {
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
