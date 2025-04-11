package com.pingfloyd.doy.dto;
import jakarta.validation.constraints.*;

import lombok.*;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class RegistrationRequest {

    @NotBlank(message = "User name cannot be blank")
    @Size(min = 3 , max = 30 , message = "Username must be between 3 and 30 characters")
    private final String firstName;
    @NotBlank(message = "Last name cannot be blank")
    @Size(min = 2 , max = 30 , message = "Name must be between 2 and 30 characters")
    private final String lastName;

    @NotBlank(message = "Email cannot be blank")
    /*
    @Pattern(regexp =  "^+@(hotmail|gmail)\\.com$")
    */
    private final String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    /*
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$",
            message = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&+=!)"
    )
    */
    private final String password;

    //@Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Invalid phone number format")
    private final String phoneNumber;


}
