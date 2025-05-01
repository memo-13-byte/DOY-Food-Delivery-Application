package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "admin")
@PrimaryKeyJoinColumn(name = "admin_id", referencedColumnName = "user_id")
@Getter
@Setter
public class Admin extends User{
}
