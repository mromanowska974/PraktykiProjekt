package pl.jswits.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.jswits.domain.BusinessService;
import pl.jswits.domain.InternalService;
import pl.jswits.repository.BusinessServiceRepository;
import pl.jswits.repository.InternalServiceRepository;
import pl.jswits.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link pl.jswits.domain.BusinessService}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BusinessServiceResource {

    private final Logger log = LoggerFactory.getLogger(BusinessServiceResource.class);

    private static final String ENTITY_NAME = "businessService";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BusinessServiceRepository businessServiceRepository;
    private final InternalServiceRepository internalServiceRepository;

    public BusinessServiceResource(
        BusinessServiceRepository businessServiceRepository,
        InternalServiceRepository internalServiceRepository
    ) {
        this.businessServiceRepository = businessServiceRepository;
        this.internalServiceRepository = internalServiceRepository;
    }

    /**
     * {@code POST  /business-services} : Create a new businessService.
     *
     * @param businessService the businessService to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new businessService, or with status {@code 400 (Bad Request)} if the businessService has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/business-services")
    public ResponseEntity<BusinessService> createBusinessService(@RequestBody BusinessService businessService) throws URISyntaxException {
        log.debug("REST request to save BusinessService : {}", businessService);
        if (businessService.getId() != null) {
            throw new BadRequestAlertException("A new businessService cannot already have an ID", ENTITY_NAME, "idexists");
        }

        for (InternalService internalService : businessService.getInternalServices()) {
            if (internalService.getId() == null) {
                internalServiceRepository.save(internalService);
            }
        }

        BusinessService result = businessServiceRepository.save(businessService);
        return ResponseEntity
            .created(new URI("/api/business-services/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /business-services/:id} : Updates an existing businessService.
     *
     * @param id the id of the businessService to save.
     * @param businessService the businessService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated businessService,
     * or with status {@code 400 (Bad Request)} if the businessService is not valid,
     * or with status {@code 500 (Internal Server Error)} if the businessService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/business-services/{id}")
    public ResponseEntity<BusinessService> updateBusinessService(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BusinessService businessService
    ) throws URISyntaxException {
        log.debug("REST request to update BusinessService : {}, {}", id, businessService);
        if (businessService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, businessService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!businessServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        for (InternalService internalService : businessService.getInternalServices()) {
            if (internalService.getId() == null) {
                internalServiceRepository.save(internalService);
            }
        }

        BusinessService result = businessServiceRepository.save(businessService);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, businessService.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /business-services/:id} : Partial updates given fields of an existing businessService, field will ignore if it is null
     *
     * @param id the id of the businessService to save.
     * @param businessService the businessService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated businessService,
     * or with status {@code 400 (Bad Request)} if the businessService is not valid,
     * or with status {@code 404 (Not Found)} if the businessService is not found,
     * or with status {@code 500 (Internal Server Error)} if the businessService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/business-services/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BusinessService> partialUpdateBusinessService(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BusinessService businessService
    ) throws URISyntaxException {
        log.debug("REST request to partial update BusinessService partially : {}, {}", id, businessService);
        if (businessService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, businessService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!businessServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BusinessService> result = businessServiceRepository
            .findById(businessService.getId())
            .map(existingBusinessService -> {
                if (businessService.getName() != null) {
                    existingBusinessService.setName(businessService.getName());
                }
                if (businessService.getSymbol() != null) {
                    existingBusinessService.setSymbol(businessService.getSymbol());
                }
                if (businessService.getFunctionalDescription() != null) {
                    existingBusinessService.setFunctionalDescription(businessService.getFunctionalDescription());
                }
                if (businessService.getExclusions() != null) {
                    existingBusinessService.setExclusions(businessService.getExclusions());
                }
                if (businessService.getDutiesAndResponsibilities() != null) {
                    existingBusinessService.setDutiesAndResponsibilities(businessService.getDutiesAndResponsibilities());
                }
                if (businessService.getPersonResponsibleForService() != null) {
                    existingBusinessService.setPersonResponsibleForService(businessService.getPersonResponsibleForService());
                }
                if (businessService.getHoursOfService() != null) {
                    existingBusinessService.setHoursOfService(businessService.getHoursOfService());
                }
                if (businessService.getServiceActivatingCost() != null) {
                    existingBusinessService.setServiceActivatingCost(businessService.getServiceActivatingCost());
                }
                if (businessService.getPriceListOfService() != null) {
                    existingBusinessService.setPriceListOfService(businessService.getPriceListOfService());
                }
                if (businessService.getNotes() != null) {
                    existingBusinessService.setNotes(businessService.getNotes());
                }
                if (businessService.getStatus() != null) {
                    existingBusinessService.setStatus(businessService.getStatus());
                }

                return existingBusinessService;
            })
            .map(businessServiceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, businessService.getId().toString())
        );
    }

    /**
     * {@code GET  /business-services} : get all the businessServices.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of businessServices in body.
     */
    @GetMapping("/business-services")
    public List<BusinessService> getAllBusinessServices(@RequestParam(required = false, defaultValue = "true") boolean eagerload) {
        log.debug("REST request to get all BusinessServices");
        List<BusinessService> businessService = new ArrayList<>();
        if (eagerload) {
            businessService = businessServiceRepository.findAllByOrderById();
        } else {
            businessService = businessServiceRepository.findAll();
        }
        return businessService;
    }

    /**
     * {@code GET  /business-services/:id} : get the "id" businessService.
     *
     * @param id the id of the businessService to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the businessService, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/business-services/{id}")
    public ResponseEntity<BusinessService> getBusinessService(@PathVariable Long id) {
        log.debug("REST request to get BusinessService : {}", id);
        Optional<BusinessService> businessService = businessServiceRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(businessService);
    }

    @GetMapping("/business-services/by-client")
    public List<BusinessService> getBusinessServicesByClient(@RequestParam Long clientId) {
        log.debug("REST request to get BusinessServices by Client");
        List<BusinessService> businessService = new ArrayList<>();
        businessService = businessServiceRepository.findBusinessServicesByClient_Id(clientId);
        return businessService;
    }

    @GetMapping("/business-services/by-department")
    public List<BusinessService> getBusinessServicesByDepartment(@RequestParam Long departmentId) {
        log.debug("REST request to get BusinessServices by Department");
        List<BusinessService> businessService = new ArrayList<>();
        businessService = businessServiceRepository.findBusinessServicesByDepartmentId(departmentId);
        return businessService;
    }

    @GetMapping("/business-services/by-employee")
    public List<BusinessService> getBusinessServicesByEmployee(@RequestParam Long employeeId) {
        log.debug("REST request to get BusinessServices by Employee");
        List<BusinessService> businessService = new ArrayList<>();
        businessService = businessServiceRepository.findBusinessServicesByEmployeeId(employeeId);
        return businessService;
    }

    @GetMapping("/business-services/byIS")
    public List<Map<String, String>> getBusinessServicesByInternalService(@RequestParam Long id) {
        log.debug("REST request to get BusinessServices by InternalService");
        List<BusinessService> businessServices = new ArrayList<>();
        businessServices = businessServiceRepository.findBusinessServicesByInternalServiceId(id);

        List<Map<String, String>> maps = new ArrayList<>();
        if (businessServices != null) {
            businessServices.forEach(businessService -> {
                Map<String, String> map = new HashMap<>();
                map.put("name", businessService.getName());
                map.put("symbol", businessService.getSymbol());
                maps.add(map);
            });
        }
        return maps;
    }

    /**
     * {@code DELETE  /business-services/:id} : delete the "id" businessService.
     *
     * @param id the id of the businessService to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/business-services/{id}")
    public ResponseEntity<Void> deleteBusinessService(@PathVariable Long id) {
        log.debug("REST request to delete BusinessService : {}", id);
        businessServiceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
