<?php
// ====================================
// Configuration pour InfinityFree
// ====================================

// ✅ Configuration InfinityFree - eishi.free.nf
// Identifiants MySQL depuis le panneau de contrôle

$host = 'sql308.infinityfree.com';      // Hostname MySQL InfinityFree
$db   = 'if0_40850127_sushi';           // Nom de la base de données
$user = 'if0_40850127';                 // Nom d'utilisateur MySQL
$pass = 'gzoihgouihndvkj';              // Mot de passe MySQL
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
     die('Erreur de connexion à la base de données');
}
?>
