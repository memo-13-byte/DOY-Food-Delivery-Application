package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.DtoMenuItem;
import com.pingfloyd.doy.dto.DtoMenuItemIU;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IItemService {
    DtoMenuItem postItem(DtoMenuItemIU dtoMenuItemIU);
    DtoMenuItem updateItem(Long itemId, DtoMenuItemIU item);
    DtoMenuItem deleteItem(Long itemId);
    DtoMenuItem getItem(Long itemId);
    List<DtoMenuItem> getRestaurantItems(Long restaurantId);
}
