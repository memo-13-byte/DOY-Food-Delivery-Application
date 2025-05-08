package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoOrderReview;
import com.pingfloyd.doy.dto.DtoOrderReviewIU;
import com.pingfloyd.doy.services.IOrderReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/api/order-review")
public class OrderReviewController implements IOrderReviewController {

    private IOrderReviewService orderReviewService;

    @Autowired
    public OrderReviewController(IOrderReviewService orderReviewService) {
        this.orderReviewService = orderReviewService;
    }

    @PostMapping("/post")
    public ResponseEntity<DtoOrderReview> postOrderReview(@RequestBody DtoOrderReviewIU dtoOrderReviewIU) {
        return ResponseEntity.ok(orderReviewService.postOrderReview(dtoOrderReviewIU));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<DtoOrderReview> getOrderReview(@PathVariable(name = "id") Long orderId) {
        return ResponseEntity.ok(orderReviewService.getOrderReview(orderId));
    }


}
