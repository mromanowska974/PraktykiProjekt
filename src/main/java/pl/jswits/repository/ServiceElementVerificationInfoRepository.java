package pl.jswits.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import pl.jswits.domain.ServiceElementVerificationInfo;

/**
 * Spring Data JPA repository for the ServiceElementVerificationInfo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceElementVerificationInfoRepository extends JpaRepository<ServiceElementVerificationInfo, Long> {}
