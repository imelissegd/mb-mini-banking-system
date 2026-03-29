package com.example.minibankingsystem.exception;


public class ResourceNotFoundException extends RuntimeException {
    // User
    public static final String USER_ID = "error.user.not.found.id";

    // Bank Account
    public static final String BANK_ACCOUNT_TYPE = "error.bank.account.type.not.found";

    // Transaction
    public static final String TRANSACTION_ID = "error.transaction.id.not.found";


    public ResourceNotFoundException(String key) {
        super(key);
    }
}