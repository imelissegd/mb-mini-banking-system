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
  `first_name` VARCHAR(45) NOT NULL,
  `middle_name` VARCHAR(45) NULL DEFAULT '',
  `last_name` VARCHAR(45) NOT NULL,
  `suffix` VARCHAR(15) NULL DEFAULT '',
  `email` VARCHAR(255) NOT NULL,
  `contact_number` VARCHAR(20) NOT NULL,
  `password_hash` VARCHAR(100) NOT NULL,
  `role` VARCHAR(45) NOT NULL DEFAULT 'CUSTOMER',
  `is_active` BIT NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `contact_number_UNIQUE` (`contact_number` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MiniBankingSystem`.`bank_accounts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MiniBankingSystem`.`bank_accounts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `users_id` BIGINT NOT NULL,
    `account_number` VARCHAR(45) NOT NULL,
    `account_type` VARCHAR(45) NOT NULL,
    `balance` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `status` VARCHAR(45) NOT NULL DEFAULT 'OPEN',
    `created_at` DATETIME NOT NULL,
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


-- -----------------------------------------------------
-- Table `MiniBankingSystem`.`transactions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MiniBankingSystem`.`transactions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `from_account_id` BIGINT NULL,
    `to_account_id` BIGINT NULL,
    `amount` DECIMAL(15,2) NOT NULL,
    `type` VARCHAR(45) NOT NULL,
    `timestamp` DATETIME NOT NULL,
    `description` VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
    INDEX `fk_transactions_bank_accounts1_idx` (`from_account_id` ASC) VISIBLE,
    INDEX `fk_transactions_bank_accounts2_idx` (`to_account_id` ASC) VISIBLE,
    CONSTRAINT `fk_transactions_bank_accounts1`
    FOREIGN KEY (`from_account_id`)
    REFERENCES `MiniBankingSystem`.`bank_accounts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    CONSTRAINT `fk_transactions_bank_accounts2`
    FOREIGN KEY (`to_account_id`)
    REFERENCES `MiniBankingSystem`.`bank_accounts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;