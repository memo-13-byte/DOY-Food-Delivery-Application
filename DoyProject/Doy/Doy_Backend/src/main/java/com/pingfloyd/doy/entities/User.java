package com.pingfloyd.doy.entities;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "user")
@Getter
@Setter
@RequiredArgsConstructor

public class User {
    @Id
    @Column
    private Long userId;

    @Column
    @NotNull
    private String userName;

    @Column
    @NotNull
    private String email;

    @Column
    @NotNull
    private String passwordHash;

    @Column
    @Nullable
    private String phoneNumber;

    @Column
    @NotNull
    private Date createdAt;
}
