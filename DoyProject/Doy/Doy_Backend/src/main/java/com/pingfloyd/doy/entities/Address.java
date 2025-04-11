package com.pingfloyd.doy.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "address")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long address_id;
}
