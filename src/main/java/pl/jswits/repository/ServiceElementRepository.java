package pl.jswits.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import pl.jswits.domain.ServiceElement;
import pl.jswits.domain.enumeration.PaymentType;

/**
 * Spring Data JPA repository for the ServiceElement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceElementRepository extends JpaRepository<ServiceElement, Long> {
    List<ServiceElement> findServiceElementsByBusinessServiceIdAndPaymentType(Long id, PaymentType paymentType);
    List<ServiceElement> findServiceElementsByInternalServiceIdAndPaymentType(Long id, PaymentType paymentType);
}
