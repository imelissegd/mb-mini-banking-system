package com.example.minibankingsystem.exception;

public class MissingFieldsException extends RuntimeException {
    // User
    public static final String USER_ID = "error.user.id.missing";
    public static final String USER_USERNAME = "error.user.username.missing";
    public static final String USER_FIRSTNAME = "error.user.firstname.missing";
    public static final String USER_LASTNAME = "error.user.lastname.missing";
    public static final String USER_EMAIL = "error.user.email.missing";
    public static final String USER_CONTACTNUMBER = "error.user.contactnumber.missing";
    public static final String USER_PASSWORD = "error.user.password.missing";
    public static final String USER_ROLE = "error.user.role.missing";

    // Bank account
    public static final String FROM_BANK_ACCOUNT_NUMBER = "error.from_bank.account_number.missing";
    public static final String TO_BANK_ACCOUNT_NUMBER = "error.to_bank.account_number.missing";


    public MissingFieldsException(String key) {
        super(key);
    }
}
