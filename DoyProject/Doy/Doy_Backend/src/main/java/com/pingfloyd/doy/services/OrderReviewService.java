package com.pingfloyd.doy.services;
import com.pingfloyd.doy.dto.DtoComment;
import com.pingfloyd.doy.dto.DtoOrderReview;
import com.pingfloyd.doy.dto.DtoOrderReviewIU;
import com.pingfloyd.doy.entities.*;
import com.pingfloyd.doy.repositories.*;
import org.hibernate.query.Order;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderReviewService implements IOrderReviewService{

    private final OrderReviewRepository orderReviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final CourierRepository courierRepository;
    private final ICommentService commentService;
    private final CommentRepository commentRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final IUserService userService;

    @Autowired
    public OrderReviewService(OrderReviewRepository orderReviewRepository, RestaurantRepository restaurantRepository,
                              CourierRepository courierRepository, ICommentService commentService,
                              CommentRepository commentRepository, CustomerOrderRepository customerOrderRepository,
                              CustomerRepository customerRepository, UserRepository userRepository,
                              IUserService userService) {
        this.orderReviewRepository = orderReviewRepository;
        this.restaurantRepository = restaurantRepository;
        this.courierRepository = courierRepository;
        this.commentService = commentService;
        this.commentRepository = commentRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Override
    public DtoOrderReview postOrderReview(DtoOrderReviewIU dtoOrderReviewIU) {
//edge case: if restaurant no longer exists and user wants to review order
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(dtoOrderReviewIU.getRestaurantId());
        Optional<Courier> optionalCourier = courierRepository.findById(dtoOrderReviewIU.getCourierId());
        Optional<CustomerOrder> optionalCustomerOrder = customerOrderRepository.findById(dtoOrderReviewIU.getOrderId());
        Optional<Customer> optionalCustomer = customerRepository.findById(dtoOrderReviewIU.getCustomerId());

        OrderReview orderReview = new OrderReview();
        BeanUtils.copyProperties(dtoOrderReviewIU, orderReview);

        if (optionalRestaurant.isPresent()) {
            Restaurant restaurant = optionalRestaurant.get();
            Double newRating = (restaurant.getRating() * restaurant.getRatingCount() + orderReview.getRestaurantStarRating())
                    / (restaurant.getRatingCount()+1);
            restaurant.setRating(newRating);
            restaurant.setRatingCount(restaurant.getRatingCount() + 1);
            orderReview.setRestaurant(restaurant);
        }

        if (optionalCourier.isPresent()) {
            Courier courier = optionalCourier.get();
            Double newRating = (courier.getRating() * courier.getRatingCount() + orderReview.getCourierStarRating())
                    / (courier.getRatingCount()+1);
            courier.setRating(newRating);
            courier.setRatingCount(courier.getRatingCount() + 1);
            orderReview.setCourier(courier);
        }


        orderReview.setOrder(optionalCustomerOrder.get());
        orderReview.setCustomer(optionalCustomer.get());

        orderReview.setCreatedAt(LocalDateTime.now());

        DtoComment dtoRestaurantComment = commentService.postComment(dtoOrderReviewIU.getRestaurantComment());
        Comment restaurantComment = commentRepository.findById(dtoRestaurantComment.getId()).get();
        orderReview.setRestaurantComment(restaurantComment);

        DtoComment dtoCourierComment = commentService.postComment(dtoOrderReviewIU.getCourierComment());
        Comment courierComment = commentRepository.findById(dtoCourierComment.getId()).get();
        orderReview.setCourierComment(courierComment);

        OrderReview savedOrderReview = orderReviewRepository.save(orderReview);

        DtoOrderReview dtoOrderReview = new DtoOrderReview();
        BeanUtils.copyProperties(savedOrderReview, dtoOrderReview);
        dtoOrderReview.setCourierComment(dtoCourierComment);
        dtoOrderReview.setRestaurantComment(dtoRestaurantComment);


        return dtoOrderReview;
    }

    @Override
    public DtoOrderReview getOrderReview(Long orderId) {
        Optional<OrderReview> optionalOrderReview = orderReviewRepository.findByOrderId(orderId);
        if (optionalOrderReview.isEmpty()) {
            return null;
        }

        OrderReview orderReview = optionalOrderReview.get();
        DtoOrderReview dtoOrderReview = new DtoOrderReview();
        BeanUtils.copyProperties(orderReview, dtoOrderReview);

        DtoComment courierComment = new DtoComment();
        DtoComment restaurantComment = new DtoComment();

        BeanUtils.copyProperties(orderReview.getRestaurantComment(), restaurantComment);
        BeanUtils.copyProperties(orderReview.getCourierComment(), courierComment);

        restaurantComment.setUser(userService.getUserById(orderReview.getCustomer().getId()));
        courierComment.setUser(userService.getUserById(orderReview.getCustomer().getId()));

        dtoOrderReview.setRestaurantComment(restaurantComment);
        dtoOrderReview.setCourierComment(courierComment);
        return dtoOrderReview;
    }

}
