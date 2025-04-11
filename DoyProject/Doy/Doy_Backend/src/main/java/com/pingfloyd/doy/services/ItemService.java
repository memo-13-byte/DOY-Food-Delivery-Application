package com.pingfloyd.doy.services;

import com.pingfloyd.doy.entities.DtoItem;
import com.pingfloyd.doy.entities.DtoItemIU;
import com.pingfloyd.doy.entities.Item;
import com.pingfloyd.doy.repositories.ItemRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ItemService implements IItemService {

    @Autowired
    ItemRepository itemRepository;

    private Item getItemById(int id) {
        Optional<Item> item = itemRepository.findById(id);
        return item.orElse(null);
    }

    @Override
    public DtoItem postItem(DtoItemIU dtoItemIU) {
        Item item = new Item();
        BeanUtils.copyProperties(dtoItemIU, item);

        Item savedItem = itemRepository.save(item);
        DtoItem dtoItem = new DtoItem();
        BeanUtils.copyProperties(savedItem, dtoItem);

        return dtoItem;
    }

    @Override
    public DtoItem updateItem(int itemId, DtoItemIU dtoItemIU) {
        Item item = getItemById(itemId);
        if (item == null) {
            return null;
        }

        BeanUtils.copyProperties(dtoItemIU, item);
        Item savedItem = itemRepository.save(item);
        DtoItem dtoItem = new DtoItem();
        BeanUtils.copyProperties(savedItem, dtoItem);

        return dtoItem;
    }

    @Override
    public DtoItem deleteItem(int itemId) {
        Item item = getItemById(itemId);
        if (item == null) {
            return null;
        }

        itemRepository.delete(item);
        DtoItem dtoItem = new DtoItem();
        BeanUtils.copyProperties(item, dtoItem);

        return dtoItem;
    }

    @Override
    public DtoItem getItem(int itemId) {
        Item item = getItemById(itemId);
        if (item == null) {
            return null;
        }
        DtoItem dtoItem = new DtoItem();
        BeanUtils.copyProperties(item, dtoItem);

        return dtoItem;
    }
}
