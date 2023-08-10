package pl.jswits.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import pl.jswits.domain.ExternalCompany;

/**
 * Spring Data JPA repository for the ExternalCompany entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExternalCompanyRepository extends JpaRepository<ExternalCompany, Long> {
    List<ExternalCompany> findExternalCompaniesByInternalServiceId(Long id);
}
