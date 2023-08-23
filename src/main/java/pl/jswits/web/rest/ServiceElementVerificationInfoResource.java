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
import pl.jswits.domain.ServiceElementVerificationInfo;
import pl.jswits.repository.ServiceElementVerificationInfoRepository;
import pl.jswits.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link pl.jswits.domain.ServiceElementVerificationInfo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ServiceElementVerificationInfoResource {

    private final Logger log = LoggerFactory.getLogger(ServiceElementVerificationInfoResource.class);

    private static final String ENTITY_NAME = "serviceElementVerificationInfo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceElementVerificationInfoRepository serviceElementVerificationInfoRepository;

    public ServiceElementVerificationInfoResource(ServiceElementVerificationInfoRepository serviceElementVerificationInfoRepository) {
        this.serviceElementVerificationInfoRepository = serviceElementVerificationInfoRepository;
    }

    /**
     * {@code POST  /service-element-verification-infos} : Create a new serviceElementVerificationInfo.
     *
     * @param serviceElementVerificationInfo the serviceElementVerificationInfo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new serviceElementVerificationInfo, or with status {@code 400 (Bad Request)} if the serviceElementVerificationInfo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/service-element-verification-infos")
    public ResponseEntity<ServiceElementVerificationInfo> createServiceElementVerificationInfo(
        @RequestBody ServiceElementVerificationInfo serviceElementVerificationInfo
    ) throws URISyntaxException {
        log.debug("REST request to save ServiceElementVerificationInfo : {}", serviceElementVerificationInfo);
        if (serviceElementVerificationInfo.getId() != null) {
            throw new BadRequestAlertException("A new serviceElementVerificationInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ServiceElementVerificationInfo result = serviceElementVerificationInfoRepository.save(serviceElementVerificationInfo);
        return ResponseEntity
            .created(new URI("/api/service-element-verification-infos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /service-element-verification-infos/:id} : Updates an existing serviceElementVerificationInfo.
     *
     * @param id the id of the serviceElementVerificationInfo to save.
     * @param serviceElementVerificationInfo the serviceElementVerificationInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceElementVerificationInfo,
     * or with status {@code 400 (Bad Request)} if the serviceElementVerificationInfo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the serviceElementVerificationInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/service-element-verification-infos/{id}")
    public ResponseEntity<ServiceElementVerificationInfo> updateServiceElementVerificationInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ServiceElementVerificationInfo serviceElementVerificationInfo
    ) throws URISyntaxException {
        log.debug("REST request to update ServiceElementVerificationInfo : {}, {}", id, serviceElementVerificationInfo);
        if (serviceElementVerificationInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceElementVerificationInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceElementVerificationInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ServiceElementVerificationInfo result = serviceElementVerificationInfoRepository.save(serviceElementVerificationInfo);
        return ResponseEntity
            .ok()
            .headers(
                HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceElementVerificationInfo.getId().toString())
            )
            .body(result);
    }

    /**
     * {@code PATCH  /service-element-verification-infos/:id} : Partial updates given fields of an existing serviceElementVerificationInfo, field will ignore if it is null
     *
     * @param id the id of the serviceElementVerificationInfo to save.
     * @param serviceElementVerificationInfo the serviceElementVerificationInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceElementVerificationInfo,
     * or with status {@code 400 (Bad Request)} if the serviceElementVerificationInfo is not valid,
     * or with status {@code 404 (Not Found)} if the serviceElementVerificationInfo is not found,
     * or with status {@code 500 (Internal Server Error)} if the serviceElementVerificationInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/service-element-verification-infos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ServiceElementVerificationInfo> partialUpdateServiceElementVerificationInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ServiceElementVerificationInfo serviceElementVerificationInfo
    ) throws URISyntaxException {
        log.debug("REST request to partial update ServiceElementVerificationInfo partially : {}, {}", id, serviceElementVerificationInfo);
        if (serviceElementVerificationInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceElementVerificationInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceElementVerificationInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ServiceElementVerificationInfo> result = serviceElementVerificationInfoRepository
            .findById(serviceElementVerificationInfo.getId())
            .map(existingServiceElementVerificationInfo -> {
                if (serviceElementVerificationInfo.getIsDepartmentLeading() != null) {
                    existingServiceElementVerificationInfo.setIsDepartmentLeading(serviceElementVerificationInfo.getIsDepartmentLeading());
                }
                if (serviceElementVerificationInfo.getVerifiedBy() != null) {
                    existingServiceElementVerificationInfo.setVerifiedBy(serviceElementVerificationInfo.getVerifiedBy());
                }
                if (serviceElementVerificationInfo.getVerifyDate() != null) {
                    existingServiceElementVerificationInfo.setVerifyDate(serviceElementVerificationInfo.getVerifyDate());
                }

                return existingServiceElementVerificationInfo;
            })
            .map(serviceElementVerificationInfoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceElementVerificationInfo.getId().toString())
        );
    }

    /**
     * {@code GET  /service-element-verification-infos} : get all the serviceElementVerificationInfos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of serviceElementVerificationInfos in body.
     */
    @GetMapping("/service-element-verification-infos")
    public List<ServiceElementVerificationInfo> getAllServiceElementVerificationInfos() {
        log.debug("REST request to get all ServiceElementVerificationInfos");
        return serviceElementVerificationInfoRepository.findAll();
    }

    /**
     * {@code GET  /service-element-verification-infos/:id} : get the "id" serviceElementVerificationInfo.
     *
     * @param id the id of the serviceElementVerificationInfo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the serviceElementVerificationInfo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/service-element-verification-infos/{id}")
    public ResponseEntity<ServiceElementVerificationInfo> getServiceElementVerificationInfo(@PathVariable Long id) {
        log.debug("REST request to get ServiceElementVerificationInfo : {}", id);
        Optional<ServiceElementVerificationInfo> serviceElementVerificationInfo = serviceElementVerificationInfoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(serviceElementVerificationInfo);
    }

    /**
     * {@code DELETE  /service-element-verification-infos/:id} : delete the "id" serviceElementVerificationInfo.
     *
     * @param id the id of the serviceElementVerificationInfo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/service-element-verification-infos/{id}")
    public ResponseEntity<Void> deleteServiceElementVerificationInfo(@PathVariable Long id) {
        log.debug("REST request to delete ServiceElementVerificationInfo : {}", id);
        serviceElementVerificationInfoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
