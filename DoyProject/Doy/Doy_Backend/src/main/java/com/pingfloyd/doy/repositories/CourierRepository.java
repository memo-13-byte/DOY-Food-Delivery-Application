package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Courier;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface CourierRepository extends JpaRepository<Courier, Long> {
    Optional<Courier> findByEmail(String email);

}
