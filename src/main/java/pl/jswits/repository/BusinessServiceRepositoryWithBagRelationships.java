package pl.jswits.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import pl.jswits.domain.BusinessService;

public interface BusinessServiceRepositoryWithBagRelationships {
    Optional<BusinessService> fetchBagRelationships(Optional<BusinessService> businessService);

    List<BusinessService> fetchBagRelationships(List<BusinessService> businessServices);

    Page<BusinessService> fetchBagRelationships(Page<BusinessService> businessServices);
}
