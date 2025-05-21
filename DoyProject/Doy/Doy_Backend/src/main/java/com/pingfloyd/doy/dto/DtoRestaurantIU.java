package com.pingfloyd.doy.dto;

import java.time.LocalTime;
import com.pingfloyd.doy.enums.RestaurantCategory;
// Import necessary validation annotations
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoRestaurantIU {

    @NotBlank(message = "Restaurant name must not be empty or blank.")
    @Size(min = 2, max = 100, message = "Restaurant name must be between 2 and 100 characters.")
    private String restaurantName;

    private String description;

    @NotBlank(message = "Restaurant phone number must not be empty.")
    @Size(min = 7, max = 20, message = "Phone number must be between 7 and 20 characters.")
    private String restaurantPhone;

    @NotNull(message = "Restaurant category must be selected.")
    private RestaurantCategory restaurantCategory;

    @Min(value = 0, message = "Rating must be at least 0.")
    @Max(value = 5, message = "Rating must be at most 5.")
    private Double rating;

    @Min(value = 0, message = "Minimum order price cannot be negative.")
    private Integer minOrderPrice;

    private Long imageId;

    @NotNull(message = "Opening hour must be specified.")
    private LocalTime openingHour;

    @NotNull(message = "Closing hour must be specified.")
    private LocalTime closingHour;
}
