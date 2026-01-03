<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/connexion-db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

try {
    // Total des utilisateurs (table users)
    $stmtTotal = $pdo->query("SELECT COUNT(*) as total FROM users");
    $totalUsers = $stmtTotal->fetch(PDO::FETCH_ASSOC)['total'];

    // Vérifier si la colonne etudiant existe dans la table users
    $totalStudents = 0;
    $studentPercentage = 0;
    
   
    // Panier moyen (moyenne des totaux des commandes)
    $stmtAvgCart = $pdo->query("
        SELECT AVG(total) as avg_cart 
        FROM commandes 
        WHERE total > 0
    ");
    $avgCart = $stmtAvgCart->fetch(PDO::FETCH_ASSOC)['avg_cart'];
    $avgCart = $avgCart ? round($avgCart, 2) : 0;

    // Nombre total de commandes
    $stmtOrders = $pdo->query("SELECT COUNT(*) as total FROM commandes");
    $totalOrders = $stmtOrders->fetch(PDO::FETCH_ASSOC)['total'];

    echo json_encode([
        'totalUsers' => (int)$totalUsers,
        'totalStudents' => (int)$totalStudents,
        'studentPercentage' => $studentPercentage,
        'avgCart' => $avgCart,
        'totalOrders' => (int)$totalOrders
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>