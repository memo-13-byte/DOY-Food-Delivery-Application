package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoOrderReview;
import com.pingfloyd.doy.dto.DtoOrderReviewIU;
import com.pingfloyd.doy.entities.UserRoles;
import com.pingfloyd.doy.exception.UnauthorizedRequestException;
import com.pingfloyd.doy.jwt.JwtService;
import com.pingfloyd.doy.services.IOrderReviewService;
import com.pingfloyd.doy.services.OrderService;
import com.pingfloyd.doy.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/api/order-review")
public class OrderReviewController implements IOrderReviewController {

    private final JwtService jwtService;
    private final UserService userService;
    private final OrderService orderService;
    private IOrderReviewService orderReviewService;

    @Autowired
    public OrderReviewController(IOrderReviewService orderReviewService, JwtService jwtService, UserService userService, OrderService orderService) {
        this.orderReviewService = orderReviewService;
        this.jwtService = jwtService;
        this.userService = userService;
        this.orderService = orderService;
    }

    @PostMapping("/post")
    public ResponseEntity<DtoOrderReview> postOrderReview(@RequestBody DtoOrderReviewIU dtoOrderReviewIU) {
        if (jwtService.checkIfUserRole(UserRoles.CUSTOMER) &&
                userService.checkIfSameUserFromToken(orderService.GetOrderUserInformation(dtoOrderReviewIU.getOrderId())
                        .getCustomerId()))
            return ResponseEntity.ok(orderReviewService.postOrderReview(dtoOrderReviewIU));
        throw new UnauthorizedRequestException();

    }

    @GetMapping("/get/{id}")
    public ResponseEntity<DtoOrderReview> getOrderReview(@PathVariable(name = "id") Long orderId) {
        if (jwtService.checkIfUserRole(UserRoles.CUSTOMER) &&
                userService.checkIfSameUserFromToken(orderService.GetOrderUserInformation(orderId)
                        .getCustomerId()))
            return ResponseEntity.ok(orderReviewService.getOrderReview(orderId));
        throw new UnauthorizedRequestException();

    }


}
