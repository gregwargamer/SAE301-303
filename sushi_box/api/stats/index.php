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
    // Total des utilisateurs (table users) - excluant ceux qui refusent les cookies commerciaux
    $stmtTotal = $connexion->query("SELECT COUNT(*) as total FROM users WHERE cookie = 0 OR cookie IS NULL");
    $totalUsers = $stmtTotal->fetch(PDO::FETCH_ASSOC)['total'];

    // Nombre d'étudiants inscrits - excluant ceux qui refusent les cookies commerciaux
    $stmtStudents = $connexion->query("SELECT COUNT(*) as total FROM users WHERE etudiant = 1 AND (cookie = 0 OR cookie IS NULL)");
    $totalStudents = $stmtStudents->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Calculer le pourcentage d'étudiants
    $studentPercentage = $totalUsers > 0 ? round(($totalStudents / $totalUsers) * 100, 2) : 0;
    
    // Panier moyen (moyenne des totaux des commandes) - excluant les utilisateurs qui refusent les cookies commerciaux
    $stmtAvgCart = $connexion->query("
        SELECT AVG(c.total) as avg_cart 
        FROM commandes c
        INNER JOIN users u ON c.utilisateur_id = u.id
        WHERE c.total > 0 AND (u.cookie = 0 OR u.cookie IS NULL)
    ");
    $avgCart = $stmtAvgCart->fetch(PDO::FETCH_ASSOC)['avg_cart'];
    $avgCart = $avgCart ? round($avgCart, 2) : 0;

    // Nombre total de commandes - excluant les utilisateurs qui refusent les cookies commerciaux
    $stmtOrders = $connexion->query("
        SELECT COUNT(*) as total 
        FROM commandes c
        INNER JOIN users u ON c.utilisateur_id = u.id
        WHERE u.cookie = 0 OR u.cookie IS NULL
    ");
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