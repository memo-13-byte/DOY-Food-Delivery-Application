package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoMenuItem;
import com.pingfloyd.doy.dto.DtoMenuItemIU;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IItemController {
    ResponseEntity<DtoMenuItem> postItem(DtoMenuItemIU item);
    ResponseEntity<DtoMenuItem> updateItem(Long itemId, DtoMenuItemIU item);
    ResponseEntity<DtoMenuItem> deleteItem(Long itemId);
    ResponseEntity<DtoMenuItem> getItem(Long itemId);
    ResponseEntity<List<DtoMenuItem>> getRestaurantItems(Long restaurantId);
}
