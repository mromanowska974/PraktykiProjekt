package pl.jswits.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import pl.jswits.IntegrationTest;
import pl.jswits.domain.InternalService;
import pl.jswits.domain.enumeration.StatusOfServiceCard;
import pl.jswits.repository.InternalServiceRepository;

/**
 * Integration tests for the {@link InternalServiceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InternalServiceResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SYMBOL = "AAAAAAAAAA";
    private static final String UPDATED_SYMBOL = "BBBBBBBBBB";

    private static final String DEFAULT_FUNCTIONAL_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_FUNCTIONAL_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_SERVICE_COMISSIONS = "AAAAAAAAAA";
    private static final String UPDATED_SERVICE_COMISSIONS = "BBBBBBBBBB";

    private static final String DEFAULT_EXCLUSIONS = "AAAAAAAAAA";
    private static final String UPDATED_EXCLUSIONS = "BBBBBBBBBB";

    private static final String DEFAULT_DUTIES_AND_RESPONSIBILITIES = "AAAAAAAAAA";
    private static final String UPDATED_DUTIES_AND_RESPONSIBILITIES = "BBBBBBBBBB";

    private static final String DEFAULT_PERSON_RESPONSIBLE_FOR_SERVICE = "AAAAAAAAAA";
    private static final String UPDATED_PERSON_RESPONSIBLE_FOR_SERVICE = "BBBBBBBBBB";

    private static final String DEFAULT_HOURS_OF_SERVICE = "AAAAAAAAAA";
    private static final String UPDATED_HOURS_OF_SERVICE = "BBBBBBBBBB";

    private static final String DEFAULT_SERVICE_ACTIVATING_COST = "AAAAAAAAAA";
    private static final String UPDATED_SERVICE_ACTIVATING_COST = "BBBBBBBBBB";

    private static final String DEFAULT_PRICE_LIST_OF_SERVICE = "AAAAAAAAAA";
    private static final String UPDATED_PRICE_LIST_OF_SERVICE = "BBBBBBBBBB";

    private static final String DEFAULT_NOTES = "AAAAAAAAAA";
    private static final String UPDATED_NOTES = "BBBBBBBBBB";

    private static final StatusOfServiceCard DEFAULT_STATUS = StatusOfServiceCard.BINDING;
    private static final StatusOfServiceCard UPDATED_STATUS = StatusOfServiceCard.NON_BINDING;

    private static final Boolean DEFAULT_CRITICAL_SERVICE = false;
    private static final Boolean UPDATED_CRITICAL_SERVICE = true;

    private static final String DEFAULT_GUARANTEED_LEVELS_OF_PROVISION_OF_SERVICE = "AAAAAAAAAA";
    private static final String UPDATED_GUARANTEED_LEVELS_OF_PROVISION_OF_SERVICE = "BBBBBBBBBB";

    private static final String DEFAULT_PERIOD_OF_PROVISION_OF_SERVICE = "AAAAAAAAAA";
    private static final String UPDATED_PERIOD_OF_PROVISION_OF_SERVICE = "BBBBBBBBBB";

    private static final String DEFAULT_WINDOW_OF_SERVICE = "AAAAAAAAAA";
    private static final String UPDATED_WINDOW_OF_SERVICE = "BBBBBBBBBB";

    private static final String DEFAULT_LEVEL_OF_ACCESSIBILITY = "AAAAAAAAAA";
    private static final String UPDATED_LEVEL_OF_ACCESSIBILITY = "BBBBBBBBBB";

    private static final String DEFAULT_PLAN_DISASTER_RECOVERY = "AAAAAAAAAA";
    private static final String UPDATED_PLAN_DISASTER_RECOVERY = "BBBBBBBBBB";

    private static final String DEFAULT_R_PO = "AAAAAAAAAA";
    private static final String UPDATED_R_PO = "BBBBBBBBBB";

    private static final String DEFAULT_R_TO = "AAAAAAAAAA";
    private static final String UPDATED_R_TO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/internal-services";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InternalServiceRepository internalServiceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInternalServiceMockMvc;

    private InternalService internalService;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InternalService createEntity(EntityManager em) {
        InternalService internalService = new InternalService()
            .name(DEFAULT_NAME)
            .symbol(DEFAULT_SYMBOL)
            .functionalDescription(DEFAULT_FUNCTIONAL_DESCRIPTION)
            .serviceComissions(DEFAULT_SERVICE_COMISSIONS)
            .exclusions(DEFAULT_EXCLUSIONS)
            .dutiesAndResponsibilities(DEFAULT_DUTIES_AND_RESPONSIBILITIES)
            .personResponsibleForService(DEFAULT_PERSON_RESPONSIBLE_FOR_SERVICE)
            .hoursOfService(DEFAULT_HOURS_OF_SERVICE)
            .serviceActivatingCost(DEFAULT_SERVICE_ACTIVATING_COST)
            .priceListOfService(DEFAULT_PRICE_LIST_OF_SERVICE)
            .notes(DEFAULT_NOTES)
            .status(DEFAULT_STATUS)
            .criticalService(DEFAULT_CRITICAL_SERVICE)
            .guaranteedLevelsOfProvisionOfService(DEFAULT_GUARANTEED_LEVELS_OF_PROVISION_OF_SERVICE)
            .periodOfProvisionOfService(DEFAULT_PERIOD_OF_PROVISION_OF_SERVICE)
            .windowOfService(DEFAULT_WINDOW_OF_SERVICE)
            .levelOfAccessibility(DEFAULT_LEVEL_OF_ACCESSIBILITY)
            .planDisasterRecovery(DEFAULT_PLAN_DISASTER_RECOVERY)
            .rPO(DEFAULT_R_PO)
            .rTO(DEFAULT_R_TO);
        return internalService;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InternalService createUpdatedEntity(EntityManager em) {
        InternalService internalService = new InternalService()
            .name(UPDATED_NAME)
            .symbol(UPDATED_SYMBOL)
            .functionalDescription(UPDATED_FUNCTIONAL_DESCRIPTION)
            .serviceComissions(UPDATED_SERVICE_COMISSIONS)
            .exclusions(UPDATED_EXCLUSIONS)
            .dutiesAndResponsibilities(UPDATED_DUTIES_AND_RESPONSIBILITIES)
            .personResponsibleForService(UPDATED_PERSON_RESPONSIBLE_FOR_SERVICE)
            .hoursOfService(UPDATED_HOURS_OF_SERVICE)
            .serviceActivatingCost(UPDATED_SERVICE_ACTIVATING_COST)
            .priceListOfService(UPDATED_PRICE_LIST_OF_SERVICE)
            .notes(UPDATED_NOTES)
            .status(UPDATED_STATUS)
            .criticalService(UPDATED_CRITICAL_SERVICE)
            .guaranteedLevelsOfProvisionOfService(UPDATED_GUARANTEED_LEVELS_OF_PROVISION_OF_SERVICE)
            .periodOfProvisionOfService(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE)
            .windowOfService(UPDATED_WINDOW_OF_SERVICE)
            .levelOfAccessibility(UPDATED_LEVEL_OF_ACCESSIBILITY)
            .planDisasterRecovery(UPDATED_PLAN_DISASTER_RECOVERY)
            .rPO(UPDATED_R_PO)
            .rTO(UPDATED_R_TO);
        return internalService;
    }

    @BeforeEach
    public void initTest() {
        internalService = createEntity(em);
    }

    @Test
    @Transactional
    void createInternalService() throws Exception {
        int databaseSizeBeforeCreate = internalServiceRepository.findAll().size();
        // Create the InternalService
        restInternalServiceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(internalService))
            )
            .andExpect(status().isCreated());

        // Validate the InternalService in the database
        List<InternalService> internalServiceList = internalServiceRepository.findAll();
        assertThat(internalServiceList).hasSize(databaseSizeBeforeCreate + 1);
        InternalService testInternalService = internalServiceList.get(internalServiceList.size() - 1);
        assertThat(testInternalService.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testInternalService.getSymbol()).isEqualTo(DEFAULT_SYMBOL);
        assertThat(testInternalService.getFunctionalDescription()).isEqualTo(DEFAULT_FUNCTIONAL_DESCRIPTION);
        assertThat(testInternalService.getServiceComissions()).isEqualTo(DEFAULT_SERVICE_COMISSIONS);
        assertThat(testInternalService.getExclusions()).isEqualTo(DEFAULT_EXCLUSIONS);
        assertThat(testInternalService.getDutiesAndResponsibilities()).isEqualTo(DEFAULT_DUTIES_AND_RESPONSIBILITIES);
        assertThat(testInternalService.getPersonResponsibleForService()).isEqualTo(DEFAULT_PERSON_RESPONSIBLE_FOR_SERVICE);
        assertThat(testInternalService.getHoursOfService()).isEqualTo(DEFAULT_HOURS_OF_SERVICE);
        assertThat(testInternalService.getServiceActivatingCost()).isEqualTo(DEFAULT_SERVICE_ACTIVATING_COST);
        assertThat(testInternalService.getPriceListOfService()).isEqualTo(DEFAULT_PRICE_LIST_OF_SERVICE);
        assertThat(testInternalService.getNotes()).isEqualTo(DEFAULT_NOTES);
        assertThat(testInternalService.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testInternalService.getCriticalService()).isEqualTo(DEFAULT_CRITICAL_SERVICE);
        assertThat(testInternalService.getGuaranteedLevelsOfProvisionOfService())
            .isEqualTo(DEFAULT_GUARANTEED_LEVELS_OF_PROVISION_OF_SERVICE);
        assertThat(testInternalService.getPeriodOfProvisionOfService()).isEqualTo(DEFAULT_PERIOD_OF_PROVISION_OF_SERVICE);
        assertThat(testInternalService.getWindowOfService()).isEqualTo(DEFAULT_WINDOW_OF_SERVICE);
        assertThat(testInternalService.getLevelOfAccessibility()).isEqualTo(DEFAULT_LEVEL_OF_ACCESSIBILITY);
        assertThat(testInternalService.getPlanDisasterRecovery()).isEqualTo(DEFAULT_PLAN_DISASTER_RECOVERY);
        assertThat(testInternalService.getrPO()).isEqualTo(DEFAULT_R_PO);
        assertThat(testInternalService.getrTO()).isEqualTo(DEFAULT_R_TO);
    }

    @Test
    @Transactional
    void createInternalServiceWithExistingId() throws Exception {
        // Create the InternalService with an existing ID
        internalService.setId(1L);

        int databaseSizeBeforeCreate = internalServiceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInternalServiceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(internalService))
            )
            .andExpect(status().isBadRequest());

        // Validate the InternalService in the database
        List<InternalService> internalServiceList = internalServiceRepository.findAll();
        assertThat(internalServiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInternalServices() throws Exception {
        // Initialize the database
        internalServiceRepository.saveAndFlush(internalService);

        // Get all the internalServiceList
        restInternalServiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(internalService.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].symbol").value(hasItem(DEFAULT_SYMBOL)))
            .andExpect(jsonPath("$.[*].functionalDescription").value(hasItem(DEFAULT_FUNCTIONAL_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].serviceComissions").value(hasItem(DEFAULT_SERVICE_COMISSIONS)))
            .andExpect(jsonPath("$.[*].exclusions").value(hasItem(DEFAULT_EXCLUSIONS)))
            .andExpect(jsonPath("$.[*].dutiesAndResponsibilities").value(hasItem(DEFAULT_DUTIES_AND_RESPONSIBILITIES)))
            .andExpect(jsonPath("$.[*].personResponsibleForService").value(hasItem(DEFAULT_PERSON_RESPONSIBLE_FOR_SERVICE)))
            .andExpect(jsonPath("$.[*].hoursOfService").value(hasItem(DEFAULT_HOURS_OF_SERVICE)))
            .andExpect(jsonPath("$.[*].serviceActivatingCost").value(hasItem(DEFAULT_SERVICE_ACTIVATING_COST)))
            .andExpect(jsonPath("$.[*].priceListOfService").value(hasItem(DEFAULT_PRICE_LIST_OF_SERVICE)))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].criticalService").value(hasItem(DEFAULT_CRITICAL_SERVICE.booleanValue())))
            .andExpect(
                jsonPath("$.[*].guaranteedLevelsOfProvisionOfService").value(hasItem(DEFAULT_GUARANTEED_LEVELS_OF_PROVISION_OF_SERVICE))
            )
            .andExpect(jsonPath("$.[*].periodOfProvisionOfService").value(hasItem(DEFAULT_PERIOD_OF_PROVISION_OF_SERVICE)))
            .andExpect(jsonPath("$.[*].windowOfService").value(hasItem(DEFAULT_WINDOW_OF_SERVICE)))
            .andExpect(jsonPath("$.[*].levelOfAccessibility").value(hasItem(DEFAULT_LEVEL_OF_ACCESSIBILITY)))
            .andExpect(jsonPath("$.[*].planDisasterRecovery").value(hasItem(DEFAULT_PLAN_DISASTER_RECOVERY)))
            .andExpect(jsonPath("$.[*].rPO").value(hasItem(DEFAULT_R_PO)))
            .andExpect(jsonPath("$.[*].rTO").value(hasItem(DEFAULT_R_TO)));
    }

    @Test
    @Transactional
    void getInternalService() throws Exception {
        // Initialize the database
        internalServiceRepository.saveAndFlush(internalService);

        // Get the internalService
        restInternalServiceMockMvc
            .perform(get(ENTITY_API_URL_ID, internalService.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(internalService.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.symbol").value(DEFAULT_SYMBOL))
            .andExpect(jsonPath("$.functionalDescription").value(DEFAULT_FUNCTIONAL_DESCRIPTION))
            .andExpect(jsonPath("$.serviceComissions").value(DEFAULT_SERVICE_COMISSIONS))
            .andExpect(jsonPath("$.exclusions").value(DEFAULT_EXCLUSIONS))
            .andExpect(jsonPath("$.dutiesAndResponsibilities").value(DEFAULT_DUTIES_AND_RESPONSIBILITIES))
            .andExpect(jsonPath("$.personResponsibleForService").value(DEFAULT_PERSON_RESPONSIBLE_FOR_SERVICE))
            .andExpect(jsonPath("$.hoursOfService").value(DEFAULT_HOURS_OF_SERVICE))
            .andExpect(jsonPath("$.serviceActivatingCost").value(DEFAULT_SERVICE_ACTIVATING_COST))
            .andExpect(jsonPath("$.priceListOfService").value(DEFAULT_PRICE_LIST_OF_SERVICE))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.criticalService").value(DEFAULT_CRITICAL_SERVICE.booleanValue()))
            .andExpect(jsonPath("$.guaranteedLevelsOfProvisionOfService").value(DEFAULT_GUARANTEED_LEVELS_OF_PROVISION_OF_SERVICE))
            .andExpect(jsonPath("$.periodOfProvisionOfService").value(DEFAULT_PERIOD_OF_PROVISION_OF_SERVICE))
            .andExpect(jsonPath("$.windowOfService").value(DEFAULT_WINDOW_OF_SERVICE))
            .andExpect(jsonPath("$.levelOfAccessibility").value(DEFAULT_LEVEL_OF_ACCESSIBILITY))
            .andExpect(jsonPath("$.planDisasterRecovery").value(DEFAULT_PLAN_DISASTER_RECOVERY))
            .andExpect(jsonPath("$.rPO").value(DEFAULT_R_PO))
            .andExpect(jsonPath("$.rTO").value(DEFAULT_R_TO));
    }

    @Test
    @Transactional
    void getNonExistingInternalService() throws Exception {
        // Get the internalService
        restInternalServiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingInternalService() throws Exception {
        // Initialize the database
        internalServiceRepository.saveAndFlush(internalService);

        int databaseSizeBeforeUpdate = internalServiceRepository.findAll().size();

        // Update the internalService
        InternalService updatedInternalService = internalServiceRepository.findById(internalService.getId()).get();
        // Disconnect from session so that the updates on updatedInternalService are not directly saved in db
        em.detach(updatedInternalService);
        updatedInternalService
            .name(UPDATED_NAME)
            .symbol(UPDATED_SYMBOL)
            .functionalDescription(UPDATED_FUNCTIONAL_DESCRIPTION)
            .serviceComissions(UPDATED_SERVICE_COMISSIONS)
            .exclusions(UPDATED_EXCLUSIONS)
            .dutiesAndResponsibilities(UPDATED_DUTIES_AND_RESPONSIBILITIES)
            .personResponsibleForService(UPDATED_PERSON_RESPONSIBLE_FOR_SERVICE)
            .hoursOfService(UPDATED_HOURS_OF_SERVICE)
            .serviceActivatingCost(UPDATED_SERVICE_ACTIVATING_COST)
            .priceListOfService(UPDATED_PRICE_LIST_OF_SERVICE)
            .notes(UPDATED_NOTES)
            .status(UPDATED_STATUS)
            .criticalService(UPDATED_CRITICAL_SERVICE)
            .guaranteedLevelsOfProvisionOfService(UPDATED_GUARANTEED_LEVELS_OF_PROVISION_OF_SERVICE)
            .periodOfProvisionOfService(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE)
            .windowOfService(UPDATED_WINDOW_OF_SERVICE)
            .levelOfAccessibility(UPDATED_LEVEL_OF_ACCESSIBILITY)
            .planDisasterRecovery(UPDATED_PLAN_DISASTER_RECOVERY)
            .rPO(UPDATED_R_PO)
            .rTO(UPDATED_R_TO);

        restInternalServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInternalService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInternalService))
            )
            .andExpect(status().isOk());

        // Validate the InternalService in the database
        List<InternalService> internalServiceList = internalServiceRepository.findAll();
        assertThat(internalServiceList).hasSize(databaseSizeBeforeUpdate);
        InternalService testInternalService = internalServiceList.get(internalServiceList.size() - 1);
        assertThat(testInternalService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testInternalService.getSymbol()).isEqualTo(UPDATED_SYMBOL);
        assertThat(testInternalService.getFunctionalDescription()).isEqualTo(UPDATED_FUNCTIONAL_DESCRIPTION);
        assertThat(testInternalService.getServiceComissions()).isEqualTo(UPDATED_SERVICE_COMISSIONS);
        assertThat(testInternalService.getExclusions()).isEqualTo(UPDATED_EXCLUSIONS);
        assertThat(testInternalService.getDutiesAndResponsibilities()).isEqualTo(UPDATED_DUTIES_AND_RESPONSIBILITIES);
        assertThat(testInternalService.getPersonResponsibleForService()).isEqualTo(UPDATED_PERSON_RESPONSIBLE_FOR_SERVICE);
        assertThat(testInternalService.getHoursOfService()).isEqualTo(UPDATED_HOURS_OF_SERVICE);
        assertThat(testInternalService.getServiceActivatingCost()).isEqualTo(UPDATED_SERVICE_ACTIVATING_COST);
        assertThat(testInternalService.getPriceListOfService()).isEqualTo(UPDATED_PRICE_LIST_OF_SERVICE);
        assertThat(testInternalService.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testInternalService.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testInternalService.getCriticalService()).isEqualTo(UPDATED_CRITICAL_SERVICE);
        assertThat(testInternalService.getGuaranteedLevelsOfProvisionOfService())
            .isEqualTo(UPDATED_GUARANTEED_LEVELS_OF_PROVISION_OF_SERVICE);
        assertThat(testInternalService.getPeriodOfProvisionOfService()).isEqualTo(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE);
        assertThat(testInternalService.getWindowOfService()).isEqualTo(UPDATED_WINDOW_OF_SERVICE);
        assertThat(testInternalService.getLevelOfAccessibility()).isEqualTo(UPDATED_LEVEL_OF_ACCESSIBILITY);
        assertThat(testInternalService.getPlanDisasterRecovery()).isEqualTo(UPDATED_PLAN_DISASTER_RECOVERY);
        assertThat(testInternalService.getrPO()).isEqualTo(UPDATED_R_PO);
        assertThat(testInternalService.getrTO()).isEqualTo(UPDATED_R_TO);
    }

    @Test
    @Transactional
    void putNonExistingInternalService() throws Exception {
        int databaseSizeBeforeUpdate = internalServiceRepository.findAll().size();
        internalService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInternalServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, internalService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(internalService))
            )
            .andExpect(status().isBadRequest());

        // Validate the InternalService in the database
        List<InternalService> internalServiceList = internalServiceRepository.findAll();
        assertThat(internalServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInternalService() throws Exception {
        int databaseSizeBeforeUpdate = internalServiceRepository.findAll().size();
        internalService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInternalServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(internalService))
            )
            .andExpect(status().isBadRequest());

        // Validate the InternalService in the database
        List<InternalService> internalServiceList = internalServiceRepository.findAll();
        assertThat(internalServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInternalService() throws Exception {
        int databaseSizeBeforeUpdate = internalServiceRepository.findAll().size();
        internalService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInternalServiceMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(internalService))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the InternalService in the database
        List<InternalService> internalServiceList = internalServiceRepository.findAll();
        assertThat(internalServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInternalServiceWithPatch() throws Exception {
        // Initialize the database
        internalServiceRepository.saveAndFlush(internalService);

        int databaseSizeBeforeUpdate = internalServiceRepository.findAll().size();

        // Update the internalService using partial update
        InternalService partialUpdatedInternalService = new InternalService();
        partialUpdatedInternalService.setId(internalService.getId());

        partialUpdatedInternalService
            .exclusions(UPDATED_EXCLUSIONS)
            .dutiesAndResponsibilities(UPDATED_DUTIES_AND_RESPONSIBILITIES)
            .notes(UPDATED_NOTES)
            .status(UPDATED_STATUS)
            .periodOfProvisionOfService(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE)
            .levelOfAccessibility(UPDATED_LEVEL_OF_ACCESSIBILITY)
            .rTO(UPDATED_R_TO);

        restInternalServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInternalService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInternalService))
            )
            .andExpect(status().isOk());

        // Validate the InternalService in the database
        List<InternalService> internalServiceList = internalServiceRepository.findAll();
        assertThat(internalServiceList).hasSize(databaseSizeBeforeUpdate);
        InternalService testInternalService = internalServiceList.get(internalServiceList.size() - 1);
        assertThat(testInternalService.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testInternalService.getSymbol()).isEqualTo(DEFAULT_SYMBOL);
        assertThat(testInternalService.getFunctionalDescription()).isEqualTo(DEFAULT_FUNCTIONAL_DESCRIPTION);
        assertThat(testInternalService.getServiceComissions()).isEqualTo(DEFAULT_SERVICE_COMISSIONS);
        assertThat(testInternalService.getExclusions()).isEqualTo(UPDATED_EXCLUSIONS);
        assertThat(testInternalService.getDutiesAndResponsibilities()).isEqualTo(UPDATED_DUTIES_AND_RESPONSIBILITIES);
        assertThat(testInternalService.getPersonResponsibleForService()).isEqualTo(DEFAULT_PERSON_RESPONSIBLE_FOR_SERVICE);
        assertThat(testInternalService.getHoursOfService()).isEqualTo(DEFAULT_HOURS_OF_SERVICE);
        assertThat(testInternalService.getServiceActivatingCost()).isEqualTo(DEFAULT_SERVICE_ACTIVATING_COST);
        assertThat(testInternalService.getPriceListOfService()).isEqualTo(DEFAULT_PRICE_LIST_OF_SERVICE);
        assertThat(testInternalService.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testInternalService.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testInternalService.getCriticalService()).isEqualTo(DEFAULT_CRITICAL_SERVICE);
        assertThat(testInternalService.getGuaranteedLevelsOfProvisionOfService())
            .isEqualTo(DEFAULT_GUARANTEED_LEVELS_OF_PROVISION_OF_SERVICE);
        assertThat(testInternalService.getPeriodOfProvisionOfService()).isEqualTo(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE);
        assertThat(testInternalService.getWindowOfService()).isEqualTo(DEFAULT_WINDOW_OF_SERVICE);
        assertThat(testInternalService.getLevelOfAccessibility()).isEqualTo(UPDATED_LEVEL_OF_ACCESSIBILITY);
        assertThat(testInternalService.getPlanDisasterRecovery()).isEqualTo(DEFAULT_PLAN_DISASTER_RECOVERY);
        assertThat(testInternalService.getrPO()).isEqualTo(DEFAULT_R_PO);
        assertThat(testInternalService.getrTO()).isEqualTo(UPDATED_R_TO);
    }

    @Test
    @Transactional
    void fullUpdateInternalServiceWithPatch() throws Exception {
        // Initialize the database
        internalServiceRepository.saveAndFlush(internalService);

        int databaseSizeBeforeUpdate = internalServiceRepository.findAll().size();

        // Update the internalService using partial update
        InternalService partialUpdatedInternalService = new InternalService();
        partialUpdatedInternalService.setId(internalService.getId());

        partialUpdatedInternalService
            .name(UPDATED_NAME)
            .symbol(UPDATED_SYMBOL)
            .functionalDescription(UPDATED_FUNCTIONAL_DESCRIPTION)
            .serviceComissions(UPDATED_SERVICE_COMISSIONS)
            .exclusions(UPDATED_EXCLUSIONS)
            .dutiesAndResponsibilities(UPDATED_DUTIES_AND_RESPONSIBILITIES)
            .personResponsibleForService(UPDATED_PERSON_RESPONSIBLE_FOR_SERVICE)
            .hoursOfService(UPDATED_HOURS_OF_SERVICE)
            .serviceActivatingCost(UPDATED_SERVICE_ACTIVATING_COST)
            .priceListOfService(UPDATED_PRICE_LIST_OF_SERVICE)
            .notes(UPDATED_NOTES)
            .status(UPDATED_STATUS)
            .criticalService(UPDATED_CRITICAL_SERVICE)
            .guaranteedLevelsOfProvisionOfService(UPDATED_GUARANTEED_LEVELS_OF_PROVISION_OF_SERVICE)
            .periodOfProvisionOfService(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE)
            .windowOfService(UPDATED_WINDOW_OF_SERVICE)
            .levelOfAccessibility(UPDATED_LEVEL_OF_ACCESSIBILITY)
            .planDisasterRecovery(UPDATED_PLAN_DISASTER_RECOVERY)
            .rPO(UPDATED_R_PO)
            .rTO(UPDATED_R_TO);

        restInternalServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInternalService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInternalService))
            )
            .andExpect(status().isOk());

        // Validate the InternalService in the database
        List<InternalService> internalServiceList = internalServiceRepository.findAll();
        assertThat(internalServiceList).hasSize(databaseSizeBeforeUpdate);
        InternalService testInternalService = internalServiceList.get(internalServiceList.size() - 1);
        assertThat(testInternalService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testInternalService.getSymbol()).isEqualTo(UPDATED_SYMBOL);
        assertThat(testInternalService.getFunctionalDescription()).isEqualTo(UPDATED_FUNCTIONAL_DESCRIPTION);
        assertThat(testInternalService.getServiceComissions()).isEqualTo(UPDATED_SERVICE_COMISSIONS);
        assertThat(testInternalService.getExclusions()).isEqualTo(UPDATED_EXCLUSIONS);
        assertThat(testInternalService.getDutiesAndResponsibilities()).isEqualTo(UPDATED_DUTIES_AND_RESPONSIBILITIES);
        assertThat(testInternalService.getPersonResponsibleForService()).isEqualTo(UPDATED_PERSON_RESPONSIBLE_FOR_SERVICE);
        assertThat(testInternalService.getHoursOfService()).isEqualTo(UPDATED_HOURS_OF_SERVICE);
        assertThat(testInternalService.getServiceActivatingCost()).isEqualTo(UPDATED_SERVICE_ACTIVATING_COST);
        assertThat(testInternalService.getPriceListOfService()).isEqualTo(UPDATED_PRICE_LIST_OF_SERVICE);
        assertThat(testInternalService.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testInternalService.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testInternalService.getCriticalService()).isEqualTo(UPDATED_CRITICAL_SERVICE);
        assertThat(testInternalService.getGuaranteedLevelsOfProvisionOfService())
            .isEqualTo(UPDATED_GUARANTEED_LEVELS_OF_PROVISION_OF_SERVICE);
        assertThat(testInternalService.getPeriodOfProvisionOfService()).isEqualTo(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE);
        assertThat(testInternalService.getWindowOfService()).isEqualTo(UPDATED_WINDOW_OF_SERVICE);
        assertThat(testInternalService.getLevelOfAccessibility()).isEqualTo(UPDATED_LEVEL_OF_ACCESSIBILITY);
        assertThat(testInternalService.getPlanDisasterRecovery()).isEqualTo(UPDATED_PLAN_DISASTER_RECOVERY);
        assertThat(testInternalService.getrPO()).isEqualTo(UPDATED_R_PO);
        assertThat(testInternalService.getrTO()).isEqualTo(UPDATED_R_TO);
    }

    @Test
    @Transactional
    void patchNonExistingInternalService() throws Exception {
        int databaseSizeBeforeUpdate = internalServiceRepository.findAll().size();
        internalService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInternalServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, internalService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(internalService))
            )
            .andExpect(status().isBadRequest());

        // Validate the InternalService in the database
        List<InternalService> internalServiceList = internalServiceRepository.findAll();
        assertThat(internalServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInternalService() throws Exception {
        int databaseSizeBeforeUpdate = internalServiceRepository.findAll().size();
        internalService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInternalServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(internalService))
            )
            .andExpect(status().isBadRequest());

        // Validate the InternalService in the database
        List<InternalService> internalServiceList = internalServiceRepository.findAll();
        assertThat(internalServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInternalService() throws Exception {
        int databaseSizeBeforeUpdate = internalServiceRepository.findAll().size();
        internalService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInternalServiceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(internalService))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the InternalService in the database
        List<InternalService> internalServiceList = internalServiceRepository.findAll();
        assertThat(internalServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInternalService() throws Exception {
        // Initialize the database
        internalServiceRepository.saveAndFlush(internalService);

        int databaseSizeBeforeDelete = internalServiceRepository.findAll().size();

        // Delete the internalService
        restInternalServiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, internalService.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<InternalService> internalServiceList = internalServiceRepository.findAll();
        assertThat(internalServiceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
