package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoComment;
import com.pingfloyd.doy.dto.DtoCommentIU;
import com.pingfloyd.doy.dto.DtoReply;
import com.pingfloyd.doy.dto.DtoReplyIU;
import com.pingfloyd.doy.services.ICommentService;
import com.pingfloyd.doy.services.IOrderReviewService;
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
    @Autowired
    public CommentController(ICommentService commentService, IOrderReviewService orderReviewService) {
        this.commentService = commentService;
        this.orderReviewService = orderReviewService;
    }

    @Override
    @PostMapping("/post")
    public ResponseEntity<DtoComment> postComment(@RequestBody @Valid DtoCommentIU dtoCommentIU) {
        return ResponseEntity.ok(commentService.postComment(dtoCommentIU));
    }

    @PostMapping("/post-reply")
    public ResponseEntity<DtoReply> postReply(@RequestBody @Valid DtoReplyIU dtoReplyIU) {
        return ResponseEntity.ok(commentService.postReply(dtoReplyIU));
    }

    @Override
    @GetMapping("/get/for-courier/{id}")
    public ResponseEntity<List<DtoComment>> getCommentsForCourier(@PathVariable(name = "id") Long courierId) {
        return ResponseEntity.ok(commentService.getCommentsForCourier(courierId));
    }

    @Override
    @GetMapping("/get/for-restaurant/{id}")
    public ResponseEntity<List<DtoComment>> getCommentsForRestaurant(@PathVariable(name = "id") Long restaurantId) {
        return ResponseEntity.ok(commentService.getCommentsForRestaurant(restaurantId));
    }


    @Override
    @GetMapping("/get-replies/{id}")
    public ResponseEntity<List<DtoReply>> getReplies(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(commentService.getReplies(id));
    }
}
