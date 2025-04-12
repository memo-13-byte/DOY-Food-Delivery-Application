package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.Address;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoPaymentInformationIU {
    private String address;

    @NotEmpty(message = "Phone number must not be empty.")
    private String phoneNumber;

    @NotEmpty(message = "First name must not be empty")
    private String firstName;
    @NotEmpty
    private String lastName;
    @NotEmpty
    private String email;

    private String notesForCourier;
    private Integer tip;
    @NotEmpty
    private String cardNumber;
    @NotEmpty
    private String cvv;
    @NotEmpty
    private String expiryDate;
    @NotEmpty
    private String nameOnCard;
    @NotEmpty
    private String lastFourDigits;
}
