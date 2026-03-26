package com.example.minibankingsystem.exceptions;

public class InvalidTransactionTokenException extends RuntimeException {
    public InvalidTransactionTokenException(String message) {
        super(message);
    }
}
