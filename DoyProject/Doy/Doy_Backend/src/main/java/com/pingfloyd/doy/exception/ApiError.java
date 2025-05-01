package com.pingfloyd.doy.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiError<T> {
    private String code;
    private Date timestamp;
    private T errors;

    public static <T> ApiError<T> createApiError(T errors) {
        ApiError<T> apiError = new ApiError<>();
        apiError.setCode(UUID.randomUUID().toString());
        apiError.setTimestamp(new Date());
        apiError.setErrors(errors);
        return apiError;
    }
}
