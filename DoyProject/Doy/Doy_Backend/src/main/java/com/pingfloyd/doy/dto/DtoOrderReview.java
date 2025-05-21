package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.Comment;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DtoOrderReview {
    private Long id;
    private int restaurantStarRating;
    private DtoComment restaurantComment;
    private int courierStarRating;
    private DtoComment courierComment;
    private LocalDateTime createdAt;
}
