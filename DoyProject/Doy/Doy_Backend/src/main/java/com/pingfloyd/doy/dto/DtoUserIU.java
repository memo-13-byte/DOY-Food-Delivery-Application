package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.UserRoles;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoUserIU {
    @NotBlank(message = "First name must not be empty or blank.")
    @Size(min = 2, max = 50, message = "First name must be in between 2 and 50 characters")
    private String firstname;

    @NotBlank(message = "Last name must not be empty or blank.")
    @Size(min = 2, max = 50, message = "Last name must be in between 2 and 50 characters")
    private String lastname;

    @NotBlank(message = "Last name must not be empty or blank.")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Email
    private String email;

    @Size(min = 7, max = 20, message = "Phone number must be between 7 and 20 characters.")
    private String phoneNumber;

    private UserRoles role;
}
