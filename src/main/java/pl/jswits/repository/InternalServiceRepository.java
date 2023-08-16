package pl.jswits.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import pl.jswits.domain.BusinessService;
import pl.jswits.domain.InternalService;

/**
 * Spring Data JPA repository for the InternalService entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InternalServiceRepository extends JpaRepository<InternalService, Long> {
    List<InternalService> findInternalServicesByBusinessServices(BusinessService businessService);
    List<InternalService> findInternalServicesByEmployeeId(Long id);
}
