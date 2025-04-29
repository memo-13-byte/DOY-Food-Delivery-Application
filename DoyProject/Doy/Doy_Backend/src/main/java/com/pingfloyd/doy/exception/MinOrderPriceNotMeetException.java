package com.pingfloyd.doy.exception;

public class MinOrderPriceNotMeetException extends RuntimeException{
    public MinOrderPriceNotMeetException(String message){
        super(message);
    }
}
