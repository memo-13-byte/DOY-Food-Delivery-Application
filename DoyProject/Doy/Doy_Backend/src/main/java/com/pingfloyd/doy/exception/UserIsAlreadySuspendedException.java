package com.pingfloyd.doy.exception;

public class UserIsAlreadySuspendedException extends RuntimeException{
    public UserIsAlreadySuspendedException(String msg){
        super(msg);
    }
}
