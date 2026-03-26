USE `MiniBankingSystem`;

-- =============================================================================
-- USERS
-- Passwords are BCrypt-hashed.
--   admin@bank.com     → password: Admin@1234
--   juan@example.com   → password: Customer@1234
--   maria@example.com  → password: Customer@1234
-- =============================================================================

INSERT INTO `users`
(`username`, `first_name`, `middle_name`, `last_name`, `suffix`, `email`, `contact_number`, `password_hash`, `role`, `is_active`, `created_at`)
VALUES
    -- Admin
    (
        'admin01',
        'System', '', 'Admin', '',
        'admin@bank.com',
        '+639171111111',
        '$2a$12$pWMzGNiQrC8n2fSZMvB/5.VrnjBxnlZy3lTuwk4gvC6EcPmwV.tJy',
        'ADMIN', 1, NOW()
    ),
    -- Customer 1
    (
        'juan01',
        'Juan', 'Santos', 'Dela Cruz', '',
        'juan@example.com',
        '+639172222222',
        '$2a$12$l8sOsUVqBbM0dEqIxqFvOuK8bIg7k2TNPnkuEjjOhgWP.RbMCKUyK',
        'CUSTOMER', 1, NOW()
    ),
    -- Customer 2
    (
        'maria01',
        'Maria', 'Reyes', 'Garcia', '',
        'maria@example.com',
        '+639173333333',
        '$2a$12$l8sOsUVqBbM0dEqIxqFvOuK8bIg7k2TNPnkuEjjOhgWP.RbMCKUyK',
        'CUSTOMER', 1, NOW()
    );

-- =============================================================================
-- BANK ACCOUNTS
-- =============================================================================

INSERT INTO `bank_accounts`
(`users_id`, `account_number`, `account_type`, `balance`, `status`, `created_at`)
VALUES
    -- Juan: Savings + Checking
    (2, '1000000001', 'SAVINGS',  50000.00, 'OPEN', NOW()),
    (2, '1000000002', 'CHECKING', 15000.00, 'OPEN', NOW()),
    -- Maria: Savings
    (3, '2000000001', 'SAVINGS',  80000.00, 'OPEN', NOW()),
    (3, '2000000002', 'CHECKING',  5000.00, 'OPEN', NOW());

-- =============================================================================
-- SEED TRANSACTIONS (sample history)
-- =============================================================================

INSERT INTO `transactions`
(`from_account_id`, `to_account_id`, `amount`, `type`, `timestamp`, `description`)
VALUES
    -- Initial deposit into Juan's savings (no from_account → DEPOSIT)
    (NULL, 1, 50000.00, 'DEPOSIT',    DATE_SUB(NOW(), INTERVAL 30 DAY), 'Initial deposit'),
    -- Initial deposit into Juan's checking
    (NULL, 2, 20000.00, 'DEPOSIT',    DATE_SUB(NOW(), INTERVAL 30 DAY), 'Initial deposit'),
    -- Initial deposit into Maria's savings
    (NULL, 3, 80000.00, 'DEPOSIT',    DATE_SUB(NOW(), INTERVAL 30 DAY), 'Initial deposit'),
    -- Initial deposit into Maria's checking
    (NULL, 4,  5000.00, 'DEPOSIT',    DATE_SUB(NOW(), INTERVAL 30 DAY), 'Initial deposit'),
    -- Juan checking → Maria savings (transfer)
    (2,    3,  5000.00, 'TRANSFER',   DATE_SUB(NOW(), INTERVAL 10 DAY), 'Payment for rent'),
    -- Maria savings → Juan savings (transfer)
    (3,    1,  2500.00, 'TRANSFER',   DATE_SUB(NOW(), INTERVAL  5 DAY), 'Loan repayment'),
    -- Juan checking withdrawal (no to_account → WITHDRAWAL)
    (2,    NULL, 500.00, 'WITHDRAWAL', DATE_SUB(NOW(), INTERVAL  2 DAY), 'ATM withdrawal');