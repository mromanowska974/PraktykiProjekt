package pl.jswits.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import pl.jswits.domain.Parameter;
import pl.jswits.domain.enumeration.ParameterType;

/**
 * Spring Data JPA repository for the Parameter entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParameterRepository extends JpaRepository<Parameter, Long> {
    List<Parameter> findParametersByBusinessServiceIdAndType(Long id, ParameterType parameterType);
}
