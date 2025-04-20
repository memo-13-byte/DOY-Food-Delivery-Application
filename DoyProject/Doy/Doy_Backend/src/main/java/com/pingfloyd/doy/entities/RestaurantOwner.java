package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "restaurant_owner")
@PrimaryKeyJoinColumn(name = "owner_id", referencedColumnName = "user_id")
@Getter
@Setter
public class RestaurantOwner extends User {
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false, orphanRemoval = true)
    @JoinColumn(name = "gid", referencedColumnName = "gid", unique = true)
    private GovernmentId governmentId;

    @OneToOne(mappedBy = "restaurant_owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Restaurant restaurant;
}
