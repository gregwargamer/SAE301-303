<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/connexion-db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Récupère le nombre de nouveautés à afficher (par défaut 6)
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 6;

// Nouveautés : derniers produits ajoutés (triés par ID décroissant)
$stmt = $pdo->prepare("
    SELECT *
    FROM boxes
    ORDER BY id DESC
    LIMIT :limit
");
$stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
$stmt->execute();

$nouveautes = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($nouveautes);
?>
