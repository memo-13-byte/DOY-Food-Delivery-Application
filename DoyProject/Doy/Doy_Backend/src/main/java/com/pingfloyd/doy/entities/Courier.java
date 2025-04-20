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

    @Column(name = "is_available")
    private Boolean isAvailable;
}
