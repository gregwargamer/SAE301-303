<?php
// ====================================
// Configuration InfinityFree - Production
// Site : eishi.free.nf
// ====================================

$host = 'sql308.infinityfree.com';
$db   = 'if0_40850127_sushi';
$user = 'if0_40850127';
$pass = 'gzoihgouihndvkj';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     $connexion = $pdo; // Alias pour compatibilité
} catch (\PDOException $e) {
     // En production, ne pas afficher les erreurs sensibles
     error_log($e->getMessage());
     http_response_code(500);
     die(json_encode(['error' => 'Erreur de connexion à la base de données']));
}
?>
