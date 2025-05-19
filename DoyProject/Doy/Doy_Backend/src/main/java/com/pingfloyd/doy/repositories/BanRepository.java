package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Ban;
import com.pingfloyd.doy.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface BanRepository extends JpaRepository<Ban, Long> {

    Optional<Ban> findBanByUser(User user);


}
