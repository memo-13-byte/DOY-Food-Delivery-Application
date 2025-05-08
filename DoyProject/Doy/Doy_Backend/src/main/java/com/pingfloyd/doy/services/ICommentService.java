package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.DtoComment;
import com.pingfloyd.doy.dto.DtoCommentIU;
import com.pingfloyd.doy.dto.DtoReply;
import com.pingfloyd.doy.dto.DtoReplyIU;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface ICommentService {
    DtoComment postComment(DtoCommentIU dtoCommentIU);
    List<DtoReply> getReplies(Long commentId);
    DtoReply postReply(DtoReplyIU dtoReplyIU);
    List<DtoComment> getCommentsForCourier(Long courierId);
    List<DtoComment> getCommentsForRestaurant(Long restaurantId);
}
