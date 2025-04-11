package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoMenuItem;
import com.pingfloyd.doy.dto.DtoMenuItemIU;

import java.util.List;

public interface IItemController {
    DtoMenuItem postItem(DtoMenuItemIU item);
    DtoMenuItem updateItem(Long itemId, DtoMenuItemIU item);
    DtoMenuItem deleteItem(Long itemId);
    DtoMenuItem getItem(Long itemId);
    List<DtoMenuItem> getRestaurantItems(Long restaurantId);
}
