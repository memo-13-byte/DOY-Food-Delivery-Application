package com.pingfloyd.doy.services;

import com.pingfloyd.doy.entities.DtoMenuItem;
import com.pingfloyd.doy.entities.DtoMenuItemIU;
import com.pingfloyd.doy.entities.MenuItem;
import com.pingfloyd.doy.entities.Restaurant;
import com.pingfloyd.doy.repositories.ItemRepository;
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

    private MenuItem getItemById(Long id) {
        Optional<MenuItem> item = itemRepository.findById(id);
        return item.orElse(null);
    }

    @Override
    public DtoMenuItem postItem(DtoMenuItemIU dtoMenuItemIU) {
        MenuItem item = new MenuItem();
        BeanUtils.copyProperties(dtoMenuItemIU, item);

        Restaurant restaurant = restaurantService.findRestaurantById(dtoMenuItemIU.getRestaurantId());
        if (restaurant == null) {
            return null;
        }

        item.setRestaurant(restaurant);

        MenuItem savedItem = itemRepository.save(item);
        DtoMenuItem dtoMenuItem = new DtoMenuItem();
        BeanUtils.copyProperties(savedItem, dtoMenuItem);
        dtoMenuItem.setRestaurantId(savedItem.getRestaurant().getId());

        return dtoMenuItem;
    }

    @Override
    public DtoMenuItem updateItem(Long itemId, DtoMenuItemIU dtoMenuItemIU) {
        MenuItem item = getItemById(itemId);
        if (item == null) {
            return null;
        }

        Restaurant restaurant = restaurantService.findRestaurantById(dtoMenuItemIU.getRestaurantId());
        if (restaurant == null) {
            return null;
        }

        item.setRestaurant(restaurant);

        BeanUtils.copyProperties(dtoMenuItemIU, item);
        MenuItem savedItem = itemRepository.save(item);
        DtoMenuItem dtoMenuItem = new DtoMenuItem();
        BeanUtils.copyProperties(savedItem, dtoMenuItem);

        return dtoMenuItem;
    }

    @Override
    public DtoMenuItem deleteItem(Long itemId) {
        MenuItem item = getItemById(itemId);
        if (item == null) {
            return null;
        }

        itemRepository.delete(item);
        DtoMenuItem dtoMenuItem = new DtoMenuItem();
        BeanUtils.copyProperties(item, dtoMenuItem);

        return dtoMenuItem;
    }

    @Override
    public DtoMenuItem getItem(Long itemId) {
        MenuItem item = getItemById(itemId);
        if (item == null) {
            return null;
        }
        DtoMenuItem dtoMenuItem = new DtoMenuItem();
        BeanUtils.copyProperties(item, dtoMenuItem);

        return dtoMenuItem;
    }

    @Override
    public List<DtoMenuItem> getRestaurantItems(Long restaurantId) {
        List<MenuItem> menuItems = itemRepository.findMenuItemsByRestaurantId(restaurantId);

        if (menuItems == null) {
            return null;
        }

        List<DtoMenuItem> dtoMenuItems = new ArrayList<>();
        for (MenuItem menuItem : menuItems) {
            DtoMenuItem dtoMenuItem = new DtoMenuItem();
            BeanUtils.copyProperties(menuItem, dtoMenuItem);

            dtoMenuItems.add(dtoMenuItem);
        }

        return dtoMenuItems;
    }
}
