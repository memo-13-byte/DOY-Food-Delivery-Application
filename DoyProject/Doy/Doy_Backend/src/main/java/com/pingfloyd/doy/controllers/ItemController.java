package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoMenuItem;
import com.pingfloyd.doy.dto.DtoMenuItemIU;
import com.pingfloyd.doy.entities.UserRoles;
import com.pingfloyd.doy.exception.UnauthorizedRequestException;
import com.pingfloyd.doy.jwt.JwtService;
import com.pingfloyd.doy.services.IItemService;
import com.pingfloyd.doy.services.IRestaurantService;
import com.pingfloyd.doy.services.UserService;
import com.pingfloyd.doy.utils.ImageValidator;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/item")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ItemController implements IItemController {

    private final IItemService itemService;
    private final JwtService jwtService;
    private final IRestaurantService restaurantService;
    private final UserService userService;

    @Autowired
    public ItemController(IItemService itemService, JwtService jwtService, IRestaurantService restaurantService, UserService userService) {
        this.itemService = itemService;
        this.jwtService = jwtService;
        this.restaurantService = restaurantService;
        this.userService = userService;
    }

    @Override
    @PostMapping("/post")
    public ResponseEntity<DtoMenuItem> postItem(@RequestBody @Valid DtoMenuItemIU item) {
        if (jwtService.checkIfUserRole(UserRoles.RESTAURANT_OWNER) &&
                userService.checkIfSameUserFromToken(item.getRestaurantId()))
            return ResponseEntity.ok(itemService.postItem(item));
        throw new UnauthorizedRequestException();

    }

    @Override
    @PutMapping("/update/{id}")
    public ResponseEntity<DtoMenuItem> updateItem(@PathVariable(name = "id")Long itemId, @RequestBody @Valid DtoMenuItemIU item) {
        if (jwtService.checkIfUserRole(UserRoles.RESTAURANT_OWNER) &&
                userService.checkIfSameUserFromToken(item.getRestaurantId()))
            return ResponseEntity.ok(itemService.updateItem(itemId, item));
        throw new UnauthorizedRequestException();

    }

    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<DtoMenuItem> deleteItem(@PathVariable("id")Long itemId) {
        if (jwtService.checkIfUserRole(UserRoles.RESTAURANT_OWNER) &&
            userService.checkIfSameUserFromToken(itemService.getItem(itemId).getRestaurantId()))
            return ResponseEntity.ok(itemService.deleteItem(itemId));
        throw new UnauthorizedRequestException();

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
