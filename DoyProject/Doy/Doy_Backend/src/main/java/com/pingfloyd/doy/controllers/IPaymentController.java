package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoPaymentInformation;
import com.pingfloyd.doy.dto.DtoPaymentInformationIU;
import org.springframework.http.ResponseEntity;

public interface IPaymentController {
    ResponseEntity<DtoPaymentInformation> postPaymentInformation(DtoPaymentInformationIU paymentInformationIU);
    ResponseEntity<DtoPaymentInformation> deletePaymentInformation(Long id);
    ResponseEntity<DtoPaymentInformation> getPaymentInformation(Long id);
}
