package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoComment;
import com.pingfloyd.doy.dto.DtoCommentIU;
import com.pingfloyd.doy.dto.DtoReply;
import com.pingfloyd.doy.dto.DtoReplyIU;
import com.pingfloyd.doy.entities.UserRoles;
import com.pingfloyd.doy.exception.UnauthorizedRequestException;
import com.pingfloyd.doy.jwt.JwtService;
import com.pingfloyd.doy.services.ICommentService;
import com.pingfloyd.doy.services.IOrderReviewService;
import com.pingfloyd.doy.services.IUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
@CrossOrigin(origins = {"http://localhost:3000"})
public class CommentController implements ICommentController {

    private ICommentService commentService;
    private IOrderReviewService orderReviewService;
    private JwtService jwtService;
    private IUserService userService;
    @Autowired
    public CommentController(ICommentService commentService, IOrderReviewService orderReviewService,
                             JwtService jwtService, IUserService userService) {
        this.commentService = commentService;
        this.orderReviewService = orderReviewService;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    @PostMapping("/post")
    public ResponseEntity<DtoComment> postComment(@RequestBody @Valid DtoCommentIU dtoCommentIU) {
        if (!jwtService.checkIfUserRole(UserRoles.CUSTOMER) ||
                userService.checkIfSameUserFromToken(dtoCommentIU.getUserId()))
            throw new UnauthorizedRequestException();

        return ResponseEntity.ok(commentService.postComment(dtoCommentIU));
    }

    @PostMapping("/post-reply")
    public ResponseEntity<DtoReply> postReply(@RequestBody @Valid DtoReplyIU dtoReplyIU) {
        if (!jwtService.checkIfUserRole(UserRoles.CUSTOMER, UserRoles.COURIER, UserRoles.RESTAURANT_OWNER) ||
                userService.checkIfSameUserFromToken(dtoReplyIU.getUserId()))
            throw new UnauthorizedRequestException();
        return ResponseEntity.ok(commentService.postReply(dtoReplyIU));
    }

    @Override
    @GetMapping("/get/for-courier/{id}")
    public ResponseEntity<List<DtoComment>> getCommentsForCourier(@PathVariable(name = "id") Long courierId) {
        if (userService.checkIfSameUserFromToken(courierId))
            throw new UnauthorizedRequestException();

        return ResponseEntity.ok(commentService.getCommentsForCourier(courierId));
    }

    @Override
    @GetMapping("/get/for-restaurant/{id}")
    public ResponseEntity<List<DtoComment>> getCommentsForRestaurant(@PathVariable(name = "id") Long restaurantId) {
        if (userService.checkIfSameUserFromToken(restaurantId))
            throw new UnauthorizedRequestException();
        return ResponseEntity.ok(commentService.getCommentsForRestaurant(restaurantId));
    }


    @Override
    @GetMapping("/get-replies/{id}")
    public ResponseEntity<List<DtoReply>> getReplies(@PathVariable(name = "id") Long id) {
        if (!jwtService.checkIfUserRole(UserRoles.CUSTOMER, UserRoles.COURIER, UserRoles.RESTAURANT_OWNER))
            throw new UnauthorizedRequestException();
        return ResponseEntity.ok(commentService.getReplies(id));
    }
}
