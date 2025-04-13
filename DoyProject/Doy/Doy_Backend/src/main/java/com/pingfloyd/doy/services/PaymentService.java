package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.DtoPaymentInformation;
import com.pingfloyd.doy.dto.DtoPaymentInformationIU;
import com.pingfloyd.doy.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService implements IPaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public DtoPaymentInformation postPaymentInformation(DtoPaymentInformationIU paymentInformationIU) {
        return null;
    }

    @Override
    public DtoPaymentInformation deletePaymentInformation(Long id) {
        return null;
    }

    @Override
    public DtoPaymentInformation getPaymentInformation(Long id) {
        return null;
    }
}
