package com.pingfloyd.doy.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiError<T> {
    private String code;
    private Date timestamp;
    private T errors;
}
