package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.entities.DtoItem;
import com.pingfloyd.doy.entities.DtoItemIU;
import com.pingfloyd.doy.services.IItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/item")
public class ItemController implements IItemController {

    @Autowired
    private IItemService itemService;

    @Override
    @PostMapping("/post")
    public DtoItem postItem(@RequestBody DtoItemIU item) {
        return itemService.postItem(item);
    }

    @Override
    @PutMapping("/update/{id}")
    public DtoItem updateItem(@PathVariable(name = "id")int itemId, @RequestBody DtoItemIU item) {
        return itemService.updateItem(itemId, item);
    }


    @Override
    @DeleteMapping("/delete/{id}")
    public DtoItem deleteItem(@PathVariable("id")int itemId) {
        return itemService.deleteItem(itemId);
    }

    @Override
    @GetMapping("/get/{id}")
    public DtoItem getItem(@PathVariable("id") int itemId) {
        return itemService.getItem(itemId);
    }
}
