package com.pingfloyd.doy.exception;

public class CourierIsNotAvailableException extends RuntimeException{
    public CourierIsNotAvailableException(String message){
        super(message);
    }
}
