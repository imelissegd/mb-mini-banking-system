-- -----------------------------------------------------
-- Schema MiniBankingSystem
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema MiniBankingSystem
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `MiniBankingSystem` DEFAULT CHARACTER SET utf8 ;
USE `MiniBankingSystem` ;

-- -----------------------------------------------------
-- Table `MiniBankingSystem`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MiniBankingSystem`.`users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(45) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(100) NOT NULL,
    `role` VARCHAR(45) NOT NULL DEFAULT 'CUSTOMER',
    `is_active` TINYINT NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `user_id_UNIQUE` (`id` ASC) VISIBLE,
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
    ENGINE = InnoDB;