package com.example.minibankingsystem.exception;

public class InvalidTransactionTokenException extends RuntimeException {
    public InvalidTransactionTokenException(String message) {
        super(message);
    }
}
