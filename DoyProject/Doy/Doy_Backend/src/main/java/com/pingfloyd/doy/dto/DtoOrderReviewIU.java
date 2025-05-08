package com.pingfloyd.doy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoOrderReviewIU {
    private int restaurantStarRating;
    private Long restaurantId;
    private DtoCommentIU restaurantComment;
    private int courierStarRating;
    private Long courierId;
    private DtoCommentIU courierComment;
    private Long orderId;
    private Long customerId;
}
