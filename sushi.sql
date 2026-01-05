-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 05 jan. 2026 à 19:01
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sushi`
--

-- --------------------------------------------------------

--
-- Structure de la table `boxes`
--

CREATE TABLE `boxes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `pieces` int(11) NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `image` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `boxes`
--

INSERT INTO `boxes` (`id`, `name`, `pieces`, `price`, `image`) VALUES
(1, 'Tasty Blend', 12, 12.50, 'tasty-blend'),
(2, 'Amateur Mix', 18, 15.90, 'amateur-mix'),
(3, 'Saumon Original', 11, 12.50, 'saumon-original'),
(4, 'Salmon Lovers', 18, 15.90, 'salmon-lovers'),
(5, 'Salmon Classic', 10, 15.90, 'salmon-classic'),
(6, 'Master Mix', 12, 15.90, 'master-mix'),
(7, 'Sunrise', 18, 15.90, 'sunrise'),
(8, 'Sando Box Chicken Katsu', 13, 15.90, 'sando-box-chicken-katsu'),
(9, 'Sando Box Salmon Aburi', 13, 15.90, 'sando-box-salmon-aburi'),
(10, 'Super Salmon', 24, 19.90, 'super-salmon'),
(11, 'California Dream', 24, 19.90, 'california-dream'),
(12, 'Gourmet Mix', 22, 24.50, 'gourmet-mix'),
(13, 'Fresh Mix', 22, 24.50, 'fresh-mix');

-- --------------------------------------------------------

--
-- Structure de la table `box_flavors`
--

CREATE TABLE `box_flavors` (
  `box_id` int(11) NOT NULL,
  `flavor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `box_flavors`
--

INSERT INTO `box_flavors` (`box_id`, `flavor_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(3, 1),
(3, 2),
(4, 1),
(4, 2),
(4, 4),
(5, 1),
(6, 1),
(6, 2),
(6, 5),
(7, 1),
(7, 2),
(7, 3),
(7, 5),
(8, 1),
(8, 2),
(8, 3),
(8, 6),
(9, 1),
(9, 2),
(9, 5),
(10, 1),
(10, 2),
(10, 3),
(10, 4),
(11, 1),
(11, 2),
(11, 5),
(11, 6),
(11, 7),
(11, 8),
(12, 1),
(12, 2),
(12, 4),
(12, 6),
(12, 8),
(12, 9),
(13, 1),
(13, 2),
(13, 3),
(13, 5),
(13, 8);

-- --------------------------------------------------------

--
-- Structure de la table `box_foods`
--

CREATE TABLE `box_foods` (
  `box_id` int(11) NOT NULL,
  `food_id` int(11) NOT NULL,
  `quantity` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `box_foods`
--

INSERT INTO `box_foods` (`box_id`, `food_id`, `quantity`) VALUES
(1, 1, 3.00),
(1, 2, 3.00),
(1, 3, 3.00),
(1, 4, 3.00),
(1, 5, 1.00),
(2, 1, 3.00),
(2, 5, 1.00),
(2, 6, 3.00),
(2, 7, 3.00),
(2, 8, 6.00),
(3, 1, 6.00),
(3, 2, 5.00),
(3, 5, 1.00),
(4, 1, 6.00),
(4, 2, 6.00),
(4, 5, 1.00),
(4, 7, 6.00),
(5, 2, 10.00),
(5, 5, 1.00),
(6, 1, 3.00),
(6, 2, 4.00),
(6, 5, 1.00),
(6, 9, 2.00),
(6, 10, 3.00),
(7, 1, 6.00),
(7, 5, 1.00),
(7, 6, 6.00),
(7, 11, 6.00),
(8, 1, 6.00),
(8, 5, 1.00),
(8, 6, 6.00),
(8, 11, 6.00),
(8, 12, 0.50),
(9, 1, 6.00),
(9, 5, 1.00),
(9, 11, 6.00),
(9, 13, 0.50),
(10, 1, 6.00),
(10, 5, 1.00),
(10, 6, 6.00),
(10, 7, 6.00),
(10, 14, 6.00),
(11, 1, 6.00),
(11, 5, 1.00),
(11, 11, 6.00),
(11, 15, 6.00),
(11, 16, 6.00),
(12, 5, 1.00),
(12, 17, 6.00),
(12, 18, 4.00),
(12, 19, 3.00),
(12, 20, 6.00),
(12, 21, 3.00),
(13, 4, 6.00),
(13, 5, 1.00),
(13, 6, 6.00),
(13, 22, 4.00),
(13, 23, 4.00),
(13, 24, 2.00);

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

CREATE TABLE `commandes` (
  `id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `code_postal` varchar(5) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `status_commande` varchar(50) DEFAULT NULL,
  `date_commande` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commandes`
--

INSERT INTO `commandes` (`id`, `utilisateur_id`, `nom`, `prenom`, `telephone`, `adresse`, `code_postal`, `ville`, `total`, `status_commande`, `date_commande`) VALUES
(3, 12, '', 'greg', '9999999999', 'Babyshark', '77100', 'MEaux', 60.20, 'en_attente', '2025-12-18 09:49:04'),
(4, 12, '', 'greg', '0123456789', '123 rue test', '75001', 'Paris', 12.50, 'en_attente', '2025-12-31 14:34:33'),
(5, 15, 'Laudet', 'Mathieu', '0642170757', '3 impasse de la mare', '60330', 'silly le lomg', 12.50, 'validee', '2026-01-05 18:01:13'),
(6, 15, 'Laudet', 'Mathieu', '0642170757', '3 impasse de la mare', '60330', 'silly le lomg', 24.50, 'en_attente', '2026-01-05 18:06:57');

-- --------------------------------------------------------

--
-- Structure de la table `commande_details`
--

CREATE TABLE `commande_details` (
  `id` int(11) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `id_box` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `total_commande` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commande_details`
--

INSERT INTO `commande_details` (`id`, `commande_id`, `id_box`, `quantite`, `total_commande`) VALUES
(4, 3, 8, 1, 15.90),
(5, 3, 2, 1, 15.90),
(6, 3, 1, 1, 12.50),
(7, 3, 4, 1, 15.90),
(8, 4, 1, 1, 12.50),
(9, 5, 1, 1, 12.50),
(10, 6, 12, 1, 24.50);

-- --------------------------------------------------------

--
-- Structure de la table `flavors`
--

CREATE TABLE `flavors` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `flavors`
--

INSERT INTO `flavors` (`id`, `name`) VALUES
(2, 'avocat'),
(3, 'cheese'),
(4, 'coriandre'),
(7, 'crevette'),
(1, 'saumon'),
(9, 'seriole lalandi'),
(8, 'spicy'),
(5, 'thon'),
(6, 'viande');

-- --------------------------------------------------------

--
-- Structure de la table `foods`
--

CREATE TABLE `foods` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `foods`
--

INSERT INTO `foods` (`id`, `name`) VALUES
(16, 'California Chicken Katsu'),
(15, 'California Crevette'),
(20, 'California French Salmon'),
(19, 'California French Touch'),
(4, 'California Pacific'),
(1, 'California Saumon Avocat'),
(10, 'California Thon Avocat'),
(11, 'California Thon Cuit Avocat'),
(21, 'California Yellowtail Ponzu'),
(5, 'Edamame/Salade de chou'),
(8, 'Maki Cheese Avocat'),
(14, 'Maki Salmon'),
(6, 'Maki Salmon Roll'),
(12, 'Sando Chicken Katsu'),
(13, 'Sando Salmon Aburi'),
(18, 'Signature Dragon Roll'),
(22, 'Signature Rock\'n Roll'),
(3, 'Spring Avocat Cheese'),
(7, 'Spring Saumon Avocat'),
(17, 'Spring Tataki Saumon'),
(23, 'Sushi Salmon'),
(2, 'Sushi Saumon'),
(24, 'Sushi Saumon Tsukudani'),
(9, 'Sushi Thon');

-- --------------------------------------------------------

--
-- Structure de la table `panier`
--

CREATE TABLE `panier` (
  `id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  `status` enum('OUVERT','VALIDE') DEFAULT 'OUVERT',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `panier`
--

INSERT INTO `panier` (`id`, `utilisateur_id`, `status`, `created_at`, `updated_at`) VALUES
(43, 11, 'OUVERT', '2025-12-07 15:01:23', '2025-12-07 15:01:23'),
(44, 12, 'VALIDE', '2025-12-07 15:18:08', '2025-12-18 08:49:04'),
(46, 12, 'VALIDE', '2025-12-31 13:32:25', '2025-12-31 13:34:33'),
(47, 12, 'OUVERT', '2025-12-31 13:44:25', '2025-12-31 13:44:25'),
(48, 15, 'VALIDE', '2026-01-04 17:09:25', '2026-01-05 17:01:13'),
(49, 17, 'OUVERT', '2026-01-05 16:05:24', '2026-01-05 16:05:24'),
(50, 15, 'VALIDE', '2026-01-05 17:01:25', '2026-01-05 17:06:57');

-- --------------------------------------------------------

--
-- Structure de la table `panier_articles`
--

CREATE TABLE `panier_articles` (
  `id` int(11) NOT NULL,
  `panier_id` int(11) NOT NULL,
  `box_id` int(11) NOT NULL,
  `quantite` int(11) NOT NULL DEFAULT 1,
  `prix_unitaire` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `panier_articles`
--

INSERT INTO `panier_articles` (`id`, `panier_id`, `box_id`, `quantite`, `prix_unitaire`) VALUES
(19, 44, 8, 1, 15.90),
(20, 44, 2, 1, 15.90),
(21, 44, 1, 1, 12.50),
(22, 44, 4, 1, 15.90),
(29, 43, 2, 9, 15.90),
(32, 46, 1, 1, 12.50),
(39, 48, 1, 1, 12.50),
(40, 50, 12, 1, 24.50);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `api_token` varchar(100) DEFAULT NULL,
  `etudiant` tinyint(1) NOT NULL DEFAULT 0,
  `cookie` tinyint(1) DEFAULT NULL,
  `newsletter` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password`, `created_at`, `api_token`, `etudiant`, `cookie`, `newsletter`) VALUES
(10, 'Prenom', 'Nom', 'exemple@gmail.com', '$2y$10$Fpj4JOVf2Jd9T13usQQvL.m7Rg.AIQRS6E6WPndcxlrQ4ASdQDy8m', NULL, '3ea27ffb7e00a4d705d34e3439400d225e12026c9b7be3b02fd34512eb21c900', 0, NULL, 0),
(11, 'Maywix', '', 'farruggia48@hotmail.com', '$2y$10$vtGDbikeQqJrYsExcO.FG.nZVDzG9Vc7N3TXJaW6cX6JecHP1waMq', NULL, '046ad52e705e1dc50213d40051148c5414b26f89d20eb310d06b5dee838fb650', 0, NULL, 0),
(12, 'greg', '', 'greg@greg.com', '$2y$10$tbxHtrd0N3cQ/Dts3CGM9eNLekJyuoaVNP895SOCy7NKDq67Db8ly', NULL, 'b3531fc750367f2ae44924eaa7d3a31eec23e3334ad5bcaa283e9eb4d52300d4', 1, NULL, 0),
(14, 'testest', '', 'test@test.test', '$2y$10$h5c5hR1HxYQVpX9kz/xDxu5EsD8eZy83v9/tk8BhE1z.OPelZyhbO', NULL, '4a0e027a0f7795bf11f7a03de510c8f766b523f537b9df63a89310b2f5c5fc42', 1, NULL, 0),
(15, 'Mathieu', 'Laudet', 'mthldt@gmail.com', '$2y$10$uTzX/yfY0qDWW/zuOR1UyOW7AAaCN9HNusX4aqMkCfqnvSg/g9szy', NULL, '437a5217356f943d68e217cc77a810a3b5bc47b75f021b36bb07e0bd73e009e9', 1, 1, 1),
(16, 'd', 'd', 'mthldzdt@gmail.com', '$2y$10$UG69zxLv6KTzWejxFyfGFe.gl.EvzbPu6OHr/jnwTenGTbN4zgWoO', NULL, NULL, 0, NULL, 0),
(17, 'Mathieu', 'Laudet', 'mthldt1@gmail.com', '$2y$10$PCyHB1GwT7lufn4SEj6dme1GBMkpIY/J4Lw/EGnP1hCJZpjLfxpmm', NULL, '2b5315e782248368028e215eca7118da0b91c3cd522f98c9b2c28a0db0c2f37c', 0, 1, 0),
(18, 'Mathieu', 'Laudet', 'mthldt2@gmail.com', '$2y$10$GjJOafTHi296eXVaO86XBO3ou1oSj7HXOPZNok.GqdLYBfJLLcai.', NULL, '4e1addfe4521a17bf295512fa38340d102cebca646807b7db0d5960ed366dd70', 0, NULL, 0),
(19, 'gg', 'gg', '1@gmail.com', '$2y$10$m.zeNbbp1d9rXmiQJBTYQOa1QZkPiGOnMGgSJm86LkgHoWFrUQZn2', NULL, 'aa432e2ee18c00daee3c036b3f4c8aceadb5564cd0cd4110ff7cc3fe1f70a9f9', 0, 0, 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `boxes`
--
ALTER TABLE `boxes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `box_flavors`
--
ALTER TABLE `box_flavors`
  ADD PRIMARY KEY (`box_id`,`flavor_id`),
  ADD KEY `flavor_id` (`flavor_id`);

--
-- Index pour la table `box_foods`
--
ALTER TABLE `box_foods`
  ADD PRIMARY KEY (`box_id`,`food_id`),
  ADD KEY `food_id` (`food_id`);

--
-- Index pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_commandes_user` (`utilisateur_id`);

--
-- Index pour la table `commande_details`
--
ALTER TABLE `commande_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_details_commande` (`commande_id`),
  ADD KEY `fk_details_box` (`id_box`);

--
-- Index pour la table `flavors`
--
ALTER TABLE `flavors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `foods`
--
ALTER TABLE `foods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `panier`
--
ALTER TABLE `panier`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_panier_user` (`utilisateur_id`);

--
-- Index pour la table `panier_articles`
--
ALTER TABLE `panier_articles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pa_panier` (`panier_id`),
  ADD KEY `fk_pa_box` (`box_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `boxes`
--
ALTER TABLE `boxes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `commandes`
--
ALTER TABLE `commandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `commande_details`
--
ALTER TABLE `commande_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `flavors`
--
ALTER TABLE `flavors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `foods`
--
ALTER TABLE `foods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `panier`
--
ALTER TABLE `panier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT pour la table `panier_articles`
--
ALTER TABLE `panier_articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `box_flavors`
--
ALTER TABLE `box_flavors`
  ADD CONSTRAINT `box_flavors_ibfk_1` FOREIGN KEY (`box_id`) REFERENCES `boxes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `box_flavors_ibfk_2` FOREIGN KEY (`flavor_id`) REFERENCES `flavors` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `box_foods`
--
ALTER TABLE `box_foods`
  ADD CONSTRAINT `box_foods_ibfk_1` FOREIGN KEY (`box_id`) REFERENCES `boxes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `box_foods_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD CONSTRAINT `fk_commandes_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `commande_details`
--
ALTER TABLE `commande_details`
  ADD CONSTRAINT `fk_details_box` FOREIGN KEY (`id_box`) REFERENCES `boxes` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_details_commande` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `panier`
--
ALTER TABLE `panier`
  ADD CONSTRAINT `fk_panier_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `panier_articles`
--
ALTER TABLE `panier_articles`
  ADD CONSTRAINT `fk_pa_box` FOREIGN KEY (`box_id`) REFERENCES `boxes` (`id`),
  ADD CONSTRAINT `fk_pa_panier` FOREIGN KEY (`panier_id`) REFERENCES `panier` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
