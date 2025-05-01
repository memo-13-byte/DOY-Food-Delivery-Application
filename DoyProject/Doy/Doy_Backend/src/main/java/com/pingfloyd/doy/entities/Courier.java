package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "courier")
@PrimaryKeyJoinColumn(name = "courier_id", referencedColumnName = "user_id")
@Getter
@Setter
public class Courier extends User {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    private String governmentId;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @Column(name = "is_banned")
    private Boolean isBanned = false;

    private Boolean isOnDelivery = false;

    public Courier(String firstName, String lastName, String email, String passwordHash, String phoneNumber) {
        super(firstName, lastName, email, passwordHash, phoneNumber);
    }

    public Courier() {

    }



}
