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
import pl.jswits.domain.ExternalCompany;
import pl.jswits.repository.ExternalCompanyRepository;

/**
 * Integration tests for the {@link ExternalCompanyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ExternalCompanyResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CONTRACT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_CONTRACT_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_S_LA_PARAMETERS = "AAAAAAAAAA";
    private static final String UPDATED_S_LA_PARAMETERS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/external-companies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExternalCompanyRepository externalCompanyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExternalCompanyMockMvc;

    private ExternalCompany externalCompany;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExternalCompany createEntity(EntityManager em) {
        ExternalCompany externalCompany = new ExternalCompany()
            .name(DEFAULT_NAME)
            .contractNumber(DEFAULT_CONTRACT_NUMBER)
            .sLAParameters(DEFAULT_S_LA_PARAMETERS);
        return externalCompany;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExternalCompany createUpdatedEntity(EntityManager em) {
        ExternalCompany externalCompany = new ExternalCompany()
            .name(UPDATED_NAME)
            .contractNumber(UPDATED_CONTRACT_NUMBER)
            .sLAParameters(UPDATED_S_LA_PARAMETERS);
        return externalCompany;
    }

    @BeforeEach
    public void initTest() {
        externalCompany = createEntity(em);
    }

    @Test
    @Transactional
    void createExternalCompany() throws Exception {
        int databaseSizeBeforeCreate = externalCompanyRepository.findAll().size();
        // Create the ExternalCompany
        restExternalCompanyMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(externalCompany))
            )
            .andExpect(status().isCreated());

        // Validate the ExternalCompany in the database
        List<ExternalCompany> externalCompanyList = externalCompanyRepository.findAll();
        assertThat(externalCompanyList).hasSize(databaseSizeBeforeCreate + 1);
        ExternalCompany testExternalCompany = externalCompanyList.get(externalCompanyList.size() - 1);
        assertThat(testExternalCompany.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testExternalCompany.getContractNumber()).isEqualTo(DEFAULT_CONTRACT_NUMBER);
        assertThat(testExternalCompany.getsLAParameters()).isEqualTo(DEFAULT_S_LA_PARAMETERS);
    }

    @Test
    @Transactional
    void createExternalCompanyWithExistingId() throws Exception {
        // Create the ExternalCompany with an existing ID
        externalCompany.setId(1L);

        int databaseSizeBeforeCreate = externalCompanyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExternalCompanyMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(externalCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExternalCompany in the database
        List<ExternalCompany> externalCompanyList = externalCompanyRepository.findAll();
        assertThat(externalCompanyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllExternalCompanies() throws Exception {
        // Initialize the database
        externalCompanyRepository.saveAndFlush(externalCompany);

        // Get all the externalCompanyList
        restExternalCompanyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(externalCompany.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].contractNumber").value(hasItem(DEFAULT_CONTRACT_NUMBER)))
            .andExpect(jsonPath("$.[*].sLAParameters").value(hasItem(DEFAULT_S_LA_PARAMETERS)));
    }

    @Test
    @Transactional
    void getExternalCompany() throws Exception {
        // Initialize the database
        externalCompanyRepository.saveAndFlush(externalCompany);

        // Get the externalCompany
        restExternalCompanyMockMvc
            .perform(get(ENTITY_API_URL_ID, externalCompany.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(externalCompany.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.contractNumber").value(DEFAULT_CONTRACT_NUMBER))
            .andExpect(jsonPath("$.sLAParameters").value(DEFAULT_S_LA_PARAMETERS));
    }

    @Test
    @Transactional
    void getNonExistingExternalCompany() throws Exception {
        // Get the externalCompany
        restExternalCompanyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExternalCompany() throws Exception {
        // Initialize the database
        externalCompanyRepository.saveAndFlush(externalCompany);

        int databaseSizeBeforeUpdate = externalCompanyRepository.findAll().size();

        // Update the externalCompany
        ExternalCompany updatedExternalCompany = externalCompanyRepository.findById(externalCompany.getId()).get();
        // Disconnect from session so that the updates on updatedExternalCompany are not directly saved in db
        em.detach(updatedExternalCompany);
        updatedExternalCompany.name(UPDATED_NAME).contractNumber(UPDATED_CONTRACT_NUMBER).sLAParameters(UPDATED_S_LA_PARAMETERS);

        restExternalCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExternalCompany.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExternalCompany))
            )
            .andExpect(status().isOk());

        // Validate the ExternalCompany in the database
        List<ExternalCompany> externalCompanyList = externalCompanyRepository.findAll();
        assertThat(externalCompanyList).hasSize(databaseSizeBeforeUpdate);
        ExternalCompany testExternalCompany = externalCompanyList.get(externalCompanyList.size() - 1);
        assertThat(testExternalCompany.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testExternalCompany.getContractNumber()).isEqualTo(UPDATED_CONTRACT_NUMBER);
        assertThat(testExternalCompany.getsLAParameters()).isEqualTo(UPDATED_S_LA_PARAMETERS);
    }

    @Test
    @Transactional
    void putNonExistingExternalCompany() throws Exception {
        int databaseSizeBeforeUpdate = externalCompanyRepository.findAll().size();
        externalCompany.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExternalCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, externalCompany.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(externalCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExternalCompany in the database
        List<ExternalCompany> externalCompanyList = externalCompanyRepository.findAll();
        assertThat(externalCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExternalCompany() throws Exception {
        int databaseSizeBeforeUpdate = externalCompanyRepository.findAll().size();
        externalCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExternalCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(externalCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExternalCompany in the database
        List<ExternalCompany> externalCompanyList = externalCompanyRepository.findAll();
        assertThat(externalCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExternalCompany() throws Exception {
        int databaseSizeBeforeUpdate = externalCompanyRepository.findAll().size();
        externalCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExternalCompanyMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(externalCompany))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExternalCompany in the database
        List<ExternalCompany> externalCompanyList = externalCompanyRepository.findAll();
        assertThat(externalCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExternalCompanyWithPatch() throws Exception {
        // Initialize the database
        externalCompanyRepository.saveAndFlush(externalCompany);

        int databaseSizeBeforeUpdate = externalCompanyRepository.findAll().size();

        // Update the externalCompany using partial update
        ExternalCompany partialUpdatedExternalCompany = new ExternalCompany();
        partialUpdatedExternalCompany.setId(externalCompany.getId());

        partialUpdatedExternalCompany.name(UPDATED_NAME).contractNumber(UPDATED_CONTRACT_NUMBER).sLAParameters(UPDATED_S_LA_PARAMETERS);

        restExternalCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExternalCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExternalCompany))
            )
            .andExpect(status().isOk());

        // Validate the ExternalCompany in the database
        List<ExternalCompany> externalCompanyList = externalCompanyRepository.findAll();
        assertThat(externalCompanyList).hasSize(databaseSizeBeforeUpdate);
        ExternalCompany testExternalCompany = externalCompanyList.get(externalCompanyList.size() - 1);
        assertThat(testExternalCompany.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testExternalCompany.getContractNumber()).isEqualTo(UPDATED_CONTRACT_NUMBER);
        assertThat(testExternalCompany.getsLAParameters()).isEqualTo(UPDATED_S_LA_PARAMETERS);
    }

    @Test
    @Transactional
    void fullUpdateExternalCompanyWithPatch() throws Exception {
        // Initialize the database
        externalCompanyRepository.saveAndFlush(externalCompany);

        int databaseSizeBeforeUpdate = externalCompanyRepository.findAll().size();

        // Update the externalCompany using partial update
        ExternalCompany partialUpdatedExternalCompany = new ExternalCompany();
        partialUpdatedExternalCompany.setId(externalCompany.getId());

        partialUpdatedExternalCompany.name(UPDATED_NAME).contractNumber(UPDATED_CONTRACT_NUMBER).sLAParameters(UPDATED_S_LA_PARAMETERS);

        restExternalCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExternalCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExternalCompany))
            )
            .andExpect(status().isOk());

        // Validate the ExternalCompany in the database
        List<ExternalCompany> externalCompanyList = externalCompanyRepository.findAll();
        assertThat(externalCompanyList).hasSize(databaseSizeBeforeUpdate);
        ExternalCompany testExternalCompany = externalCompanyList.get(externalCompanyList.size() - 1);
        assertThat(testExternalCompany.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testExternalCompany.getContractNumber()).isEqualTo(UPDATED_CONTRACT_NUMBER);
        assertThat(testExternalCompany.getsLAParameters()).isEqualTo(UPDATED_S_LA_PARAMETERS);
    }

    @Test
    @Transactional
    void patchNonExistingExternalCompany() throws Exception {
        int databaseSizeBeforeUpdate = externalCompanyRepository.findAll().size();
        externalCompany.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExternalCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, externalCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(externalCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExternalCompany in the database
        List<ExternalCompany> externalCompanyList = externalCompanyRepository.findAll();
        assertThat(externalCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExternalCompany() throws Exception {
        int databaseSizeBeforeUpdate = externalCompanyRepository.findAll().size();
        externalCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExternalCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(externalCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExternalCompany in the database
        List<ExternalCompany> externalCompanyList = externalCompanyRepository.findAll();
        assertThat(externalCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExternalCompany() throws Exception {
        int databaseSizeBeforeUpdate = externalCompanyRepository.findAll().size();
        externalCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExternalCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(externalCompany))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExternalCompany in the database
        List<ExternalCompany> externalCompanyList = externalCompanyRepository.findAll();
        assertThat(externalCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExternalCompany() throws Exception {
        // Initialize the database
        externalCompanyRepository.saveAndFlush(externalCompany);

        int databaseSizeBeforeDelete = externalCompanyRepository.findAll().size();

        // Delete the externalCompany
        restExternalCompanyMockMvc
            .perform(delete(ENTITY_API_URL_ID, externalCompany.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ExternalCompany> externalCompanyList = externalCompanyRepository.findAll();
        assertThat(externalCompanyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
