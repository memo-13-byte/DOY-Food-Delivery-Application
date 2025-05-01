package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<MenuItem, Long> {
    @Query(value = "select * from menu_item where restaurant_id = ?1" ,nativeQuery = true)
    List<MenuItem> findMenuItemsByRestaurantId(Long id);
}
