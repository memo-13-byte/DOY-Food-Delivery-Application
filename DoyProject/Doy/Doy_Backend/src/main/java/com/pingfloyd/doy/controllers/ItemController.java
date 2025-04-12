package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoMenuItem;
import com.pingfloyd.doy.dto.DtoMenuItemIU;
import com.pingfloyd.doy.services.IItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/item")
public class ItemController implements IItemController {

    @Autowired
    private IItemService itemService;

    @Override
    @PostMapping("/post")
    public ResponseEntity<DtoMenuItem> postItem(@RequestBody @Valid DtoMenuItemIU item) {
        return ResponseEntity.ok(itemService.postItem(item));
    }

    @Override
    @PutMapping("/update/{id}")
    public ResponseEntity<DtoMenuItem> updateItem(@PathVariable(name = "id")Long itemId, @RequestBody @Valid DtoMenuItemIU item) {
        return ResponseEntity.ok(itemService.updateItem(itemId, item));
    }

    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<DtoMenuItem> deleteItem(@PathVariable("id")Long itemId) {
        return ResponseEntity.ok(itemService.deleteItem(itemId));
    }

    @Override
    @GetMapping("/get/{id}")
    public ResponseEntity<DtoMenuItem> getItem(@PathVariable("id") Long itemId) {
        return ResponseEntity.ok(itemService.getItem(itemId));
    }

    @Override
    @GetMapping("/get-items/{id}")
    public ResponseEntity<List<DtoMenuItem>> getRestaurantItems(@PathVariable("id") Long restaurantId) {
        return ResponseEntity.ok(itemService.getRestaurantItems(restaurantId));
    }
}
