package com.pingfloyd.doy.dto;


import com.pingfloyd.doy.entities.UserRoles;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class DtoPendingRegister {

    List<UserInfo> pendingUsers = new ArrayList<>();

    @Getter
    @Setter
    @NoArgsConstructor
    public static class UserInfo{
        private Long id;
        private String name;
        @Enumerated(EnumType.STRING)
        private UserRoles role;
    }
}
