-- Ajouter la colonne etudiant à la table users si elle n'existe pas
-- Cette colonne permet de tracker le pourcentage d'étudiants inscrits

ALTER TABLE users ADD COLUMN etudiant TINYINT(1) DEFAULT 0;

-- Mettre à jour les utilisateurs existants qui ont coché "étudiant" lors de l'inscription
-- Par défaut, tous les utilisateurs existants sont marqués comme non-étudiants
