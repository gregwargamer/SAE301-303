<?php

// vive le debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../Manager/Boxmanager.php';

$boxManager = new BoxManager();

$boxes = $boxManager->findAll();

// erm jsp il faut ca sinon ca marhce pas 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');
echo json_encode($boxes);
?>
