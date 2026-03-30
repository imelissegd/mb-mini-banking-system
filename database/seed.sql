USE `minibankingsystem`;

-- =============================================================================
-- USERS
-- Passwords are BCrypt-hashed.
--   admin01   → Admin@1234
--   juan01    → Customer@1234
--   maria01   → Customer@1234
-- =============================================================================

INSERT IGNORE INTO `users`
(`username`, `first_name`, `middle_name`, `last_name`, `suffix`, `email`, `contact_number`, `password_hash`, `role`, `is_active`, `created_at`)
VALUES
    (
        'admin01',
        'System', '', 'Admin', '',
        'admin@bank.com',
        '+639171111111',
        '$2a$10$icnyqAE.vwSDwUCmkF10EedfSFQO5WWGY2UrKcAQ2/O8khtR.3hV2',
        'ADMIN', 1, NOW()
    ),
    (
        'juan01',
        'Juan', 'Santos', 'Dela Cruz', '',
        'juan@example.com',
        '+639172222222',
        '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe',
        'CUSTOMER', 1, NOW()
    ),
    (
        'maria01',
        'Maria', 'Reyes', 'Garcia', '',
        'maria@example.com',
        '+639173333333',
        '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe',
        'CUSTOMER', 1, NOW()
    );

-- =============================================================================
-- BANK ACCOUNTS
-- Uses subqueries to resolve user IDs so hardcoded IDs don't break
-- if the auto_increment shifts after a wipe-and-reseed.
-- =============================================================================

INSERT IGNORE INTO `bank_accounts`
(`users_id`, `account_number`, `account_type`, `balance`, `status`, `created_at`)
VALUES
    ((SELECT id FROM users WHERE username = 'juan01'),  '1000000001', 'SAVINGS',  50000.00, 'ACTIVE', NOW()),
    ((SELECT id FROM users WHERE username = 'juan01'),  '1000000002', 'CHECKING', 15000.00, 'ACTIVE', NOW()),
    ((SELECT id FROM users WHERE username = 'maria01'), '2000000001', 'SAVINGS',  80000.00, 'ACTIVE', NOW()),
    ((SELECT id FROM users WHERE username = 'maria01'), '2000000002', 'CHECKING',  5000.00, 'ACTIVE', NOW());

-- =============================================================================
-- TRANSACTIONS
-- Uses subqueries to resolve account IDs for the same reason.
-- =============================================================================

INSERT IGNORE INTO `transactions`
(`from_account_id`, `to_account_id`, `amount`, `type`, `timestamp`, `description`)
VALUES
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '1000000001'), 50000.00, 'DEPOSIT',    DATE_SUB(NOW(), INTERVAL 30 DAY), 'Initial deposit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '1000000002'), 20000.00, 'DEPOSIT',    DATE_SUB(NOW(), INTERVAL 30 DAY), 'Initial deposit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '2000000001'), 80000.00, 'DEPOSIT',    DATE_SUB(NOW(), INTERVAL 30 DAY), 'Initial deposit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '2000000002'),  5000.00, 'DEPOSIT',    DATE_SUB(NOW(), INTERVAL 30 DAY), 'Initial deposit'),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '1000000002'),
        (SELECT id FROM bank_accounts WHERE account_number = '2000000001'),
        5000.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 10 DAY), 'Payment for rent'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '2000000001'),
        (SELECT id FROM bank_accounts WHERE account_number = '1000000001'),
        2500.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 5 DAY), 'Loan repayment'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '1000000002'),
        NULL,
        500.00, 'WITHDRAWAL', DATE_SUB(NOW(), INTERVAL 2 DAY), 'ATM withdrawal'
    );