package com.pingfloyd.doy.dto;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DtoCourierForOrder {

    private Long courierId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String location;
}
