package com.pingfloyd.doy.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.*;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        List<ObjectError> errors = ex.getBindingResult().getAllErrors();
        Map<String, List<String>> errorMap = new HashMap<>();

        for (ObjectError error : errors) {
            FieldError fieldError = (FieldError)error;
            if (!errorMap.containsKey(fieldError.getField())) {
                errorMap.put(fieldError.getField(), new ArrayList<>());
            }
            errorMap.get(fieldError.getField()).add(fieldError.getDefaultMessage());
        }

        return ResponseEntity.badRequest().body(ApiError.createApiError(errorMap));
    }

    @ExceptionHandler(value = ItemNotFoundException.class)
    public ResponseEntity<ApiError> handleItemNotFoundException(ItemNotFoundException ex) {
        return ResponseEntity.badRequest().body(ApiError.createApiError(ex.getMessage()));
    }
    @ExceptionHandler(value = UserIsAlreadySuspendedException.class)
    public ResponseEntity<ApiError> handleUserIsAlreadySuspendedException(UserIsAlreadySuspendedException ex) {
        return ResponseEntity.badRequest().body(ApiError.createApiError(ex.getMessage()));
    }
    @ExceptionHandler(value = OrderAlreadyTakenException.class)
    public ResponseEntity<ApiError> handleItemNotFoundException(OrderAlreadyTakenException ex) {
        return ResponseEntity.badRequest().body(ApiError.createApiError(ex.getMessage()));
    }
    @ExceptionHandler(value = MinOrderPriceNotMeetException.class)
    public ResponseEntity<ApiError> handleMinOrderPriceNotMeetException(MinOrderPriceNotMeetException ex) {
        return ResponseEntity.badRequest().body(ApiError.createApiError(ex.getMessage()));
    }
    @ExceptionHandler(value = CourierRequestNotFoundException.class)
    public ResponseEntity<ApiError> handleItemNotFoundException(CourierRequestNotFoundException ex) {
        return ResponseEntity.badRequest().body(ApiError.createApiError(ex.getMessage()));
    }
    @ExceptionHandler(value = CourierIsNotAvailableException.class)
    public ResponseEntity<ApiError> handleCourierIsNotAvailableException(CourierIsNotAvailableException ex) {
        return ResponseEntity.badRequest().body(ApiError.createApiError(ex.getMessage()));
    }

    @ExceptionHandler(value = OrderNotFoundException.class)
    public ResponseEntity<ApiError> handleOrderNotFoundException(OrderNotFoundException ex){
        return ResponseEntity.badRequest().body(ApiError.createApiError(ex.getMessage()));
    }
    @ExceptionHandler(value = UserAlreadyExistException.class)
    public ResponseEntity<ApiError> handleUserAlreadyExistException(UserAlreadyExistException ex){
        return ResponseEntity.badRequest().body(ApiError.createApiError(ex.getMessage()));
    }

    @ExceptionHandler(value = RestaurantNotFoundException.class)
    public ResponseEntity<ApiError> handleRestaurantNotFoundException(RestaurantNotFoundException ex) {
        return ResponseEntity.badRequest().body(ApiError.createApiError(ex.getMessage()));
    }

    @ExceptionHandler(value = InvalidLoginAttemptException.class)
    public ResponseEntity<ApiError> handleInvalidLoginAttemptException(InvalidLoginAttemptException ex) {
        return ResponseEntity.badRequest().body(ApiError.createApiError(ex.getMessage()));
    }
    @ExceptionHandler(value = UserNotFoundException.class)
    public ResponseEntity<ApiError> handleUserNotFoundException(UserNotFoundException ex){
        return ResponseEntity.badRequest().body(ApiError.createApiError(ex.getMessage()));
    }
    @ExceptionHandler(value = CartIsNotEmptyException.class)
    public ResponseEntity<ApiError> handleCartIsNotEmptyException(CartIsNotEmptyException ex){
        return ResponseEntity.badRequest().body(ApiError.createApiError(ex.getMessage()));
    }

    @ExceptionHandler(value = UnauthorizedRequestException.class)
    public ResponseEntity<ApiError> handleUnauthorizedRequestException(UnauthorizedRequestException ex){
        return ResponseEntity.status(401).build();
    }
}
