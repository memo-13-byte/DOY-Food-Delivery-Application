package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.enums.MenuItemType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoMenuItemIU {

    @NotEmpty(message = "Item name must not be empty.")
    @Size(max = 100, message = "Item name must not exceed 100 characters.")
    private String name;

    private String description;
    /*
    @NotEmpty(message = "Item category must not be empty.")
    @Size(max = 50, message = "Item category must not exceed 50 characters.")
    */

    private MenuItemType menuItemType;

    @NotNull(message = "Item price must not be null.")
    @Positive(message = "Item price must be greater than zero")
    @Digits(integer = 10, fraction = 2, message = "Item price must not exceed 10 digits.")
    private BigDecimal price;

    @NotNull(message = "Restaurant ID must not be null")
    @PositiveOrZero(message = "Restaurant ID must not be negative")
    private Long restaurantId;
}
