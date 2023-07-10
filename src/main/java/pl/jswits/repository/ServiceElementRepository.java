package pl.jswits.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import pl.jswits.domain.ServiceElement;

/**
 * Spring Data JPA repository for the ServiceElement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceElementRepository extends JpaRepository<ServiceElement, Long> {}
