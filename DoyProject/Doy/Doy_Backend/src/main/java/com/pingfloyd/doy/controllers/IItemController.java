package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.entities.DtoItem;
import com.pingfloyd.doy.entities.DtoItemIU;

public interface IItemController {
    DtoItem postItem(DtoItemIU item);
    DtoItem updateItem(int itemId, DtoItemIU item);
    DtoItem deleteItem(int itemId);
    DtoItem getItem(int itemId);
}
