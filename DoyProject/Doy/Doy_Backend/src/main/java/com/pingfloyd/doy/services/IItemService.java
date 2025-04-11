package com.pingfloyd.doy.services;

import com.pingfloyd.doy.entities.DtoItem;
import com.pingfloyd.doy.entities.DtoItemIU;
import com.pingfloyd.doy.entities.Item;
import org.springframework.web.multipart.MultipartFile;

public interface IItemService {
    DtoItem postItem(DtoItemIU dtoItemIU);
    DtoItem updateItem(int itemId, DtoItemIU item);
    DtoItem deleteItem(int itemId);
    DtoItem getItem(int itemId);
}
