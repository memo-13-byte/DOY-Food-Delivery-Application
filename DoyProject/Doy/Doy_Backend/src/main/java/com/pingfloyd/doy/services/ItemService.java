package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.DtoMenuItem;
import com.pingfloyd.doy.dto.DtoMenuItemIU;
import com.pingfloyd.doy.entities.Image;
import com.pingfloyd.doy.entities.MenuItem;
import com.pingfloyd.doy.entities.Restaurant;
import com.pingfloyd.doy.exception.ItemNotFoundException;
import com.pingfloyd.doy.exception.RestaurantNotFoundException;
import com.pingfloyd.doy.repositories.ItemRepository;
import com.pingfloyd.doy.storage.IStorageService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ItemService implements IItemService {

    @Autowired
    ItemRepository itemRepository;

    @Autowired
    RestaurantService restaurantService;

    @Autowired
    IStorageService storageService;

    public MenuItem getItemById(Long id) throws ItemNotFoundException {
        Optional<MenuItem> item = itemRepository.findById(id);
        if (item.isEmpty()) {
            throw new ItemNotFoundException("The requested item was not found.");
        }
        return item.get();
    }

    @Override
    public DtoMenuItem postItem(DtoMenuItemIU dtoMenuItemIU) throws RestaurantNotFoundException {
        MenuItem item = new MenuItem();
        BeanUtils.copyProperties(dtoMenuItemIU, item);

        Restaurant restaurant = restaurantService.findRestaurantById(dtoMenuItemIU.getRestaurantId());


        item.setRestaurant(restaurant);

        MenuItem savedItem = itemRepository.save(item);
        DtoMenuItem dtoMenuItem = new DtoMenuItem();
        BeanUtils.copyProperties(savedItem, dtoMenuItem);
        dtoMenuItem.setRestaurantId(savedItem.getRestaurant().getId());
        dtoMenuItem.setImageId(item.getImage() == null ? null : item.getImage().getId());
        return dtoMenuItem;
    }

    @Override
    public DtoMenuItem updateItem(Long itemId, DtoMenuItemIU dtoMenuItemIU) throws ItemNotFoundException {
        MenuItem item = getItemById(itemId);

        Restaurant restaurant = restaurantService.findRestaurantById(dtoMenuItemIU.getRestaurantId());

        item.setRestaurant(restaurant);

        BeanUtils.copyProperties(dtoMenuItemIU, item);
        MenuItem savedItem = itemRepository.save(item);
        DtoMenuItem dtoMenuItem = new DtoMenuItem();
        BeanUtils.copyProperties(savedItem, dtoMenuItem);
        dtoMenuItem.setRestaurantId(savedItem.getRestaurant().getId());
        dtoMenuItem.setImageId(item.getImage() == null ? null : item.getImage().getId());
        return dtoMenuItem;
    }


    @Override
    public DtoMenuItem deleteItem(Long itemId) throws ItemNotFoundException {
        MenuItem item = getItemById(itemId);
        if (item.getImage() != null) {
            Image image = item.getImage();
            storageService.deleteImage(image);
        }
        itemRepository.delete(item);
        DtoMenuItem dtoMenuItem = new DtoMenuItem();
        BeanUtils.copyProperties(item, dtoMenuItem);
        dtoMenuItem.setRestaurantId(item.getRestaurant().getId());
        dtoMenuItem.setImageId(item.getImage() == null ? null : item.getImage().getId());
        return dtoMenuItem;
    }

    @Override
    public DtoMenuItem getItem(Long itemId) throws ItemNotFoundException {
        MenuItem item = getItemById(itemId);

        DtoMenuItem dtoMenuItem = new DtoMenuItem();
        BeanUtils.copyProperties(item, dtoMenuItem);
        dtoMenuItem.setRestaurantId(item.getRestaurant().getId());
        dtoMenuItem.setImageId(item.getImage() == null ? null : item.getImage().getId());
        return dtoMenuItem;
    }

    @Override
    public List<DtoMenuItem> getRestaurantItems(Long restaurantId) throws ItemNotFoundException {
        List<MenuItem> menuItems = itemRepository.findMenuItemsByRestaurantId(restaurantId);

        if (menuItems == null || menuItems.isEmpty()) {
            throw new ItemNotFoundException("The requested items were not found.");
        }

        List<DtoMenuItem> dtoMenuItems = new ArrayList<>();
        for (MenuItem menuItem : menuItems) {
            DtoMenuItem dtoMenuItem = new DtoMenuItem();
            BeanUtils.copyProperties(menuItem, dtoMenuItem);
            dtoMenuItem.setRestaurantId(restaurantId);
            dtoMenuItem.setImageId(menuItem.getImage() == null ? null : menuItem.getImage().getId());
            dtoMenuItems.add(dtoMenuItem);
        }

        return dtoMenuItems;
    }
}
