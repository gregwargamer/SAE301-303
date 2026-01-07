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

$authHeader = null;
foreach ($headers as $key => $value) {
    if (strtolower($key) === 'authorization') {
        $authHeader = $value;
        break;
    }
}

$tokenSent = $authHeader ? str_replace('Bearer ', '', $authHeader) : null;

try {
    // Récupérer TOUS les tokens
    $stmt = $connexion->query('SELECT id, firstname, lastname, email, api_token FROM users WHERE api_token IS NOT NULL');
    $allTokens = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Comparer avec le token envoyé
    $matches = [];
    foreach ($allTokens as $user) {
        $dbToken = $user['api_token'];
        $matches[] = [
            'user_id' => $user['id'],
            'user_name' => $user['firstname'] . ' ' . $user['lastname'],
            'email' => $user['email'],
            'token_length' => strlen($dbToken),
            'sent_token_length' => $tokenSent ? strlen($tokenSent) : 0,
            'exact_match' => $tokenSent === $dbToken,
            'token_start' => substr($dbToken, 0, 20),
            'sent_token_start' => $tokenSent ? substr($tokenSent, 0, 20) : null
        ];
    }
    
    echo json_encode([
        'token_sent' => $tokenSent,
        'token_sent_length' => $tokenSent ? strlen($tokenSent) : 0,
        'comparisons' => $matches
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
