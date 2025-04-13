package com.pingfloyd.doy.dto;

// Import necessary validation annotations
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.CreditCardNumber; // Common implementation - ensure dependency exists
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoPaymentInformationIU {

    @NotBlank(message = "Address must not be empty.") // Usually required for delivery/billing
    @Size(max = 255, message = "Address must not exceed 255 characters.")
    private String address;

    @NotBlank(message = "Phone number must not be empty.")
    // Basic pattern: Allows digits, spaces, +, - (adjust regex as needed for stricter format)
    @Size(min = 7, max = 20, message = "Phone number must be between 7 and 20 characters.")
    private String phoneNumber;

    @NotBlank(message = "First name must not be empty.")
    // Corrected message attribute format for @Size
    @Size(min = 2, max = 20, message = "First name must be between 2-20 characters.")
    private String firstName;

    @NotBlank(message = "Last name must not be empty.")
    @Size(min = 2, max = 30, message = "Last name must be between 2-30 characters.")
    private String lastName;

    @NotBlank(message = "Email must not be empty.")
    @Email(message = "Invalid email format.")
    @Size(max = 100, message = "Email must not exceed 100 characters.")
    private String email;

    @Size(max = 500, message = "Notes for courier must not exceed 500 characters.")
    private String notesForCourier;


    @Min(value = 0, message = "Tip cannot be negative.")
    private Integer tip;

    @NotBlank(message = "Card number must not be empty.")

    private String cardNumber;

    @NotBlank(message = "CVV must not be empty.")
    @Pattern(regexp = "^\\d{3,4}$", message = "CVV must be 3 or 4 digits.")
    private String cvv;

    @NotBlank(message = "Expiry date must not be empty.")
    @Pattern(regexp = "^(0[1-9]|1[0-2])-(\\d{2}|\\d{4})$", message = "Expiry date must be in MM/YY or MM/YYYY format.")
    private String expiryDate;

    @NotBlank(message = "Name on card must not be empty.")
    @Size(min = 2, max = 50, message = "Name on card must be between 2 and 50 characters.")
    private String nameOnCard;

    @NotBlank(message = "Last four digits must not be empty.")
    @Pattern(regexp = "^\\d{4}$", message = "Last four digits must be exactly 4 digits.")
    private String lastFourDigits;
}