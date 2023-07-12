package pl.jswits.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import pl.jswits.IntegrationTest;
import pl.jswits.domain.BusinessService;
import pl.jswits.domain.enumeration.StatusOfServiceElement;
import pl.jswits.repository.BusinessServiceRepository;

/**
 * Integration tests for the {@link BusinessServiceResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class BusinessServiceResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SYMBOL = "AAAAAAAAAA";
    private static final String UPDATED_SYMBOL = "BBBBBBBBBB";

    private static final String DEFAULT_FUNCTIONAL_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_FUNCTIONAL_DESCRIPTION = "BBBBBBBBBB";

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

    private static final StatusOfServiceElement DEFAULT_STATUS = StatusOfServiceElement.ACTIVE;
    private static final StatusOfServiceElement UPDATED_STATUS = StatusOfServiceElement.NON_ACTIVE;

    private static final String ENTITY_API_URL = "/api/business-services";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BusinessServiceRepository businessServiceRepository;

    @Mock
    private BusinessServiceRepository businessServiceRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBusinessServiceMockMvc;

    private BusinessService businessService;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessService createEntity(EntityManager em) {
        BusinessService businessService = new BusinessService()
            .name(DEFAULT_NAME)
            .symbol(DEFAULT_SYMBOL)
            .functionalDescription(DEFAULT_FUNCTIONAL_DESCRIPTION)
            .exclusions(DEFAULT_EXCLUSIONS)
            .dutiesAndResponsibilities(DEFAULT_DUTIES_AND_RESPONSIBILITIES)
            .personResponsibleForService(DEFAULT_PERSON_RESPONSIBLE_FOR_SERVICE)
            .hoursOfService(DEFAULT_HOURS_OF_SERVICE)
            .serviceActivatingCost(DEFAULT_SERVICE_ACTIVATING_COST)
            .priceListOfService(DEFAULT_PRICE_LIST_OF_SERVICE)
            .notes(DEFAULT_NOTES)
            .status(DEFAULT_STATUS);
        return businessService;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessService createUpdatedEntity(EntityManager em) {
        BusinessService businessService = new BusinessService()
            .name(UPDATED_NAME)
            .symbol(UPDATED_SYMBOL)
            .functionalDescription(UPDATED_FUNCTIONAL_DESCRIPTION)
            .exclusions(UPDATED_EXCLUSIONS)
            .dutiesAndResponsibilities(UPDATED_DUTIES_AND_RESPONSIBILITIES)
            .personResponsibleForService(UPDATED_PERSON_RESPONSIBLE_FOR_SERVICE)
            .hoursOfService(UPDATED_HOURS_OF_SERVICE)
            .serviceActivatingCost(UPDATED_SERVICE_ACTIVATING_COST)
            .priceListOfService(UPDATED_PRICE_LIST_OF_SERVICE)
            .notes(UPDATED_NOTES)
            .status(UPDATED_STATUS);
        return businessService;
    }

    @BeforeEach
    public void initTest() {
        businessService = createEntity(em);
    }

    @Test
    @Transactional
    void createBusinessService() throws Exception {
        int databaseSizeBeforeCreate = businessServiceRepository.findAll().size();
        // Create the BusinessService
        restBusinessServiceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isCreated());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeCreate + 1);
        BusinessService testBusinessService = businessServiceList.get(businessServiceList.size() - 1);
        assertThat(testBusinessService.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBusinessService.getSymbol()).isEqualTo(DEFAULT_SYMBOL);
        assertThat(testBusinessService.getFunctionalDescription()).isEqualTo(DEFAULT_FUNCTIONAL_DESCRIPTION);
        assertThat(testBusinessService.getExclusions()).isEqualTo(DEFAULT_EXCLUSIONS);
        assertThat(testBusinessService.getDutiesAndResponsibilities()).isEqualTo(DEFAULT_DUTIES_AND_RESPONSIBILITIES);
        assertThat(testBusinessService.getPersonResponsibleForService()).isEqualTo(DEFAULT_PERSON_RESPONSIBLE_FOR_SERVICE);
        assertThat(testBusinessService.getHoursOfService()).isEqualTo(DEFAULT_HOURS_OF_SERVICE);
        assertThat(testBusinessService.getServiceActivatingCost()).isEqualTo(DEFAULT_SERVICE_ACTIVATING_COST);
        assertThat(testBusinessService.getPriceListOfService()).isEqualTo(DEFAULT_PRICE_LIST_OF_SERVICE);
        assertThat(testBusinessService.getNotes()).isEqualTo(DEFAULT_NOTES);
        assertThat(testBusinessService.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createBusinessServiceWithExistingId() throws Exception {
        // Create the BusinessService with an existing ID
        businessService.setId(1L);

        int databaseSizeBeforeCreate = businessServiceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBusinessServiceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBusinessServices() throws Exception {
        // Initialize the database
        businessServiceRepository.saveAndFlush(businessService);

        // Get all the businessServiceList
        restBusinessServiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(businessService.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].symbol").value(hasItem(DEFAULT_SYMBOL)))
            .andExpect(jsonPath("$.[*].functionalDescription").value(hasItem(DEFAULT_FUNCTIONAL_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].exclusions").value(hasItem(DEFAULT_EXCLUSIONS)))
            .andExpect(jsonPath("$.[*].dutiesAndResponsibilities").value(hasItem(DEFAULT_DUTIES_AND_RESPONSIBILITIES)))
            .andExpect(jsonPath("$.[*].personResponsibleForService").value(hasItem(DEFAULT_PERSON_RESPONSIBLE_FOR_SERVICE)))
            .andExpect(jsonPath("$.[*].hoursOfService").value(hasItem(DEFAULT_HOURS_OF_SERVICE)))
            .andExpect(jsonPath("$.[*].serviceActivatingCost").value(hasItem(DEFAULT_SERVICE_ACTIVATING_COST)))
            .andExpect(jsonPath("$.[*].priceListOfService").value(hasItem(DEFAULT_PRICE_LIST_OF_SERVICE)))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBusinessServicesWithEagerRelationshipsIsEnabled() throws Exception {
        when(businessServiceRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBusinessServiceMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(businessServiceRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBusinessServicesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(businessServiceRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBusinessServiceMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(businessServiceRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getBusinessService() throws Exception {
        // Initialize the database
        businessServiceRepository.saveAndFlush(businessService);

        // Get the businessService
        restBusinessServiceMockMvc
            .perform(get(ENTITY_API_URL_ID, businessService.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(businessService.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.symbol").value(DEFAULT_SYMBOL))
            .andExpect(jsonPath("$.functionalDescription").value(DEFAULT_FUNCTIONAL_DESCRIPTION))
            .andExpect(jsonPath("$.exclusions").value(DEFAULT_EXCLUSIONS))
            .andExpect(jsonPath("$.dutiesAndResponsibilities").value(DEFAULT_DUTIES_AND_RESPONSIBILITIES))
            .andExpect(jsonPath("$.personResponsibleForService").value(DEFAULT_PERSON_RESPONSIBLE_FOR_SERVICE))
            .andExpect(jsonPath("$.hoursOfService").value(DEFAULT_HOURS_OF_SERVICE))
            .andExpect(jsonPath("$.serviceActivatingCost").value(DEFAULT_SERVICE_ACTIVATING_COST))
            .andExpect(jsonPath("$.priceListOfService").value(DEFAULT_PRICE_LIST_OF_SERVICE))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBusinessService() throws Exception {
        // Get the businessService
        restBusinessServiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBusinessService() throws Exception {
        // Initialize the database
        businessServiceRepository.saveAndFlush(businessService);

        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();

        // Update the businessService
        BusinessService updatedBusinessService = businessServiceRepository.findById(businessService.getId()).get();
        // Disconnect from session so that the updates on updatedBusinessService are not directly saved in db
        em.detach(updatedBusinessService);
        updatedBusinessService
            .name(UPDATED_NAME)
            .symbol(UPDATED_SYMBOL)
            .functionalDescription(UPDATED_FUNCTIONAL_DESCRIPTION)
            .exclusions(UPDATED_EXCLUSIONS)
            .dutiesAndResponsibilities(UPDATED_DUTIES_AND_RESPONSIBILITIES)
            .personResponsibleForService(UPDATED_PERSON_RESPONSIBLE_FOR_SERVICE)
            .hoursOfService(UPDATED_HOURS_OF_SERVICE)
            .serviceActivatingCost(UPDATED_SERVICE_ACTIVATING_COST)
            .priceListOfService(UPDATED_PRICE_LIST_OF_SERVICE)
            .notes(UPDATED_NOTES)
            .status(UPDATED_STATUS);

        restBusinessServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBusinessService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBusinessService))
            )
            .andExpect(status().isOk());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
        BusinessService testBusinessService = businessServiceList.get(businessServiceList.size() - 1);
        assertThat(testBusinessService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBusinessService.getSymbol()).isEqualTo(UPDATED_SYMBOL);
        assertThat(testBusinessService.getFunctionalDescription()).isEqualTo(UPDATED_FUNCTIONAL_DESCRIPTION);
        assertThat(testBusinessService.getExclusions()).isEqualTo(UPDATED_EXCLUSIONS);
        assertThat(testBusinessService.getDutiesAndResponsibilities()).isEqualTo(UPDATED_DUTIES_AND_RESPONSIBILITIES);
        assertThat(testBusinessService.getPersonResponsibleForService()).isEqualTo(UPDATED_PERSON_RESPONSIBLE_FOR_SERVICE);
        assertThat(testBusinessService.getHoursOfService()).isEqualTo(UPDATED_HOURS_OF_SERVICE);
        assertThat(testBusinessService.getServiceActivatingCost()).isEqualTo(UPDATED_SERVICE_ACTIVATING_COST);
        assertThat(testBusinessService.getPriceListOfService()).isEqualTo(UPDATED_PRICE_LIST_OF_SERVICE);
        assertThat(testBusinessService.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testBusinessService.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingBusinessService() throws Exception {
        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();
        businessService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusinessServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, businessService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBusinessService() throws Exception {
        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();
        businessService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBusinessService() throws Exception {
        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();
        businessService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessServiceMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBusinessServiceWithPatch() throws Exception {
        // Initialize the database
        businessServiceRepository.saveAndFlush(businessService);

        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();

        // Update the businessService using partial update
        BusinessService partialUpdatedBusinessService = new BusinessService();
        partialUpdatedBusinessService.setId(businessService.getId());

        partialUpdatedBusinessService
            .symbol(UPDATED_SYMBOL)
            .functionalDescription(UPDATED_FUNCTIONAL_DESCRIPTION)
            .exclusions(UPDATED_EXCLUSIONS)
            .notes(UPDATED_NOTES);

        restBusinessServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBusinessService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessService))
            )
            .andExpect(status().isOk());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
        BusinessService testBusinessService = businessServiceList.get(businessServiceList.size() - 1);
        assertThat(testBusinessService.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBusinessService.getSymbol()).isEqualTo(UPDATED_SYMBOL);
        assertThat(testBusinessService.getFunctionalDescription()).isEqualTo(UPDATED_FUNCTIONAL_DESCRIPTION);
        assertThat(testBusinessService.getExclusions()).isEqualTo(UPDATED_EXCLUSIONS);
        assertThat(testBusinessService.getDutiesAndResponsibilities()).isEqualTo(DEFAULT_DUTIES_AND_RESPONSIBILITIES);
        assertThat(testBusinessService.getPersonResponsibleForService()).isEqualTo(DEFAULT_PERSON_RESPONSIBLE_FOR_SERVICE);
        assertThat(testBusinessService.getHoursOfService()).isEqualTo(DEFAULT_HOURS_OF_SERVICE);
        assertThat(testBusinessService.getServiceActivatingCost()).isEqualTo(DEFAULT_SERVICE_ACTIVATING_COST);
        assertThat(testBusinessService.getPriceListOfService()).isEqualTo(DEFAULT_PRICE_LIST_OF_SERVICE);
        assertThat(testBusinessService.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testBusinessService.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateBusinessServiceWithPatch() throws Exception {
        // Initialize the database
        businessServiceRepository.saveAndFlush(businessService);

        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();

        // Update the businessService using partial update
        BusinessService partialUpdatedBusinessService = new BusinessService();
        partialUpdatedBusinessService.setId(businessService.getId());

        partialUpdatedBusinessService
            .name(UPDATED_NAME)
            .symbol(UPDATED_SYMBOL)
            .functionalDescription(UPDATED_FUNCTIONAL_DESCRIPTION)
            .exclusions(UPDATED_EXCLUSIONS)
            .dutiesAndResponsibilities(UPDATED_DUTIES_AND_RESPONSIBILITIES)
            .personResponsibleForService(UPDATED_PERSON_RESPONSIBLE_FOR_SERVICE)
            .hoursOfService(UPDATED_HOURS_OF_SERVICE)
            .serviceActivatingCost(UPDATED_SERVICE_ACTIVATING_COST)
            .priceListOfService(UPDATED_PRICE_LIST_OF_SERVICE)
            .notes(UPDATED_NOTES)
            .status(UPDATED_STATUS);

        restBusinessServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBusinessService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessService))
            )
            .andExpect(status().isOk());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
        BusinessService testBusinessService = businessServiceList.get(businessServiceList.size() - 1);
        assertThat(testBusinessService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBusinessService.getSymbol()).isEqualTo(UPDATED_SYMBOL);
        assertThat(testBusinessService.getFunctionalDescription()).isEqualTo(UPDATED_FUNCTIONAL_DESCRIPTION);
        assertThat(testBusinessService.getExclusions()).isEqualTo(UPDATED_EXCLUSIONS);
        assertThat(testBusinessService.getDutiesAndResponsibilities()).isEqualTo(UPDATED_DUTIES_AND_RESPONSIBILITIES);
        assertThat(testBusinessService.getPersonResponsibleForService()).isEqualTo(UPDATED_PERSON_RESPONSIBLE_FOR_SERVICE);
        assertThat(testBusinessService.getHoursOfService()).isEqualTo(UPDATED_HOURS_OF_SERVICE);
        assertThat(testBusinessService.getServiceActivatingCost()).isEqualTo(UPDATED_SERVICE_ACTIVATING_COST);
        assertThat(testBusinessService.getPriceListOfService()).isEqualTo(UPDATED_PRICE_LIST_OF_SERVICE);
        assertThat(testBusinessService.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testBusinessService.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingBusinessService() throws Exception {
        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();
        businessService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusinessServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, businessService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBusinessService() throws Exception {
        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();
        businessService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBusinessService() throws Exception {
        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();
        businessService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessServiceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBusinessService() throws Exception {
        // Initialize the database
        businessServiceRepository.saveAndFlush(businessService);

        int databaseSizeBeforeDelete = businessServiceRepository.findAll().size();

        // Delete the businessService
        restBusinessServiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, businessService.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
