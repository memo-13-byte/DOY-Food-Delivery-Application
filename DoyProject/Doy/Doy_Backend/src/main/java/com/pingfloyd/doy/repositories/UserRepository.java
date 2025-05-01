package com.pingfloyd.doy.repositories;


import com.pingfloyd.doy.entities.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.function.Function;

@Repository
public interface UserRepository extends JpaRepository<User , Long> {

    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Boolean existsByPhoneNumber(String phone);




}
