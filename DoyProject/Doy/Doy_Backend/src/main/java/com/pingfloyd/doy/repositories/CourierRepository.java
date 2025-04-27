package com.pingfloyd.doy.repositories;
import com.pingfloyd.doy.entities.Courier;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import javax.swing.text.html.Option;
import java.util.Optional;
import com.pingfloyd.doy.entities.District;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.Set;
public interface CourierRepository extends JpaRepository<Courier, Long> {
    Optional<Courier> findByEmail(String email);
    Optional<Courier> findByGovernmentId(String governmentId);

    Set<Courier> findCouriersByDistrict(District district);

    Set<Courier> findCouriersByIsEnabledFalse();
}
