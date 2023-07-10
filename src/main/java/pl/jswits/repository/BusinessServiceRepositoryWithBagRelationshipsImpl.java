package pl.jswits.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import pl.jswits.domain.BusinessService;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class BusinessServiceRepositoryWithBagRelationshipsImpl implements BusinessServiceRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<BusinessService> fetchBagRelationships(Optional<BusinessService> businessService) {
        return businessService.map(this::fetchInternalServices);
    }

    @Override
    public Page<BusinessService> fetchBagRelationships(Page<BusinessService> businessServices) {
        return new PageImpl<>(
            fetchBagRelationships(businessServices.getContent()),
            businessServices.getPageable(),
            businessServices.getTotalElements()
        );
    }

    @Override
    public List<BusinessService> fetchBagRelationships(List<BusinessService> businessServices) {
        return Optional.of(businessServices).map(this::fetchInternalServices).orElse(Collections.emptyList());
    }

    BusinessService fetchInternalServices(BusinessService result) {
        return entityManager
            .createQuery(
                "select businessService from BusinessService businessService left join fetch businessService.internalServices where businessService.id = :id",
                BusinessService.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<BusinessService> fetchInternalServices(List<BusinessService> businessServices) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, businessServices.size()).forEach(index -> order.put(businessServices.get(index).getId(), index));
        List<BusinessService> result = entityManager
            .createQuery(
                "select businessService from BusinessService businessService left join fetch businessService.internalServices where businessService in :businessServices",
                BusinessService.class
            )
            .setParameter("businessServices", businessServices)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
