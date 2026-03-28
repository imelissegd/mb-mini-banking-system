package com.example.minibankingsystem.exception;

public class ResourceDuplicateException extends RuntimeException {
    // User
    public static final String USER_USERNAME = "error.user.username.duplicate";
    public static final String USER_EMAIl =  "error.user.email.duplicate";
    public static final String USER_CONTACTNUMBER = "error.user.contactnumber.duplicate";


    public ResourceDuplicateException(String key) {
        super(key);
    }
}