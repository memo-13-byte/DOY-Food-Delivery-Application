package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.DtoOrderReview;
import com.pingfloyd.doy.dto.DtoOrderReviewIU;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
public interface IOrderReviewService {
    DtoOrderReview postOrderReview(DtoOrderReviewIU dtoOrderReviewIU);
    DtoOrderReview getOrderReview(Long orderId);
}
