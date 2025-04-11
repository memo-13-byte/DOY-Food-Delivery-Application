package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoMenuItem;
import com.pingfloyd.doy.dto.DtoMenuItemIU;
import com.pingfloyd.doy.services.IItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/item")
public class ItemController implements IItemController {

    @Autowired
    private IItemService itemService;

    @Override
    @PostMapping("/post")
    public DtoMenuItem postItem(@RequestBody DtoMenuItemIU item) {
        return itemService.postItem(item);
    }

    @Override
    @PutMapping("/update/{id}")
    public DtoMenuItem updateItem(@PathVariable(name = "id")Long itemId, @RequestBody DtoMenuItemIU item) {
        return itemService.updateItem(itemId, item);
    }

    @Override
    @DeleteMapping("/delete/{id}")
    public DtoMenuItem deleteItem(@PathVariable("id")Long itemId) {
        return itemService.deleteItem(itemId);
    }

    @Override
    @GetMapping("/get/{id}")
    public DtoMenuItem getItem(@PathVariable("id") Long itemId) {
        return itemService.getItem(itemId);
    }

    @Override
    @GetMapping("/get-items/{id}")
    public List<DtoMenuItem> getRestaurantItems(@PathVariable("id") Long restaurantId) {
        return itemService.getRestaurantItems(restaurantId);
    }
}
