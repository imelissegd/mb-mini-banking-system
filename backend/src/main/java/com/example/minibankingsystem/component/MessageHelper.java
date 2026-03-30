package com.example.minibankingsystem.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class MessageHelper {

    private static MessageSource messageSource;

    @Autowired
    public MessageHelper(MessageSource messageSource) {
        MessageHelper.messageSource = messageSource;
    }

    public static String get(String key, Object... args) {
        return messageSource.getMessage(key, args, Locale.ROOT);
    }
}