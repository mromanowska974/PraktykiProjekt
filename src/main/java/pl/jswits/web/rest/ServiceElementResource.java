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
import pl.jswits.domain.ServiceElement;
import pl.jswits.repository.ServiceElementRepository;
import pl.jswits.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link pl.jswits.domain.ServiceElement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ServiceElementResource {

    private final Logger log = LoggerFactory.getLogger(ServiceElementResource.class);

    private static final String ENTITY_NAME = "serviceElement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceElementRepository serviceElementRepository;

    public ServiceElementResource(ServiceElementRepository serviceElementRepository) {
        this.serviceElementRepository = serviceElementRepository;
    }

    /**
     * {@code POST  /service-elements} : Create a new serviceElement.
     *
     * @param serviceElement the serviceElement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new serviceElement, or with status {@code 400 (Bad Request)} if the serviceElement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/service-elements")
    public ResponseEntity<ServiceElement> createServiceElement(@RequestBody ServiceElement serviceElement) throws URISyntaxException {
        log.debug("REST request to save ServiceElement : {}", serviceElement);
        if (serviceElement.getId() != null) {
            throw new BadRequestAlertException("A new serviceElement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ServiceElement result = serviceElementRepository.save(serviceElement);
        return ResponseEntity
            .created(new URI("/api/service-elements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /service-elements/:id} : Updates an existing serviceElement.
     *
     * @param id the id of the serviceElement to save.
     * @param serviceElement the serviceElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceElement,
     * or with status {@code 400 (Bad Request)} if the serviceElement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the serviceElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/service-elements/{id}")
    public ResponseEntity<ServiceElement> updateServiceElement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ServiceElement serviceElement
    ) throws URISyntaxException {
        log.debug("REST request to update ServiceElement : {}, {}", id, serviceElement);
        if (serviceElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ServiceElement result = serviceElementRepository.save(serviceElement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceElement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /service-elements/:id} : Partial updates given fields of an existing serviceElement, field will ignore if it is null
     *
     * @param id the id of the serviceElement to save.
     * @param serviceElement the serviceElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceElement,
     * or with status {@code 400 (Bad Request)} if the serviceElement is not valid,
     * or with status {@code 404 (Not Found)} if the serviceElement is not found,
     * or with status {@code 500 (Internal Server Error)} if the serviceElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/service-elements/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ServiceElement> partialUpdateServiceElement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ServiceElement serviceElement
    ) throws URISyntaxException {
        log.debug("REST request to partial update ServiceElement partially : {}, {}", id, serviceElement);
        if (serviceElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ServiceElement> result = serviceElementRepository
            .findById(serviceElement.getId())
            .map(existingServiceElement -> {
                if (serviceElement.getPrice() != null) {
                    existingServiceElement.setPrice(serviceElement.getPrice());
                }
                if (serviceElement.getDescription() != null) {
                    existingServiceElement.setDescription(serviceElement.getDescription());
                }
                if (serviceElement.getValuationNumber() != null) {
                    existingServiceElement.setValuationNumber(serviceElement.getValuationNumber());
                }
                if (serviceElement.getPaymentType() != null) {
                    existingServiceElement.setPaymentType(serviceElement.getPaymentType());
                }
                if (serviceElement.getStartDate() != null) {
                    existingServiceElement.setStartDate(serviceElement.getStartDate());
                }
                if (serviceElement.getPeriodOfProvisionOfServiceInMonths() != null) {
                    existingServiceElement.setPeriodOfProvisionOfServiceInMonths(serviceElement.getPeriodOfProvisionOfServiceInMonths());
                }
                if (serviceElement.getTypeOfPeriodOfProvisionOfService() != null) {
                    existingServiceElement.setTypeOfPeriodOfProvisionOfService(serviceElement.getTypeOfPeriodOfProvisionOfService());
                }
                if (serviceElement.getEndDate() != null) {
                    existingServiceElement.setEndDate(serviceElement.getEndDate());
                }
                if (serviceElement.getStatus() != null) {
                    existingServiceElement.setStatus(serviceElement.getStatus());
                }

                return existingServiceElement;
            })
            .map(serviceElementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceElement.getId().toString())
        );
    }

    /**
     * {@code GET  /service-elements} : get all the serviceElements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of serviceElements in body.
     */
    @GetMapping("/service-elements")
    public List<ServiceElement> getAllServiceElements() {
        log.debug("REST request to get all ServiceElements");
        return serviceElementRepository.findAll();
    }

    /**
     * {@code GET  /service-elements/:id} : get the "id" serviceElement.
     *
     * @param id the id of the serviceElement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the serviceElement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/service-elements/{id}")
    public ResponseEntity<ServiceElement> getServiceElement(@PathVariable Long id) {
        log.debug("REST request to get ServiceElement : {}", id);
        Optional<ServiceElement> serviceElement = serviceElementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(serviceElement);
    }

    /**
     * {@code DELETE  /service-elements/:id} : delete the "id" serviceElement.
     *
     * @param id the id of the serviceElement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/service-elements/{id}")
    public ResponseEntity<Void> deleteServiceElement(@PathVariable Long id) {
        log.debug("REST request to delete ServiceElement : {}", id);
        serviceElementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
