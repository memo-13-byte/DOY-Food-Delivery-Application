package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoPaymentInformation;
import com.pingfloyd.doy.dto.DtoPaymentInformationIU;
import com.pingfloyd.doy.services.IPaymentService;
import com.pingfloyd.doy.services.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PaymentController implements IPaymentController{

    @Autowired
    private IPaymentService paymentService;

    @Override
    @PostMapping("/post")
    public ResponseEntity<DtoPaymentInformation> postPaymentInformation(@RequestBody @Valid DtoPaymentInformationIU paymentInformationIU) {
        return ResponseEntity.ok(paymentService.postPaymentInformation(paymentInformationIU));
    }

    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<DtoPaymentInformation> deletePaymentInformation(@PathVariable("id") Long id) {
        return ResponseEntity.ok(paymentService.deletePaymentInformation(id));
    }

    @Override
    @GetMapping("/get/{id}")
    public ResponseEntity<DtoPaymentInformation> getPaymentInformation(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentInformation(id));
    }
}
