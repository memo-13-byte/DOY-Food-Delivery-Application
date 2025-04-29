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
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false, orphanRemoval = true)
    @JoinColumn(name = "gid", referencedColumnName = "gid", unique = true)
    private GovernmentId governmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @Column(name = "is_banned")
    private Boolean isBanned = false;
}
