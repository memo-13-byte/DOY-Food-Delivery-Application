package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courier")
@PrimaryKeyJoinColumn(name = "courier_id", referencedColumnName = "user_id")
@Getter
@Setter
public class Courier extends User {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @OneToMany(
            mappedBy = "courier",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true
    )
    private Set<CustomerOrder> customerOrders = new HashSet<>();

    private String governmentId;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @Column(name = "is_banned")
    private Boolean isBanned = false;

    public Courier(String firstName, String lastName, String email, String passwordHash, String phoneNumber) {
        super(firstName, lastName, email, passwordHash, phoneNumber);
    }

    public Courier() {

    }



}
