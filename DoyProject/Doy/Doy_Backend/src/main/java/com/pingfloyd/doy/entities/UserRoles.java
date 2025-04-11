package com.pingfloyd.doy.entities;

public enum UserRoles {
    ADMIN ("ADMIN"),
    CUSTOMER("CUSTOMER"),
    COURIER("COURIER"),
    RESTAURANT_OWNER("RESTAURANT_OWNER");

    public final String value;

    UserRoles(String roleName) {
        this.value = roleName;
    }

}
