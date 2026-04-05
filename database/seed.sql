USE `minibankingsystem`;

-- =============================================================================
-- USERS
-- All admin passwords  → Admin@1234
-- All customer passwords → Customer@1234
-- BCrypt cost 10
-- =============================================================================

INSERT IGNORE INTO `users`
(`username`, `first_name`, `middle_name`, `last_name`, `suffix`, `email`, `contact_number`, `password_hash`, `role`, `is_active`, `created_at`)
VALUES
    -- ── 5 Admins ──────────────────────────────────────────────────────────────
    ('admin01', 'System',   '',        'Admin',     '', 'admin01@bank.com', '+639170000001', '$2a$10$icnyqAE.vwSDwUCmkF10EedfSFQO5WWGY2UrKcAQ2/O8khtR.3hV2', 'ADMIN', 1, NOW()),
    ('admin02', 'Maria',    'Cruz',    'Santos',    '', 'admin02@bank.com', '+639170000002', '$2a$10$icnyqAE.vwSDwUCmkF10EedfSFQO5WWGY2UrKcAQ2/O8khtR.3hV2', 'ADMIN', 1, NOW()),
    ('admin03', 'Jose',     'Reyes',   'Dela Cruz', '', 'admin03@bank.com', '+639170000003', '$2a$10$icnyqAE.vwSDwUCmkF10EedfSFQO5WWGY2UrKcAQ2/O8khtR.3hV2', 'ADMIN', 1, NOW()),
    ('admin04', 'Ana',      'Bautista','Gomez',     '', 'admin04@bank.com', '+639170000004', '$2a$10$icnyqAE.vwSDwUCmkF10EedfSFQO5WWGY2UrKcAQ2/O8khtR.3hV2', 'ADMIN', 1, NOW()),
    ('admin05', 'Carlos',   'Lim',     'Tan',       '', 'admin05@bank.com', '+639170000005', '$2a$10$icnyqAE.vwSDwUCmkF10EedfSFQO5WWGY2UrKcAQ2/O8khtR.3hV2', 'ADMIN', 1, NOW()),

    -- ── 20 Customers ──────────────────────────────────────────────────────────
    ('juan01',    'Juan',      'Santos',    'Dela Cruz',  '',   'juan01@example.com',    '+639171000001', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('maria01',   'Maria',     'Reyes',     'Garcia',     '',   'maria01@example.com',   '+639171000002', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('pedro01',   'Pedro',     'Bautista',  'Ramirez',    '',   'pedro01@example.com',   '+639171000003', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('ana01',     'Ana',       'Lim',       'Torres',     '',   'ana01@example.com',     '+639171000004', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('carlos01',  'Carlos',    'Gomez',     'Flores',     '',   'carlos01@example.com',  '+639171000005', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('jose01',    'Jose',      'Tan',       'Cruz',       'Jr', 'jose01@example.com',    '+639171000006', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('rosa01',    'Rosa',      'Aquino',    'Villanueva', '',   'rosa01@example.com',    '+639171000007', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('marco01',   'Marco',     'Dela Rosa', 'Mendoza',    '',   'marco01@example.com',   '+639171000008', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('elena01',   'Elena',     'Pascual',   'Ramos',      '',   'elena01@example.com',   '+639171000009', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('miguel01',  'Miguel',    'Castro',    'Navarro',    '',   'miguel01@example.com',  '+639171000010', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('luisa01',   'Luisa',     'Herrera',   'Morales',    '',   'luisa01@example.com',   '+639171000011', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('antonio01', 'Antonio',   'Diaz',      'Ortega',     '',   'antonio01@example.com', '+639171000012', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('sofia01',   'Sofia',     'Vargas',    'Reyes',      '',   'sofia01@example.com',   '+639171000013', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('andres01',  'Andres',    'Medina',    'Jimenez',    '',   'andres01@example.com',  '+639171000014', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('carmen01',  'Carmen',    'Ruiz',      'Aguilar',    '',   'carmen01@example.com',  '+639171000015', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('ramon01',   'Ramon',     'Molina',    'Espinosa',   '',   'ramon01@example.com',   '+639171000016', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('isabel01',  'Isabel',    'Guerrero',  'Delgado',    '',   'isabel01@example.com',  '+639171000017', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('rafael01',  'Rafael',    'Romero',    'Ibarra',     '',   'rafael01@example.com',  '+639171000018', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('lucia01',   'Lucia',     'Solis',     'Cabrera',    '',   'lucia01@example.com',   '+639171000019', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW()),
    ('fernando01','Fernando',  'Vega',      'Miranda',    '',   'fernando01@example.com','+639171000020', '$2a$10$6mdr8gxKJvRYUlgcrkHPH.ZU41mU0V9AYsY2bA1HE5XrlLRMjRREe', 'CUSTOMER', 1, NOW());

-- =============================================================================
-- BANK ACCOUNTS
-- 30 accounts with unique randomized 12-digit account numbers
-- Distributed across customers — CHECKING or SAVINGS
-- Balances varied to support realistic transaction seeding
-- =============================================================================

INSERT IGNORE INTO `bank_accounts`
(`users_id`, `account_number`, `account_type`, `balance`, `status`, `created_at`)
VALUES
    ((SELECT id FROM users WHERE username = 'juan01'),    '384729301847', 'SAVINGS',   85000.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 60 DAY)),
    ((SELECT id FROM users WHERE username = 'juan01'),    '271649038520', 'CHECKING',  32000.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 60 DAY)),
    ((SELECT id FROM users WHERE username = 'maria01'),   '938471620384', 'SAVINGS',   120000.00,'OPEN', DATE_SUB(NOW(), INTERVAL 55 DAY)),
    ((SELECT id FROM users WHERE username = 'maria01'),   '503847162039', 'CHECKING',  18500.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 55 DAY)),
    ((SELECT id FROM users WHERE username = 'pedro01'),   '629384710265', 'SAVINGS',   45000.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 50 DAY)),
    ((SELECT id FROM users WHERE username = 'pedro01'),   '847362910485', 'CHECKING',  9800.00,  'OPEN', DATE_SUB(NOW(), INTERVAL 50 DAY)),
    ((SELECT id FROM users WHERE username = 'ana01'),     '193847265038', 'SAVINGS',   67500.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 48 DAY)),
    ((SELECT id FROM users WHERE username = 'ana01'),     '720384916273', 'CHECKING',  14200.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 48 DAY)),
    ((SELECT id FROM users WHERE username = 'carlos01'),  '465829103748', 'SAVINGS',   95000.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 45 DAY)),
    ((SELECT id FROM users WHERE username = 'carlos01'),  '381047296583', 'CHECKING',  27300.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 45 DAY)),
    ((SELECT id FROM users WHERE username = 'jose01'),    '574839201647', 'SAVINGS',   38000.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 42 DAY)),
    ((SELECT id FROM users WHERE username = 'jose01'),    '293847561028', 'CHECKING',  6500.00,  'OPEN', DATE_SUB(NOW(), INTERVAL 42 DAY)),
    ((SELECT id FROM users WHERE username = 'rosa01'),    '748392016475', 'SAVINGS',   52000.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 40 DAY)),
    ((SELECT id FROM users WHERE username = 'marco01'),   '836472910385', 'CHECKING',  11000.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 38 DAY)),
    ((SELECT id FROM users WHERE username = 'marco01'),   '192847365029', 'SAVINGS',   74000.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 38 DAY)),
    ((SELECT id FROM users WHERE username = 'elena01'),   '647382910564', 'CHECKING',  8300.00,  'OPEN', DATE_SUB(NOW(), INTERVAL 35 DAY)),
    ((SELECT id FROM users WHERE username = 'elena01'),   '384720193847', 'SAVINGS',   43500.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 35 DAY)),
    ((SELECT id FROM users WHERE username = 'miguel01'),  '920384716253', 'CHECKING',  19700.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 32 DAY)),
    ((SELECT id FROM users WHERE username = 'luisa01'),   '573849201638', 'SAVINGS',   61000.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 30 DAY)),
    ((SELECT id FROM users WHERE username = 'luisa01'),   '384920173648', 'CHECKING',  7200.00,  'OPEN', DATE_SUB(NOW(), INTERVAL 30 DAY)),
    ((SELECT id FROM users WHERE username = 'antonio01'), '647291038475', 'SAVINGS',   88000.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 28 DAY)),
    ((SELECT id FROM users WHERE username = 'sofia01'),   '283746192038', 'CHECKING',  15600.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 25 DAY)),
    ((SELECT id FROM users WHERE username = 'sofia01'),   '749382016473', 'SAVINGS',   33000.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 25 DAY)),
    ((SELECT id FROM users WHERE username = 'andres01'),  '192038475629', 'CHECKING',  22400.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 22 DAY)),
    ((SELECT id FROM users WHERE username = 'carmen01'),  '384716293847', 'SAVINGS',   57000.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 20 DAY)),
    ((SELECT id FROM users WHERE username = 'ramon01'),   '627384910284', 'CHECKING',  4900.00,  'OPEN', DATE_SUB(NOW(), INTERVAL 18 DAY)),
    ((SELECT id FROM users WHERE username = 'isabel01'),  '384029173648', 'SAVINGS',   71500.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 15 DAY)),
    ((SELECT id FROM users WHERE username = 'rafael01'),  '920473816253', 'CHECKING',  13800.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 12 DAY)),
    ((SELECT id FROM users WHERE username = 'lucia01'),   '384716029384', 'SAVINGS',   49000.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 10 DAY)),
    ((SELECT id FROM users WHERE username = 'fernando01'),'273849016253', 'CHECKING',  28500.00, 'OPEN', DATE_SUB(NOW(), INTERVAL 8  DAY));

-- =============================================================================
-- TRANSACTIONS
-- 50 transactions: DEPOSIT, WITHDRAWAL, TRANSFER
-- Uses subqueries to resolve account IDs
-- Spread across last 60 days
-- =============================================================================

INSERT IGNORE INTO `transactions`
(`from_account_id`, `to_account_id`, `amount`, `type`, `timestamp`, `description`)
VALUES
    -- ── Initial deposits (no from_account) ───────────────────────────────────
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '384729301847'),  85000.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 60 DAY), 'Initial deposit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '271649038520'),  32000.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 60 DAY), 'Initial deposit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '938471620384'), 120000.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 55 DAY), 'Initial deposit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '503847162039'),  18500.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 55 DAY), 'Initial deposit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '629384710265'),  45000.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 50 DAY), 'Initial deposit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '847362910485'),   9800.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 50 DAY), 'Initial deposit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '193847265038'),  67500.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 48 DAY), 'Initial deposit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '720384916273'),  14200.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 48 DAY), 'Initial deposit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '465829103748'),  95000.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 45 DAY), 'Initial deposit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '381047296583'),  27300.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 45 DAY), 'Initial deposit'),

    -- ── Additional deposits ───────────────────────────────────────────────────
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '574839201647'),  38000.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 42 DAY), 'Salary credit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '748392016475'),  52000.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 40 DAY), 'Business income'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '192847365029'),  74000.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 38 DAY), 'Investment return'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '384720193847'),  43500.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 35 DAY), 'Salary credit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '573849201638'),  61000.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 30 DAY), 'Salary credit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '647291038475'),  88000.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 28 DAY), 'Business income'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '749382016473'),  33000.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 25 DAY), 'Freelance payment'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '384716293847'),  57000.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 20 DAY), 'Salary credit'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '384029173648'),  71500.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 15 DAY), 'Investment return'),
    (NULL, (SELECT id FROM bank_accounts WHERE account_number = '384716029384'),  49000.00, 'DEPOSIT', DATE_SUB(NOW(), INTERVAL 10 DAY), 'Salary credit'),

    -- ── Withdrawals (no to_account) ───────────────────────────────────────────
    ((SELECT id FROM bank_accounts WHERE account_number = '271649038520'), NULL,  2000.00, 'WITHDRAWAL', DATE_SUB(NOW(), INTERVAL 55 DAY), 'ATM withdrawal'),
    ((SELECT id FROM bank_accounts WHERE account_number = '847362910485'), NULL,  1500.00, 'WITHDRAWAL', DATE_SUB(NOW(), INTERVAL 48 DAY), 'ATM withdrawal'),
    ((SELECT id FROM bank_accounts WHERE account_number = '720384916273'), NULL,  3000.00, 'WITHDRAWAL', DATE_SUB(NOW(), INTERVAL 45 DAY), 'Cash withdrawal'),
    ((SELECT id FROM bank_accounts WHERE account_number = '293847561028'), NULL,   500.00, 'WITHDRAWAL', DATE_SUB(NOW(), INTERVAL 40 DAY), 'ATM withdrawal'),
    ((SELECT id FROM bank_accounts WHERE account_number = '836472910385'), NULL,  1000.00, 'WITHDRAWAL', DATE_SUB(NOW(), INTERVAL 35 DAY), 'ATM withdrawal'),
    ((SELECT id FROM bank_accounts WHERE account_number = '647382910564'), NULL,  2500.00, 'WITHDRAWAL', DATE_SUB(NOW(), INTERVAL 30 DAY), 'Cash withdrawal'),
    ((SELECT id FROM bank_accounts WHERE account_number = '920384716253'), NULL,  4000.00, 'WITHDRAWAL', DATE_SUB(NOW(), INTERVAL 25 DAY), 'ATM withdrawal'),
    ((SELECT id FROM bank_accounts WHERE account_number = '384920173648'), NULL,   800.00, 'WITHDRAWAL', DATE_SUB(NOW(), INTERVAL 20 DAY), 'ATM withdrawal'),
    ((SELECT id FROM bank_accounts WHERE account_number = '283746192038'), NULL,  1200.00, 'WITHDRAWAL', DATE_SUB(NOW(), INTERVAL 15 DAY), 'Cash withdrawal'),
    ((SELECT id FROM bank_accounts WHERE account_number = '627384910284'), NULL,   600.00, 'WITHDRAWAL', DATE_SUB(NOW(), INTERVAL 10 DAY), 'ATM withdrawal'),
    ((SELECT id FROM bank_accounts WHERE account_number = '273849016253'), NULL,  3500.00, 'WITHDRAWAL', DATE_SUB(NOW(), INTERVAL  5 DAY), 'ATM withdrawal'),

    -- ── Transfers ─────────────────────────────────────────────────────────────
    (
        (SELECT id FROM bank_accounts WHERE account_number = '271649038520'),
        (SELECT id FROM bank_accounts WHERE account_number = '938471620384'),
        5000.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 58 DAY), 'Payment for rent'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '503847162039'),
        (SELECT id FROM bank_accounts WHERE account_number = '384729301847'),
        3000.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 53 DAY), 'Loan repayment'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '629384710265'),
        (SELECT id FROM bank_accounts WHERE account_number = '720384916273'),
        8000.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 47 DAY), 'Business payment'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '465829103748'),
        (SELECT id FROM bank_accounts WHERE account_number = '574839201647'),
       12000.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 43 DAY), 'Invoice payment'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '748392016475'),
        (SELECT id FROM bank_accounts WHERE account_number = '193847265038'),
        4500.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 38 DAY), 'Shared expenses'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '192847365029'),
        (SELECT id FROM bank_accounts WHERE account_number = '647382910564'),
        7500.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 33 DAY), 'Loan payment'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '384720193847'),
        (SELECT id FROM bank_accounts WHERE account_number = '836472910385'),
        2000.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 28 DAY), 'Bill payment'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '573849201638'),
        (SELECT id FROM bank_accounts WHERE account_number = '381047296583'),
        6000.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 25 DAY), 'Payment for services'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '647291038475'),
        (SELECT id FROM bank_accounts WHERE account_number = '749382016473'),
       15000.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 22 DAY), 'Business income share'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '192038475629'),
        (SELECT id FROM bank_accounts WHERE account_number = '384716293847'),
        3500.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 18 DAY), 'Shared expenses'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '920473816253'),
        (SELECT id FROM bank_accounts WHERE account_number = '384029173648'),
        9000.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 14 DAY), 'Loan repayment'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '384716029384'),
        (SELECT id FROM bank_accounts WHERE account_number = '273849016253'),
        5500.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL 11 DAY), 'Invoice payment'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '271649038520'),
        (SELECT id FROM bank_accounts WHERE account_number = '629384710265'),
        2500.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL  9 DAY), 'Shared rent'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '938471620384'),
        (SELECT id FROM bank_accounts WHERE account_number = '465829103748'),
       10000.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL  7 DAY), 'Business payment'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '503847162039'),
        (SELECT id FROM bank_accounts WHERE account_number = '847362910485'),
        1800.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL  6 DAY), 'Utility split'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '283746192038'),
        (SELECT id FROM bank_accounts WHERE account_number = '920384716253'),
        4200.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL  4 DAY), 'Freelance payment'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '627384910284'),
        (SELECT id FROM bank_accounts WHERE account_number = '573849201638'),
        1500.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL  3 DAY), 'Loan repayment'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '192038475629'),
        (SELECT id FROM bank_accounts WHERE account_number = '384720193847'),
        7000.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL  2 DAY), 'Payment for goods'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '384716029384'),
        (SELECT id FROM bank_accounts WHERE account_number = '647291038475'),
        3300.00, 'TRANSFER', DATE_SUB(NOW(), INTERVAL  1 DAY), 'Service fee'
    ),
    (
        (SELECT id FROM bank_accounts WHERE account_number = '273849016253'),
        (SELECT id FROM bank_accounts WHERE account_number = '938471620384'),
        8500.00, 'TRANSFER', NOW(),                             'Monthly remittance'
    );