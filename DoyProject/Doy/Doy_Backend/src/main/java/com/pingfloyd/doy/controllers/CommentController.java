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
        if (jwtService.checkIfUserRole(UserRoles.CUSTOMER) &&
                userService.checkIfSameUserFromToken(dtoCommentIU.getUserId()))
            return ResponseEntity.ok(commentService.postComment(dtoCommentIU));
        throw new UnauthorizedRequestException();
    }

    @PostMapping("/post-reply")
    public ResponseEntity<DtoReply> postReply(@RequestBody @Valid DtoReplyIU dtoReplyIU) {
        if (userService.checkIfSameUserFromToken(dtoReplyIU.getUserId()))
            return ResponseEntity.ok(commentService.postReply(dtoReplyIU));
        throw new UnauthorizedRequestException();

    }

    @Override
    @GetMapping("/get/for-courier/{id}")
    public ResponseEntity<List<DtoComment>> getCommentsForCourier(@PathVariable(name = "id") Long courierId) {
        if (!userService.checkIfSameUserFromToken(courierId))
            throw new UnauthorizedRequestException();

        return ResponseEntity.ok(commentService.getCommentsForCourier(courierId));
    }

    @Override
    @GetMapping("/get/for-restaurant/{id}")
    public ResponseEntity<List<DtoComment>> getCommentsForRestaurant(@PathVariable(name = "id") Long restaurantId) {
        if (!userService.checkIfSameUserFromToken(restaurantId))
            throw new UnauthorizedRequestException();
        return ResponseEntity.ok(commentService.getCommentsForRestaurant(restaurantId));
    }


    @Override
    @GetMapping("/get-replies/{id}")
    public ResponseEntity<List<DtoReply>> getReplies(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(commentService.getReplies(id));
    }

    @Override
    @PostMapping("/post/complaint")
    public ResponseEntity<DtoComment> postComplaint(@RequestBody @Valid DtoCommentIU dtoCommentIU) {
        if (jwtService.checkIfUserRole(UserRoles.CUSTOMER) &&
                userService.checkIfSameUserFromToken(dtoCommentIU.getUserId()))
            return ResponseEntity.ok(commentService.postComplaint(dtoCommentIU));
        throw new UnauthorizedRequestException();
    }

    @Override
    @GetMapping("get/complaints")
    public ResponseEntity<List<DtoComment>> getComplaints() {
        if (jwtService.checkIfUserRole(UserRoles.ADMIN)) {
            return ResponseEntity.ok(commentService.getComplaints());
        }
        throw new UnauthorizedRequestException();
    }

    @GetMapping("get/complaints/{email}")
    public ResponseEntity<List<DtoComment>> getComplaintsOfUser(@PathVariable(name = "email") String email) {
        if (jwtService.checkIfUserRole(UserRoles.CUSTOMER) && jwtService.getUserEmail().equals(email)) {
            return ResponseEntity.ok(commentService.getComplaintsOfUser(email));
        }
        throw new UnauthorizedRequestException();
    }

}
