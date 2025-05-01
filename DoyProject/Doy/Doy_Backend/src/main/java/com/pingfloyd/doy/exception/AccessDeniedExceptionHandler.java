package com.pingfloyd.doy.exception;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;
//handles 403 (invalid auth)
public class AccessDeniedExceptionHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        ApiError<String> errorMessage = ApiError.createApiError(accessDeniedException.getMessage());
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getWriter().write(
                accessDeniedException.getMessage() + "\nat time: " +
                        errorMessage.getTimestamp() + "\nwith code: " + errorMessage.getCode() + "\n"
        );
    }
}
