package com.pingfloyd.doy.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import lombok.*;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class RegistrationRequest {

    @NotBlank(message = "First name cannot be blank")
    @Size(min = 3 , max = 30 , message = "First name must be between 3 and 30 characters")
    private final String firstName;
    @NotBlank(message = "Last name cannot be blank")
    @Size(min = 2 , max = 30 , message = "Last name must be between 2 and 30 characters")
    private final String lastName;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format.")
    private final String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$",
            message = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&+=!)"
    )
    private final String password;


    //@Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Invalid phone number format")
    @NotBlank(message = "Phone number must not be blank")
    @Size(min = 7, max = 20, message = "Invalid phone number")
    private final String phoneNumber;

    @Valid
    private DtoAddress dtoAddress;
}
