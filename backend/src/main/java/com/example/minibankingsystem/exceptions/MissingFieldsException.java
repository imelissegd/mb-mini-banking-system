package com.example.minibankingsystem.exceptions;

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


    public MissingFieldsException(String key) {
        super(key);
    }
}
