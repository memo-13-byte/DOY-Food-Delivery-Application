package com.pingfloyd.doy.exception;

public class UnauthorizedRequestException extends RuntimeException {
    public UnauthorizedRequestException(String message) {
        super(message);
    }

    public UnauthorizedRequestException() {
        super("Unauthorized Request");
    }
}
