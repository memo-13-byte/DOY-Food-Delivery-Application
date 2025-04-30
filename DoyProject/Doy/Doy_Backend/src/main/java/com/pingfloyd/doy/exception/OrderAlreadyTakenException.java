package com.pingfloyd.doy.exception;

public class OrderAlreadyTakenException extends RuntimeException{
    public OrderAlreadyTakenException(String message){
        super(message);
    }
}
