package com.pingfloyd.doy.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoRestaurantIU {
    private String name;
    private String description;
    private Image image;

    private List<DtoItemIU> addedItems;
    private List<Integer> removedItemIds;
}
