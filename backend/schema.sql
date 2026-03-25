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

-- -----------------------------------------------------
-- Table `MiniBankingSystem`.`bank_accounts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MiniBankingSystem`.`bank_accounts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `account_number` VARCHAR(45) NOT NULL,
    `account_type` VARCHAR(45) NOT NULL,
    `balance` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `status` VARCHAR(45) NOT NULL DEFAULT 'OPEN',
    `created_at` DATETIME NOT NULL,
    `users_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
    UNIQUE INDEX `account_number_UNIQUE` (`account_number` ASC) VISIBLE,
    INDEX `fk_bank_accounts_users_idx` (`users_id` ASC) VISIBLE,
    CONSTRAINT `fk_bank_accounts_users`
    FOREIGN KEY (`users_id`)
    REFERENCES `MiniBankingSystem`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;