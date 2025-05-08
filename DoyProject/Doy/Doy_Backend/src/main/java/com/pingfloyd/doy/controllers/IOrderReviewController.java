package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoOrderReview;
import com.pingfloyd.doy.dto.DtoOrderReviewIU;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public interface IOrderReviewController {
    ResponseEntity<DtoOrderReview> postOrderReview(DtoOrderReviewIU dtoOrderReviewIU);
    ResponseEntity<DtoOrderReview> getOrderReview(Long orderId);
}
