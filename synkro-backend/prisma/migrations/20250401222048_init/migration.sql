-- CreateTable
CREATE TABLE `evenements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `lieu` VARCHAR(255) NULL,
    `date_debut` DATETIME(0) NOT NULL,
    `date_fin` DATETIME(0) NOT NULL,
    `max_participants` INTEGER NULL,
    `date_limite_inscription` DATETIME(0) NULL,
    `est_prive` BOOLEAN NULL DEFAULT false,
    `code_partage` VARCHAR(20) NULL,
    `proprietaire_id` INTEGER NOT NULL,
    `date_creation` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `est_annule` BOOLEAN NULL DEFAULT false,
    `categorie` ENUM('Conf?rence', 'Formation', 'Social', 'Sport', 'Virtuel', 'F?te') NULL DEFAULT 'Social',

    UNIQUE INDEX `code_partage`(`code_partage`),
    INDEX `proprietaire_id`(`proprietaire_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `evenement_id` INTEGER NOT NULL,
    `utilisateur_id` INTEGER NOT NULL,
    `date_inscription` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `statut` ENUM('en_attente', 'confirmee', 'annulee', 'present') NULL DEFAULT 'en_attente',

    INDEX `utilisateur_id`(`utilisateur_id`),
    UNIQUE INDEX `inscription_unique`(`evenement_id`, `utilisateur_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `evenement_id` INTEGER NOT NULL,
    `email_invite` VARCHAR(100) NOT NULL,
    `code_invitation` VARCHAR(50) NOT NULL,
    `date_envoi` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `statut` ENUM('en_attente', 'acceptee', 'refusee') NULL DEFAULT 'en_attente',

    UNIQUE INDEX `code_invitation`(`code_invitation`),
    INDEX `evenement_id`(`evenement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `statistiques` (
    `evenement_id` INTEGER NOT NULL,
    `total_vues` INTEGER NULL DEFAULT 0,
    `total_inscriptions` INTEGER NULL DEFAULT 0,
    `total_presents` INTEGER NULL DEFAULT 0,
    `derniere_mise_a_jour` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`evenement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilisateurs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `mot_de_passe` VARCHAR(255) NOT NULL,
    `nom` VARCHAR(50) NULL,
    `prenom` VARCHAR(50) NULL,
    `date_creation` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `evenements` ADD CONSTRAINT `evenements_ibfk_1` FOREIGN KEY (`proprietaire_id`) REFERENCES `utilisateurs`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inscriptions` ADD CONSTRAINT `inscriptions_ibfk_1` FOREIGN KEY (`evenement_id`) REFERENCES `evenements`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inscriptions` ADD CONSTRAINT `inscriptions_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_ibfk_1` FOREIGN KEY (`evenement_id`) REFERENCES `evenements`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `statistiques` ADD CONSTRAINT `statistiques_ibfk_1` FOREIGN KEY (`evenement_id`) REFERENCES `evenements`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
