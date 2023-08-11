package pl.jswits.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import pl.jswits.domain.Product;
import pl.jswits.domain.enumeration.ProductType;

/**
 * Spring Data JPA repository for the Product entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findProductsByInternalServiceIdAndType(Long id, ProductType productType);
}
