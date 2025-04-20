package com.pingfloyd.doy.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "restaurant_owner")
@PrimaryKeyJoinColumn(name = "courier_id", referencedColumnName = "user_id")
@Getter
@Setter
public class RestaurantOwner extends User {

}
