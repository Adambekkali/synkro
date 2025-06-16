-- Migration pour ajouter le système de rôles
USE gestion_evenements;

-- Ajout des nouvelles colonnes à la table utilisateurs
ALTER TABLE utilisateurs 
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'CITIZEN',
ADD COLUMN organization VARCHAR(100) NULL,
ADD COLUMN is_approved BOOLEAN NOT NULL DEFAULT FALSE;

-- Ajout d'une contrainte pour valider les rôles
ALTER TABLE utilisateurs 
ADD CONSTRAINT chk_role 
CHECK (role IN ('CITIZEN', 'ORGANIZER', 'ADMIN'));

-- Vérification des colonnes ajoutées
DESCRIBE utilisateurs;

-- Affichage d'un message de succès
SELECT 'Migration terminée avec succès!' as status;