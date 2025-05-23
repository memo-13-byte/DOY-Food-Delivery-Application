package com.pingfloyd.doy.services;

import com.pingfloyd.doy.controllers.CommentController;
import com.pingfloyd.doy.dto.*;
import com.pingfloyd.doy.entities.*;
import com.pingfloyd.doy.repositories.*;
import org.hibernate.query.Order;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService implements ICommentService {

    CommentRepository commentRepository;
    OrderReviewRepository orderReviewRepository;
    UserRepository userRepository;
    IUserService userService;

    @Autowired
    public CommentService(CommentRepository commentRepository, OrderReviewRepository orderReviewRepository,
                          UserRepository userRepository, IUserService userService) {
        this.commentRepository = commentRepository;
        this.orderReviewRepository = orderReviewRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Override
    public DtoComment postComment(DtoCommentIU dtoCommentIU) {
        Comment comment = new Comment();
        BeanUtils.copyProperties(dtoCommentIU, comment);
        comment.setCreatedAt(LocalDateTime.now());

        comment.setUser(userRepository.findById(dtoCommentIU.getUserId()).get());
        Comment savedComment = commentRepository.save(comment);
        DtoComment dtoComment = new DtoComment();
        BeanUtils.copyProperties(savedComment, dtoComment);
        dtoComment.setUser(userService.getUserById(savedComment.getUser().getId()));
        return dtoComment;
    }

    @Override
    public List<DtoReply> getReplies(Long id) {
        List<Reply> replies = commentRepository.findCommentsByReplyToID(id);
        if (replies.isEmpty()) {
            return List.of();
        }

        List<DtoReply> dtoReplies = new ArrayList<>();

        for (Reply reply: replies) {
            DtoReply dtoReply = new DtoReply();
            BeanUtils.copyProperties(reply, dtoReply);
            dtoReply.setReplyTo(reply.getReplyTo().getId());
            dtoReply.setUser(userService.getUserById(reply.getUser().getId()));
            dtoReplies.add(dtoReply);
        }

        return dtoReplies;
    }

    @Override
    public DtoReply postReply(DtoReplyIU dtoReplyIU) {
        Optional<Comment> optionalComment = commentRepository.findById(dtoReplyIU.getReplyTo());
        if (optionalComment.isEmpty()) {
            return null;
        }
        Reply reply= new Reply();
        BeanUtils.copyProperties(dtoReplyIU, reply);
        reply.setCreatedAt(LocalDateTime.now());
        reply.setReplyTo(optionalComment.get());
        reply.setUser(userRepository.findById(dtoReplyIU.getUserId()).get());
        Reply savedReply = commentRepository.save(reply);
        DtoReply dtoReply = new DtoReply();
        BeanUtils.copyProperties(savedReply, dtoReply);
        dtoReply.setReplyTo(reply.getReplyTo().getId());
        dtoReply.setUser(userService.getUserById(reply.getUser().getId()));
        return dtoReply;
    }

    @Override
    public List<DtoComment> getCommentsForCourier(Long courierId) {
        List<OrderReview> orderReviews = orderReviewRepository.findAllByCourierId(courierId);
        List<DtoComment> dtoComments = new ArrayList<>();
        for (OrderReview orderReview: orderReviews) {
            DtoComment dtoComment = new DtoComment();
            BeanUtils.copyProperties(orderReview.getCourierComment(), dtoComment);
            dtoComment.setUser(userService.getUserById(orderReview.getCustomer().getId()));
            dtoComments.add(dtoComment);
        }

        return dtoComments;
    }

    @Override
    public List<DtoComment> getCommentsForRestaurant(Long restaurantId) {
        List<OrderReview> orderReviews = orderReviewRepository.findAllByRestaurantId(restaurantId);
        List<DtoComment> dtoComments = new ArrayList<>();
        for (OrderReview orderReview: orderReviews) {
            DtoComment dtoComment = new DtoComment();
            BeanUtils.copyProperties(orderReview.getRestaurantComment(), dtoComment);
            dtoComment.setUser(userService.getUserById(orderReview.getCustomer().getId()));
            dtoComments.add(dtoComment);
        }

        return dtoComments;
    }

    @Override
    public DtoComment postComplaint(DtoCommentIU dtoCommentIU) {
        Complaint complaint = new Complaint();

        BeanUtils.copyProperties(dtoCommentIU, complaint);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setUser(userRepository.findById(dtoCommentIU.getUserId()).get());

        Complaint savedComment = commentRepository.save(complaint);
        DtoComment dtoComment = new DtoComment();
        BeanUtils.copyProperties(savedComment, dtoComment);
        dtoComment.setUser(userService.getUserById(savedComment.getUser().getId()));
        return dtoComment;
    }

    @Override
    public List<DtoComment> getComplaints() {
        List<Complaint> complaints = commentRepository.findComplaints();
        List<DtoComment> dtoComments = new ArrayList<>();

        for(Complaint complaint: complaints) {
            DtoComment dtoComment = new DtoComment();
            BeanUtils.copyProperties(complaint, dtoComment);
            dtoComment.setUser(userService.getUserById(complaint.getUser().getId()));
            dtoComments.add(dtoComment);
        }

        return dtoComments;
    }

    @Override
    public List<DtoComment> getComplaintsOfUser(String email) {
        DtoCustomer dtoCustomer = userService.getCustomerByEmail(email);
        List<Complaint> complaints = commentRepository.findComplaintsByCustomerId(dtoCustomer.getId());
        List<DtoComment> dtoComments = new ArrayList<>();

        for(Complaint complaint: complaints) {
            DtoComment dtoComment = new DtoComment();
            BeanUtils.copyProperties(complaint, dtoComment);
            dtoComment.setUser(userService.getUserById(complaint.getUser().getId()));
            dtoComments.add(dtoComment);
        }

        return dtoComments;
    }
}
