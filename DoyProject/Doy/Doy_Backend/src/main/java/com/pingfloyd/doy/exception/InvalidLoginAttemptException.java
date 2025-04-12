package com.pingfloyd.doy.exception;

public class InvalidLoginAttemptException extends RuntimeException {
    public InvalidLoginAttemptException(String message) {
        super(message);
    }
}
