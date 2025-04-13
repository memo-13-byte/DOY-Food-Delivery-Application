package com.pingfloyd.doy.exception;

public class CartIsNotEmptyException  extends RuntimeException{
    public CartIsNotEmptyException(String message) {
        super(message);
    }
}
