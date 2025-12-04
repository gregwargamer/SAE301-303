<?php

class BoxManager {
    private $pdo;

    public function __construct()
    {
        $this->pdo = new PDO('mysql:host=localhost;dbname=basesae', 'root', '');
    }

    // recuperation de toutes les boites, de leurs aliments et de leurs saveurs
    public function findAll() {
        $boxes = $this->pdo->query("SELECT * FROM boxes")->fetchAll(PDO::FETCH_ASSOC);

        foreach ($boxes as &$box) {
            // conversion du prix en float
            $box['price'] = round($box['price'], 2);

            $stmt = $this->pdo->prepare("
                SELECT f.name, CAST(bf.quantity AS UNSIGNED) AS quantity
                FROM box_foods bf
                JOIN foods f ON bf.food_id = f.id
                WHERE bf.box_id = :id
            ");
            $stmt->execute(['id' => $box['id']]);
            $box['foods'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // etape 3 : flavors
            $stmt = $this->pdo->prepare("
                SELECT fl.name
                FROM box_flavors bf
                JOIN flavors fl ON bf.flavor_id = fl.id
                WHERE bf.box_id = :id
            ");
            $stmt->execute(['id' => $box['id']]);
            $box['flavors'] = array_column($stmt->fetchAll(), 'name');
        }

        return $boxes;

    }
}
