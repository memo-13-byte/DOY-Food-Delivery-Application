package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;

@Entity
@Table(name = "app_user")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public abstract class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @NotNull
    @Column(name = "user_name", length = 50, nullable = false)
    private String username;

    @NotNull
    @Column(name = "email", length = 100, nullable = false)
    private String email;

    @NotNull
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;


    public User() {
        setCreatedAt(LocalDateTime.now());
    }

    protected User(String username, String email, String passwordHash) {
        this();
        setUsername(username);
        setEmail(email);
        setPasswordHash(passwordHash);
    }

    protected User(String username, String email, String passwordHash, String phoneNumber) {
        this(username, email, passwordHash);
        setPhoneNumber(phoneNumber);
    }
}