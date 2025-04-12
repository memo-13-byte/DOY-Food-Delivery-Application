package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.DtoPaymentInformation;
import com.pingfloyd.doy.dto.DtoPaymentInformationIU;
import org.springframework.http.ResponseEntity;

public interface IPaymentService {
    DtoPaymentInformation postPaymentInformation(DtoPaymentInformationIU paymentInformationIU);
    DtoPaymentInformation deletePaymentInformation(Long id);
    DtoPaymentInformation getPaymentInformation(Long id);
}
