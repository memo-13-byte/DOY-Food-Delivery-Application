package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoComment;
import com.pingfloyd.doy.dto.DtoCommentIU;
import com.pingfloyd.doy.dto.DtoReply;
import com.pingfloyd.doy.dto.DtoReplyIU;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface ICommentController {
    ResponseEntity<DtoComment> postComment(DtoCommentIU dtoCommentIU);
    ResponseEntity<List<DtoReply>> getReplies(Long commentId);
    ResponseEntity<DtoReply> postReply(DtoReplyIU dtoReplyIU);
    ResponseEntity<List<DtoComment>> getCommentsForCourier(Long courierId);
    ResponseEntity<List<DtoComment>> getCommentsForRestaurant(Long restaurantId);
}
