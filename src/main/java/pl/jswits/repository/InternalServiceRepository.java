package pl.jswits.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import pl.jswits.domain.InternalService;

/**
 * Spring Data JPA repository for the InternalService entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InternalServiceRepository extends JpaRepository<InternalService, Long> {}
