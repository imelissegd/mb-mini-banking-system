package com.example.minibankingsystem.exceptions;


public class ResourceNotFoundException extends RuntimeException {
    // User
    public static final String USER_ID = "error.user.not.found.id";

    // Bank Account
    public static final String BANK_ACCOUNT_TYPE = "error.bank.account.type.not.found";


    public ResourceNotFoundException(String key) {
        super(key);
    }
}