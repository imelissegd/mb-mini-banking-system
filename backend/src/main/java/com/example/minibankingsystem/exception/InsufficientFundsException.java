package com.example.minibankingsystem.exception;

import com.example.minibankingsystem.component.MessageHelper;

public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException() {
        super(MessageHelper.get("error.account.insufficient.funds"));
    }
}