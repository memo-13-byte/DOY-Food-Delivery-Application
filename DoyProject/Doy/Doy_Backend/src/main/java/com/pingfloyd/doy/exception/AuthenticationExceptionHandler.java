package com.pingfloyd.doy.exception;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;
//handles 401 (invalid or no token)
public class AuthenticationExceptionHandler implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        ApiError<String> errorMessage = ApiError.createApiError(authException.getMessage());
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write(
                authException.getMessage() + "\nat time: " +
                        errorMessage.getTimestamp() + "\nwith code: " + errorMessage.getCode() + "\n"
        );
    }
}
