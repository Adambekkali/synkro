-- Création de la base de données
Drop DATABASE IF EXISTS gestion_evenements;
CREATE DATABASE IF NOT EXISTS gestion_evenements;
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
    proprietaire_id INT NOT NULL, -- Clé étrangère vers l'utilisateur qui a créé l'événement
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
    statut ENUM('en_attente', 'confirmée', 'annulee', 'present') DEFAULT 'en_attente',
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
-- ALTER TABLE evenements ADD INDEX idx_evenements_dates (date_debut, date_fin);
-- ALTER TABLE evenements ADD INDEX idx_evenements_proprietaire (proprietaire_id);
-- ALTER TABLE inscriptions ADD INDEX idx_inscriptions_statut (statut);

-- Insertion des utilisateurs
INSERT INTO utilisateurs (email, mot_de_passe, nom, prenom)
VALUES 
('user1@example.com', 'password1', 'Dupont', 'Jean'),
('user2@example.com', 'password2', 'Martin', 'Sophie'),
('user3@example.com', 'password3', 'Durand', 'Alex');

-- Insertion des événements
INSERT INTO evenements (titre, description, lieu, date_debut, date_fin, max_participants, date_limite_inscription, est_prive, code_partage, proprietaire_id)
VALUES 
('Conférence Tech', 'Conférence sur les nouvelles technologies', 'Paris', '2025-06-10 09:00:00', '2025-06-10 18:00:00', 100, '2025-06-05 23:59:59', FALSE, 'ABC123', 1),
('Cours de Yoga', 'Session de yoga en plein air', 'Lyon', '2025-06-12 07:00:00', '2025-06-12 08:30:00', 20, NULL, TRUE, 'XYZ789', 2);

-- Insertion des inscriptions
INSERT INTO inscriptions (evenement_id, utilisateur_id, statut)
VALUES 
(1, 1, 'Confirmée'),
(1, 2, 'en_attente'),
(2, 3, 'Confirmée');

-- Insertion des invitations
INSERT INTO invitations (evenement_id, email_invite, code_invitation, statut)
VALUES 
(1, 'invite1@example.com', 'INVITE123', 'en_attente'),
(2, 'invite2@example.com', 'INVITE456', 'acceptee');

-- Insertion des statistiques
INSERT INTO statistiques (evenement_id, total_vues, total_inscriptions, total_presents)
VALUES 
(1, 150, 50, 30),
(2, 75, 15, 10);
