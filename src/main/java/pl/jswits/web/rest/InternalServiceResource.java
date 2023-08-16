package pl.jswits.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.jswits.domain.BusinessService;
import pl.jswits.domain.InternalService;
import pl.jswits.repository.InternalServiceRepository;
import pl.jswits.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link pl.jswits.domain.InternalService}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InternalServiceResource {

    private final Logger log = LoggerFactory.getLogger(InternalServiceResource.class);

    private static final String ENTITY_NAME = "internalService";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InternalServiceRepository internalServiceRepository;

    public InternalServiceResource(InternalServiceRepository internalServiceRepository) {
        this.internalServiceRepository = internalServiceRepository;
    }

    /**
     * {@code POST  /internal-services} : Create a new internalService.
     *
     * @param internalService the internalService to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new internalService, or with status {@code 400 (Bad Request)} if the internalService has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/internal-services")
    public ResponseEntity<InternalService> createInternalService(@RequestBody InternalService internalService) throws URISyntaxException {
        log.debug("REST request to save InternalService : {}", internalService);
        if (internalService.getId() != null) {
            throw new BadRequestAlertException("A new internalService cannot already have an ID", ENTITY_NAME, "idexists");
        }
        InternalService result = internalServiceRepository.save(internalService);
        return ResponseEntity
            .created(new URI("/api/internal-services/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /internal-services/:id} : Updates an existing internalService.
     *
     * @param id the id of the internalService to save.
     * @param internalService the internalService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated internalService,
     * or with status {@code 400 (Bad Request)} if the internalService is not valid,
     * or with status {@code 500 (Internal Server Error)} if the internalService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/internal-services/{id}")
    public ResponseEntity<InternalService> updateInternalService(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InternalService internalService
    ) throws URISyntaxException {
        log.debug("REST request to update InternalService : {}, {}", id, internalService);
        if (internalService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, internalService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!internalServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        InternalService result = internalServiceRepository.save(internalService);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, internalService.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /internal-services/:id} : Partial updates given fields of an existing internalService, field will ignore if it is null
     *
     * @param id the id of the internalService to save.
     * @param internalService the internalService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated internalService,
     * or with status {@code 400 (Bad Request)} if the internalService is not valid,
     * or with status {@code 404 (Not Found)} if the internalService is not found,
     * or with status {@code 500 (Internal Server Error)} if the internalService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/internal-services/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<InternalService> partialUpdateInternalService(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InternalService internalService
    ) throws URISyntaxException {
        log.debug("REST request to partial update InternalService partially : {}, {}", id, internalService);
        if (internalService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, internalService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!internalServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<InternalService> result = internalServiceRepository
            .findById(internalService.getId())
            .map(existingInternalService -> {
                if (internalService.getName() != null) {
                    existingInternalService.setName(internalService.getName());
                }
                if (internalService.getSymbol() != null) {
                    existingInternalService.setSymbol(internalService.getSymbol());
                }
                if (internalService.getFunctionalDescription() != null) {
                    existingInternalService.setFunctionalDescription(internalService.getFunctionalDescription());
                }
                if (internalService.getServiceComissions() != null) {
                    existingInternalService.setServiceComissions(internalService.getServiceComissions());
                }
                if (internalService.getExclusions() != null) {
                    existingInternalService.setExclusions(internalService.getExclusions());
                }
                if (internalService.getDutiesAndResponsibilities() != null) {
                    existingInternalService.setDutiesAndResponsibilities(internalService.getDutiesAndResponsibilities());
                }
                if (internalService.getPersonResponsibleForService() != null) {
                    existingInternalService.setPersonResponsibleForService(internalService.getPersonResponsibleForService());
                }
                if (internalService.getHoursOfService() != null) {
                    existingInternalService.setHoursOfService(internalService.getHoursOfService());
                }
                if (internalService.getServiceActivatingCost() != null) {
                    existingInternalService.setServiceActivatingCost(internalService.getServiceActivatingCost());
                }
                if (internalService.getPriceListOfService() != null) {
                    existingInternalService.setPriceListOfService(internalService.getPriceListOfService());
                }
                if (internalService.getNotes() != null) {
                    existingInternalService.setNotes(internalService.getNotes());
                }
                if (internalService.getStatus() != null) {
                    existingInternalService.setStatus(internalService.getStatus());
                }
                if (internalService.getCriticalService() != null) {
                    existingInternalService.setCriticalService(internalService.getCriticalService());
                }
                if (internalService.getGuaranteedLevelsOfProvisionOfService() != null) {
                    existingInternalService.setGuaranteedLevelsOfProvisionOfService(
                        internalService.getGuaranteedLevelsOfProvisionOfService()
                    );
                }
                if (internalService.getPeriodOfProvisionOfService() != null) {
                    existingInternalService.setPeriodOfProvisionOfService(internalService.getPeriodOfProvisionOfService());
                }
                if (internalService.getWindowOfService() != null) {
                    existingInternalService.setWindowOfService(internalService.getWindowOfService());
                }
                if (internalService.getLevelOfAccessibility() != null) {
                    existingInternalService.setLevelOfAccessibility(internalService.getLevelOfAccessibility());
                }
                if (internalService.getPlanDisasterRecovery() != null) {
                    existingInternalService.setPlanDisasterRecovery(internalService.getPlanDisasterRecovery());
                }
                if (internalService.getrPO() != null) {
                    existingInternalService.setrPO(internalService.getrPO());
                }
                if (internalService.getrTO() != null) {
                    existingInternalService.setrTO(internalService.getrTO());
                }

                return existingInternalService;
            })
            .map(internalServiceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, internalService.getId().toString())
        );
    }

    /**
     * {@code GET  /internal-services} : get all the internalServices.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of internalServices in body.
     */
    @GetMapping("/internal-services")
    public List<InternalService> getAllInternalServices() {
        log.debug("REST request to get all InternalServices");
        return internalServiceRepository.findAll();
    }

    /**
     * {@code GET  /internal-services/:id} : get the "id" internalService.
     *
     * @param id the id of the internalService to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the internalService, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/internal-services/{id}")
    public ResponseEntity<InternalService> getInternalService(@PathVariable Long id) {
        log.debug("REST request to get InternalService : {}", id);
        Optional<InternalService> internalService = internalServiceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(internalService);
    }

    @GetMapping("/internal-services/byBS")
    public List<InternalService> getInternalServicesByBusinessService(@RequestBody BusinessService businessService) {
        return internalServiceRepository.findInternalServicesByBusinessServices(businessService);
    }

    @GetMapping("/internal-services/by-employee")
    public List<InternalService> getInternalServicesByEmployee(@RequestParam Long employeeId) {
        return internalServiceRepository.findInternalServicesByEmployeeId(employeeId);
    }

    /**
     * {@code DELETE  /internal-services/:id} : delete the "id" internalService.
     *
     * @param id the id of the internalService to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/internal-services/{id}")
    public ResponseEntity<Void> deleteInternalService(@PathVariable Long id) {
        log.debug("REST request to delete InternalService : {}", id);
        internalServiceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
