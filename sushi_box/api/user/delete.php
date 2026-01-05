<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE');
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
    $stmt = $connexion->prepare('SELECT id FROM users WHERE api_token = :token');
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Token invalide']);
        exit();
    }
    
    $userId = $user['id'];
    
    // Supprimer les détails de commandes
    $connexion->exec("DELETE cd FROM commande_details cd 
                      INNER JOIN commandes c ON cd.commande_id = c.id 
                      WHERE c.utilisateur_id = $userId");
    
    // Supprimer les articles du panier
    $connexion->exec("DELETE pa FROM panier_articles pa 
                      INNER JOIN panier p ON pa.panier_id = p.id 
                      WHERE p.utilisateur_id = $userId");
    
    // Supprimer le panier
    $stmt = $connexion->prepare('DELETE FROM panier WHERE utilisateur_id = :user_id');
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    
    // Supprimer les commandes
    $stmt = $connexion->prepare('DELETE FROM commandes WHERE utilisateur_id = :user_id');
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    
    // Supprimer l'utilisateur
    $stmt = $connexion->prepare('DELETE FROM users WHERE id = :id');
    $stmt->bindParam(':id', $userId);
    $stmt->execute();
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Compte supprimé']);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
}
