package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.enums.MenuItemType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoMenuItem {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Long restaurantId;
    private MenuItemType menuItemType;
}
