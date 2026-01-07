<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/connexion-db.php';

// Fonction pour récupérer les headers
function getRequestHeaders() {
    $headers = array();
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
    } else {
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

// Chercher Authorization
$authHeader = null;
foreach ($headers as $key => $value) {
    if (strtolower($key) === 'authorization') {
        $authHeader = $value;
        break;
    }
}

$token = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;

try {
    // Compter tous les users
    $stmt = $connexion->query('SELECT COUNT(*) as total FROM users');
    $totalUsers = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Compter les users avec token
    $stmt = $connexion->query('SELECT COUNT(*) as total FROM users WHERE api_token IS NOT NULL');
    $usersWithToken = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Chercher le token spécifique
    $userFound = null;
    if ($token) {
        $stmt = $connexion->prepare('SELECT id, firstname, lastname, email, api_token FROM users WHERE api_token = :token');
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $userFound = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // Lister les 5 derniers tokens
    $stmt = $connexion->query('SELECT id, firstname, lastname, email, LEFT(api_token, 20) as token_preview FROM users WHERE api_token IS NOT NULL ORDER BY id DESC LIMIT 5');
    $recentTokens = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'headers_received' => $headers,
        'token_sent' => $token,
        'total_users' => $totalUsers,
        'users_with_token' => $usersWithToken,
        'token_found' => $userFound ? true : false,
        'user_data' => $userFound,
        'recent_tokens' => $recentTokens
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
