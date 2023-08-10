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
import pl.jswits.domain.ExternalCompany;
import pl.jswits.repository.ExternalCompanyRepository;
import pl.jswits.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link pl.jswits.domain.ExternalCompany}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ExternalCompanyResource {

    private final Logger log = LoggerFactory.getLogger(ExternalCompanyResource.class);

    private static final String ENTITY_NAME = "externalCompany";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExternalCompanyRepository externalCompanyRepository;

    public ExternalCompanyResource(ExternalCompanyRepository externalCompanyRepository) {
        this.externalCompanyRepository = externalCompanyRepository;
    }

    /**
     * {@code POST  /external-companies} : Create a new externalCompany.
     *
     * @param externalCompany the externalCompany to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new externalCompany, or with status {@code 400 (Bad Request)} if the externalCompany has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/external-companies")
    public ResponseEntity<ExternalCompany> createExternalCompany(@RequestBody ExternalCompany externalCompany) throws URISyntaxException {
        log.debug("REST request to save ExternalCompany : {}", externalCompany);
        if (externalCompany.getId() != null) {
            throw new BadRequestAlertException("A new externalCompany cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ExternalCompany result = externalCompanyRepository.save(externalCompany);
        return ResponseEntity
            .created(new URI("/api/external-companies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /external-companies/:id} : Updates an existing externalCompany.
     *
     * @param id the id of the externalCompany to save.
     * @param externalCompany the externalCompany to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated externalCompany,
     * or with status {@code 400 (Bad Request)} if the externalCompany is not valid,
     * or with status {@code 500 (Internal Server Error)} if the externalCompany couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/external-companies/{id}")
    public ResponseEntity<ExternalCompany> updateExternalCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExternalCompany externalCompany
    ) throws URISyntaxException {
        log.debug("REST request to update ExternalCompany : {}, {}", id, externalCompany);
        if (externalCompany.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, externalCompany.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!externalCompanyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ExternalCompany result = externalCompanyRepository.save(externalCompany);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, externalCompany.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /external-companies/:id} : Partial updates given fields of an existing externalCompany, field will ignore if it is null
     *
     * @param id the id of the externalCompany to save.
     * @param externalCompany the externalCompany to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated externalCompany,
     * or with status {@code 400 (Bad Request)} if the externalCompany is not valid,
     * or with status {@code 404 (Not Found)} if the externalCompany is not found,
     * or with status {@code 500 (Internal Server Error)} if the externalCompany couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/external-companies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ExternalCompany> partialUpdateExternalCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExternalCompany externalCompany
    ) throws URISyntaxException {
        log.debug("REST request to partial update ExternalCompany partially : {}, {}", id, externalCompany);
        if (externalCompany.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, externalCompany.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!externalCompanyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ExternalCompany> result = externalCompanyRepository
            .findById(externalCompany.getId())
            .map(existingExternalCompany -> {
                if (externalCompany.getName() != null) {
                    existingExternalCompany.setName(externalCompany.getName());
                }
                if (externalCompany.getContractNumber() != null) {
                    existingExternalCompany.setContractNumber(externalCompany.getContractNumber());
                }
                if (externalCompany.getsLAParameters() != null) {
                    existingExternalCompany.setsLAParameters(externalCompany.getsLAParameters());
                }

                return existingExternalCompany;
            })
            .map(externalCompanyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, externalCompany.getId().toString())
        );
    }

    /**
     * {@code GET  /external-companies} : get all the externalCompanies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of externalCompanies in body.
     */
    @GetMapping("/external-companies")
    public List<ExternalCompany> getAllExternalCompanies() {
        log.debug("REST request to get all ExternalCompanies");
        return externalCompanyRepository.findAll();
    }

    @GetMapping("/external-companies/byIS")
    public List<ExternalCompany> getExternalCompaniesByInternalService(@RequestParam Long id) {
        log.debug("REST request to get all External Companies By Internal Service");
        return externalCompanyRepository.findExternalCompaniesByInternalServiceId(id);
    }

    /**
     * {@code GET  /external-companies/:id} : get the "id" externalCompany.
     *
     * @param id the id of the externalCompany to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the externalCompany, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/external-companies/{id}")
    public ResponseEntity<ExternalCompany> getExternalCompany(@PathVariable Long id) {
        log.debug("REST request to get ExternalCompany : {}", id);
        Optional<ExternalCompany> externalCompany = externalCompanyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(externalCompany);
    }

    /**
     * {@code DELETE  /external-companies/:id} : delete the "id" externalCompany.
     *
     * @param id the id of the externalCompany to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/external-companies/{id}")
    public ResponseEntity<Void> deleteExternalCompany(@PathVariable Long id) {
        log.debug("REST request to delete ExternalCompany : {}", id);
        externalCompanyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
