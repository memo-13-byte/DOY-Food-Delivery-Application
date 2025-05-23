package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.enums.Allergens;
import com.pingfloyd.doy.enums.MenuItemType;
import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoMenuItem {
    private Long id;
    private String name;
    private String description;
    private Boolean availability;
    private BigDecimal price;
    private Long restaurantId;
    private MenuItemType menuItemType;
    private List<Allergens> allergens;
    private Long imageId;
}
