<?php

class UserManager {
    private $pdo;

    public function __construct()
    {
        require __DIR__ . '/../../config/connexion-db.php';
        $this->pdo = $pdo;
    }

    //pour creer un utilisateur
    public function createUser($firstname, $lastname, $email, $password) {
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO users (firstname, lastname, email, password) VALUES (:firstname, :lastname, :email, :password)";
        
        $query = $this->pdo->prepare($sql);
        
        return $query->execute([
            'firstname' => $firstname,
            'lastname' => $lastname,
            'email' => $email,
            'password' => $passwordHash
        ]);
    }

    // verifie si l'email existe déjà
    public function findUserByEmail($email) {
        $query = $this->pdo->prepare("SELECT * FROM users WHERE email = :email");
        $query->execute(['email' => $email]);
        return $query->fetch();
    }

    // verifie si le token existe
    public function findUserByToken($token) {
        $query = $this->pdo->prepare("SELECT * FROM users WHERE api_token = :token");
        $query->execute(['token' => $token]);
        return $query->fetch();
    }

    // met a jour le token
    public function updateToken($userId, $token) {
        $sql = "UPDATE users SET api_token = :token WHERE id = :user_id";
        $query = $this->pdo->prepare($sql);
        return $query->execute([
            'token' => $token,
            'user_id' => $userId
        ]);
    }
}
