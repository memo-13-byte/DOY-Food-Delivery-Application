package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "app_user") //email için index?
@Inheritance(strategy = InheritanceType.JOINED)
@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
public abstract class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @NotNull
    @Column(name = "first_name", length = 50, nullable = false)
    private String firstname;

    @NotNull
    @Column(name = "last_Name", length = 50, nullable = false)
    private String lastname;

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

    @Column(name = "is_enabled" , nullable = false)
    private Boolean isEnabled = false;

    @Column(name = "role", nullable = false)
    private UserRoles role;


    public User() {
        setCreatedAt(LocalDateTime.now());
    }

    protected User(String firstname,String lastname, String email, String passwordHash) {
        this();
        setFirstname(firstname);
        setLastname(lastname);
        setEmail(email);
        setPasswordHash(passwordHash);
    }

    protected User(String firstname,String lastname, String email, String passwordHash, String phoneNumber) {
        this(firstname,lastname, email, passwordHash);
        setPhoneNumber(phoneNumber);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.value));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isEnabled() {
        return isEnabled;
    }
}