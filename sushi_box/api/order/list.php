<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../Manager/UserManager.php';
require_once __DIR__ . '/../../config/connexion-db.php';

// Fonction pour récupérer les headers de manière compatible
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

// Chercher X-Auth-Token OU Authorization (insensible à la casse)
$authHeader = null;
foreach ($headers as $key => $value) {
    if (strtolower($key) === 'x-auth-token' || strtolower($key) === 'authorization') {
        $authHeader = $value;
        break;
    }
}

if (!$authHeader) {
    http_response_code(401);
    echo json_encode(['error' => 'token manquant']);
    exit;
}

$token = str_replace('Bearer ', '', $authHeader);

$userManager = new UserManager();
$user = $userManager->findUserByToken($token);

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'token pas fourni']);
    exit;
}

// Utiliser $connexion au lieu de $pdo
if (!isset($connexion)) { 
    http_response_code(500);
    echo json_encode(['error' => 'database connection failed']);
    exit;
}

$sql = "SELECT * FROM commandes WHERE utilisateur_id = :user_id ORDER BY date_commande DESC";
$query = $connexion->prepare($sql);
$query->execute(['user_id' => $user['id']]);
$orders = $query->fetchAll(PDO::FETCH_ASSOC);

// Pour chaque commande, récupérer les détails (boxes)
foreach ($orders as &$order) {
    $detailsSql = "SELECT cd.*, b.name as box_name, b.price 
                   FROM commande_details cd 
                   INNER JOIN boxes b ON cd.id_box = b.id 
                   WHERE cd.commande_id = :commande_id";
    $detailsQuery = $connexion->prepare($detailsSql);
    $detailsQuery->execute(['commande_id' => $order['id']]);
    $order['details'] = $detailsQuery->fetchAll(PDO::FETCH_ASSOC);
}

if (empty($orders)) {
    http_response_code(200);
    echo json_encode([]);
} else {
    http_response_code(200);
    echo json_encode($orders);
}
?>
