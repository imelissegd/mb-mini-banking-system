package com.example.minibankingsystem.exception;


import com.example.minibankingsystem.component.MessageHelper;

public class ResourceNotFoundException extends RuntimeException {
    // User
    public static final String USER_ID = "error.user.id.not.found";
    public static final String USER_NAME = "error.user.username.not.found";

    // Bank Account
    public static final String BANK_ACCOUNT_NUMBER = "error.bank.account.number.not.found";
    public static final String BANK_ACCOUNT_TYPE = "error.bank.account.type.not.found";
    public static final String BANK_ACCOUNT_DEFAULT = "error.bank.account.not.found";

    // Transaction
    public static final String TRANSACTION_ID = "error.transaction.id.not.found";


    public ResourceNotFoundException(String key, String value) {
        super(MessageHelper.get(key, value));
    }
    public ResourceNotFoundException(String key) {
        super(MessageHelper.get(key));
    }
}