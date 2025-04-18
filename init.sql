-- Création de la base de données avec jeu de caractères et collation
Drop DATABASE IF EXISTS gestion_evenements;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS gestion_evenements CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_evenements;

-- Table des utilisateurs
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des événements
CREATE TABLE evenements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(100) NOT NULL,
    description TEXT,
    lieu VARCHAR(255),
    date_debut DATETIME NOT NULL,
    date_fin DATETIME NOT NULL,
    max_participants INT NULL,
    date_limite_inscription DATETIME NULL,
    est_prive BOOLEAN DEFAULT FALSE,
    code_partage VARCHAR(20) UNIQUE,
    proprietaire_id INT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    est_annule BOOLEAN DEFAULT FALSE,
    categorie ENUM('Conférence', 'Formation', 'Social', 'Sport', 'Virtuel','Fête') DEFAULT 'Social',
    FOREIGN KEY (proprietaire_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- Table des inscriptions
CREATE TABLE inscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evenement_id INT NOT NULL,
    utilisateur_id INT NOT NULL,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('en_attente', 'confirmee', 'annulee', 'present') DEFAULT 'en_attente',
    FOREIGN KEY (evenement_id) REFERENCES evenements(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    UNIQUE KEY inscription_unique (evenement_id, utilisateur_id)
);

-- Table des invitations
CREATE TABLE invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evenement_id INT NOT NULL,
    email_invite VARCHAR(100) NOT NULL,
    code_invitation VARCHAR(50) NOT NULL UNIQUE,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('en_attente', 'acceptee', 'refusee') DEFAULT 'en_attente',
    FOREIGN KEY (evenement_id) REFERENCES evenements(id) ON DELETE CASCADE
);

-- Table des statistiques (pour le tableau de bord)
CREATE TABLE statistiques (
    evenement_id INT NOT NULL PRIMARY KEY,
    total_vues INT DEFAULT 0,
    total_inscriptions INT DEFAULT 0,
    total_presents INT DEFAULT 0,
    derniere_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evenement_id) REFERENCES evenements(id) ON DELETE CASCADE
);

-- Ajout d'index pour les performances
CREATE INDEX idx_evenements_dates ON evenements (date_debut, date_fin);
CREATE INDEX idx_evenements_proprietaire ON evenements (proprietaire_id);
CREATE INDEX idx_inscriptions_statut ON inscriptions (statut);

-- Insertion des utilisateurs
INSERT INTO utilisateurs (email, mot_de_passe, nom, prenom)
VALUES 
('user1@example.com', 'password1', 'Dupont', 'Jean'),
('user2@example.com', 'password2', 'Martin', 'Sophie'),
('user3@example.com', 'password3', 'Durand', 'Alex'),
('user4@example.com', 'password4', 'Lemoine', 'Claire'),
('user5@example.com', 'password5', 'Petit', 'Paul'),
('user6@example.com', 'password6', 'Moreau', 'Julie'),
('user7@example.com', 'password7', 'Roux', 'Pierre'),
('user8@example.com', 'password8', 'Blanc', 'Marie');

-- Insertion des événements
INSERT INTO evenements (titre, description, lieu, date_debut, date_fin, max_participants, date_limite_inscription, est_prive, code_partage, proprietaire_id)
VALUES 
('Conférence Tech', 'Conférence sur les nouvelles technologies', 'Paris', '2025-06-10 09:00:00', '2025-06-10 18:00:00', 100, '2025-06-05 23:59:59', FALSE, 'ABC123', 1),
('Cours de Yoga', 'Session de yoga en plein air', 'Lyon', '2025-06-12 07:00:00', '2025-06-12 08:30:00', 20, NULL, TRUE, 'XYZ789', 2),
('Atelier Cuisine', 'Apprenez à cuisiner des plats italiens', 'Marseille', '2025-06-15 10:00:00', '2025-06-15 13:00:00', 15, '2025-06-14 23:59:59', FALSE, 'COOK123', 3),
('Marathon', 'Course à pied de 42 km', 'Nice', '2025-06-20 06:00:00', '2025-06-20 12:00:00', 500, '2025-06-19 23:59:59', FALSE, 'RUN123', 4),
('Soirée Jazz', 'Concert de jazz en plein air', 'Bordeaux', '2025-06-25 19:00:00', '2025-06-25 22:00:00', 200, NULL, TRUE, 'JAZZ123', 5),
('Hackathon', 'Compétition de programmation', 'Toulouse', '2025-06-30 09:00:00', '2025-06-30 21:00:00', 50, '2025-06-29 23:59:59', FALSE, 'HACK123', 6),
('Exposition Art', "Exposition d'art contemporain", 'Lille', '2025-07-05 10:00:00', '2025-07-05 18:00:00', 300, NULL, FALSE, 'ART123', 7),
('Tournoi E-Sport', 'Compétition de jeux vidéo', 'Strasbourg', '2025-07-10 10:00:00', '2025-07-10 20:00:00', 100, '2025-07-09 23:59:59', TRUE, 'ESPORT123', 8);

-- Insertion des inscriptions
INSERT INTO inscriptions (evenement_id, utilisateur_id, statut)
VALUES 
(1, 1, 'confirmee'),
(1, 2, 'en_attente'),
(2, 3, 'confirmee'),
(3, 4, 'confirmee'),
(4, 5, 'en_attente'),
(5, 6, 'confirmee'),
(6, 7, 'annulee'),
(7, 8, 'present');

-- Insertion des invitations
INSERT INTO invitations (evenement_id, email_invite, code_invitation, statut)
VALUES 
(2, 'user1@example.com', 'INVITE123', 'en_attente'),
(2, 'user2@example.com', 'INVITE456', 'acceptee'),
(2, 'user3@example.com', 'INVITE789', 'refusee'),
(2, 'user4@example.com', 'INVITE101', 'en_attente'),
(2, 'user5@example.com', 'INVITE102', 'acceptee'),
(2, 'user6@example.com', 'INVITE103', 'refusee'),
(2, 'user7@example.com', 'INVITE104', 'en_attente'),
(2, 'user8@example.com', 'INVITE105', 'acceptee');

-- Insertion des statistiques
INSERT INTO statistiques (evenement_id, total_vues, total_inscriptions, total_presents)
VALUES 
(1, 150, 50, 30),
(2, 75, 15, 10),
(3, 60, 10, 5),
(4, 500, 300, 250),
(5, 200, 100, 80),
(6, 50, 25, 20),
(7, 300, 150, 120),
(8, 100, 50, 40);