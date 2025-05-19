package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.UserRoles;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class DtoAdminUserManagement {

    private Long id;
    private String firstname;
    private String lastname;
    private UserRoles role;
    private Boolean isSuspended;
    private LocalDateTime suspendedUntil;
}
