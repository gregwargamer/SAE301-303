<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../config/connexion-db.php';


    // Labels des mois en français
    $moisLabels = [
        '01' => 'Janvier', '02' => 'Février', '03' => 'Mars', '04' => 'Avril',
        '05' => 'Mai', '06' => 'Juin', '07' => 'Juillet', '08' => 'Août',
        '09' => 'Septembre', '10' => 'Octobre', '11' => 'Novembre', '12' => 'Décembre'
    ];

    $data = [];
    
    // Créer un tableau avec les 12 mois de l'année demandée initialisés à 0
    for ($i = 1; $i <= 12; $i++) {
        $moisNum = str_pad($i, 2, '0', STR_PAD_LEFT);
        $key = $year . '-' . $moisNum;
        
        $data[$key] = [
            'mois' => $key,
            'label' => $moisLabels[$moisNum],
            'chiffre_affaires' => 0,
            'nombre_commandes' => 0
        ];
    }

    if ($dateColumn) {
        // Récupérer le chiffre d'affaires pour l'année demandée
        $stmt = $pdo->prepare("
            SELECT 
                DATE_FORMAT($dateColumn, '%Y-%m') as mois,
                SUM(total) as chiffre_affaires,
                COUNT(*) as nombre_commandes
            FROM commandes
            WHERE YEAR($dateColumn) = :year
            GROUP BY DATE_FORMAT($dateColumn, '%Y-%m')
            ORDER BY mois ASC
        ");
        $stmt->execute(['year' => $year]);
        $results = $stmt->fetchAll();

        // Remplir avec les données réelles
        foreach ($results as $row) {
            if (isset($data[$row['mois']])) {
                $data[$row['mois']]['chiffre_affaires'] = floatval($row['chiffre_affaires']);
                $data[$row['mois']]['nombre_commandes'] = intval($row['nombre_commandes']);
            }
        }
    }

    // Récupérer les années disponibles (pour le sélecteur)
    $availableYears = [];
    if ($dateColumn) {
        $yearsStmt = $pdo->query("
            SELECT DISTINCT YEAR($dateColumn) as year 
            FROM commandes 
            WHERE $dateColumn IS NOT NULL
            ORDER BY year DESC
        ");
        $yearsResult = $yearsStmt->fetchAll();
        $availableYears = array_column($yearsResult, 'year');
    }
    
    // S'assurer que l'année courante est dans la liste
    $currentYear = intval(date('Y'));
    if (!in_array($currentYear, $availableYears)) {
        array_unshift($availableYears, $currentYear);
    }
    
    // Ajouter quelques années précédentes si la liste est vide
    if (count($availableYears) < 3) {
        for ($y = $currentYear; $y >= $currentYear - 2; $y--) {
            if (!in_array($y, $availableYears)) {
                $availableYears[] = $y;
            }
        }
        rsort($availableYears);
    }

    // Calculer le total
    $totalRevenue = array_sum(array_column($data, 'chiffre_affaires'));
    $totalOrders = array_sum(array_column($data, 'nombre_commandes'));

    echo json_encode([
        'success' => true,
        'year' => $year,
        'available_years' => $availableYears,
        'data' => array_values($data),
        'total_revenue' => $totalRevenue,
        'total_orders' => $totalOrders
    ]);
?>
