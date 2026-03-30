package com.example.minibankingsystem.exception;

import com.example.minibankingsystem.component.MessageHelper;

public class AccountNotActiveException extends RuntimeException {

    public static final String USER = "error.user.account.not.active";
    public static final String USER_DEFAULT = "error.user.account.not.active.default";
    public static final String ACCOUNT = "error.bank.account.not.active";

    public AccountNotActiveException(String key,String username) {
        super(MessageHelper.get(key, username));
    }

    public AccountNotActiveException(String key) {
        super(MessageHelper.get(key));
    }
}