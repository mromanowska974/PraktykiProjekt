package pl.jswits.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.jswits.domain.BusinessService;
import pl.jswits.domain.Client;

/**
 * Spring Data JPA repository for the BusinessService entity.
 *
 * When extending this class, extend BusinessServiceRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface BusinessServiceRepository extends BusinessServiceRepositoryWithBagRelationships, JpaRepository<BusinessService, Long> {
    default Optional<BusinessService> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<BusinessService> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<BusinessService> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    List<BusinessService> findBusinessServicesByClient_Id(Long id);
}
