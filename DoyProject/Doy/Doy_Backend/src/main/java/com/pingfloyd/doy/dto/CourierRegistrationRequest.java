package com.pingfloyd.doy.dto;


import com.pingfloyd.doy.enums.CityEnum;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class CourierRegistrationRequest{
    @NotBlank(message = "User name cannot be blank")
    @Size(min = 3 , max = 30 , message = "Username must be between 3 and 30 characters")
    private final String firstName;
    @NotBlank(message = "Last name cannot be blank")
    @Size(min = 2 , max = 30 , message = "Name must be between 2 and 30 characters")
    private final String lastName;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format.")
    private final String email;

    @NotBlank(message = "Government Id cannot be blank")
    @Size(min = 11, max = 11 ,message = "Please enter a valid government id")
    @Pattern(regexp = "\\d{11}", message = "Government Id must contain only digits")
    private final String governmentId;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$",
            message = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&+=!)"
    )
    private final String password;

    //@Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Invalid phone number format")
    private final String phoneNumber;

    @NotBlank
    @Size(min =2  , message = "District name must be at least 2 characters long!")
    private String name;

    @NotNull
    private CityEnum city;
}
