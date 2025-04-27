package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.UserRoles;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoUserIU {
    private String firstname;
    private String lastname;
    private String email;
    private String phoneNumber;
    private UserRoles role;
}
