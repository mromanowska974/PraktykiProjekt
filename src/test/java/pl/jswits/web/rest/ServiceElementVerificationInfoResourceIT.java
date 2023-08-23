package pl.jswits.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
import pl.jswits.domain.ServiceElementVerificationInfo;
import pl.jswits.repository.ServiceElementVerificationInfoRepository;

/**
 * Integration tests for the {@link ServiceElementVerificationInfoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ServiceElementVerificationInfoResourceIT {

    private static final Boolean DEFAULT_IS_DEPARTMENT_LEADING = false;
    private static final Boolean UPDATED_IS_DEPARTMENT_LEADING = true;

    private static final String DEFAULT_VERIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_VERIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_VERIFY_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_VERIFY_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/service-element-verification-infos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ServiceElementVerificationInfoRepository serviceElementVerificationInfoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restServiceElementVerificationInfoMockMvc;

    private ServiceElementVerificationInfo serviceElementVerificationInfo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceElementVerificationInfo createEntity(EntityManager em) {
        ServiceElementVerificationInfo serviceElementVerificationInfo = new ServiceElementVerificationInfo()
            .isDepartmentLeading(DEFAULT_IS_DEPARTMENT_LEADING)
            .verifiedBy(DEFAULT_VERIFIED_BY)
            .verifyDate(DEFAULT_VERIFY_DATE);
        return serviceElementVerificationInfo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceElementVerificationInfo createUpdatedEntity(EntityManager em) {
        ServiceElementVerificationInfo serviceElementVerificationInfo = new ServiceElementVerificationInfo()
            .isDepartmentLeading(UPDATED_IS_DEPARTMENT_LEADING)
            .verifiedBy(UPDATED_VERIFIED_BY)
            .verifyDate(UPDATED_VERIFY_DATE);
        return serviceElementVerificationInfo;
    }

    @BeforeEach
    public void initTest() {
        serviceElementVerificationInfo = createEntity(em);
    }

    @Test
    @Transactional
    void createServiceElementVerificationInfo() throws Exception {
        int databaseSizeBeforeCreate = serviceElementVerificationInfoRepository.findAll().size();
        // Create the ServiceElementVerificationInfo
        restServiceElementVerificationInfoMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceElementVerificationInfo))
            )
            .andExpect(status().isCreated());

        // Validate the ServiceElementVerificationInfo in the database
        List<ServiceElementVerificationInfo> serviceElementVerificationInfoList = serviceElementVerificationInfoRepository.findAll();
        assertThat(serviceElementVerificationInfoList).hasSize(databaseSizeBeforeCreate + 1);
        ServiceElementVerificationInfo testServiceElementVerificationInfo = serviceElementVerificationInfoList.get(
            serviceElementVerificationInfoList.size() - 1
        );
        assertThat(testServiceElementVerificationInfo.getIsDepartmentLeading()).isEqualTo(DEFAULT_IS_DEPARTMENT_LEADING);
        assertThat(testServiceElementVerificationInfo.getVerifiedBy()).isEqualTo(DEFAULT_VERIFIED_BY);
        assertThat(testServiceElementVerificationInfo.getVerifyDate()).isEqualTo(DEFAULT_VERIFY_DATE);
    }

    @Test
    @Transactional
    void createServiceElementVerificationInfoWithExistingId() throws Exception {
        // Create the ServiceElementVerificationInfo with an existing ID
        serviceElementVerificationInfo.setId(1L);

        int databaseSizeBeforeCreate = serviceElementVerificationInfoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restServiceElementVerificationInfoMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceElementVerificationInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceElementVerificationInfo in the database
        List<ServiceElementVerificationInfo> serviceElementVerificationInfoList = serviceElementVerificationInfoRepository.findAll();
        assertThat(serviceElementVerificationInfoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllServiceElementVerificationInfos() throws Exception {
        // Initialize the database
        serviceElementVerificationInfoRepository.saveAndFlush(serviceElementVerificationInfo);

        // Get all the serviceElementVerificationInfoList
        restServiceElementVerificationInfoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(serviceElementVerificationInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].isDepartmentLeading").value(hasItem(DEFAULT_IS_DEPARTMENT_LEADING.booleanValue())))
            .andExpect(jsonPath("$.[*].verifiedBy").value(hasItem(DEFAULT_VERIFIED_BY)))
            .andExpect(jsonPath("$.[*].verifyDate").value(hasItem(DEFAULT_VERIFY_DATE.toString())));
    }

    @Test
    @Transactional
    void getServiceElementVerificationInfo() throws Exception {
        // Initialize the database
        serviceElementVerificationInfoRepository.saveAndFlush(serviceElementVerificationInfo);

        // Get the serviceElementVerificationInfo
        restServiceElementVerificationInfoMockMvc
            .perform(get(ENTITY_API_URL_ID, serviceElementVerificationInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(serviceElementVerificationInfo.getId().intValue()))
            .andExpect(jsonPath("$.isDepartmentLeading").value(DEFAULT_IS_DEPARTMENT_LEADING.booleanValue()))
            .andExpect(jsonPath("$.verifiedBy").value(DEFAULT_VERIFIED_BY))
            .andExpect(jsonPath("$.verifyDate").value(DEFAULT_VERIFY_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingServiceElementVerificationInfo() throws Exception {
        // Get the serviceElementVerificationInfo
        restServiceElementVerificationInfoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingServiceElementVerificationInfo() throws Exception {
        // Initialize the database
        serviceElementVerificationInfoRepository.saveAndFlush(serviceElementVerificationInfo);

        int databaseSizeBeforeUpdate = serviceElementVerificationInfoRepository.findAll().size();

        // Update the serviceElementVerificationInfo
        ServiceElementVerificationInfo updatedServiceElementVerificationInfo = serviceElementVerificationInfoRepository
            .findById(serviceElementVerificationInfo.getId())
            .get();
        // Disconnect from session so that the updates on updatedServiceElementVerificationInfo are not directly saved in db
        em.detach(updatedServiceElementVerificationInfo);
        updatedServiceElementVerificationInfo
            .isDepartmentLeading(UPDATED_IS_DEPARTMENT_LEADING)
            .verifiedBy(UPDATED_VERIFIED_BY)
            .verifyDate(UPDATED_VERIFY_DATE);

        restServiceElementVerificationInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedServiceElementVerificationInfo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedServiceElementVerificationInfo))
            )
            .andExpect(status().isOk());

        // Validate the ServiceElementVerificationInfo in the database
        List<ServiceElementVerificationInfo> serviceElementVerificationInfoList = serviceElementVerificationInfoRepository.findAll();
        assertThat(serviceElementVerificationInfoList).hasSize(databaseSizeBeforeUpdate);
        ServiceElementVerificationInfo testServiceElementVerificationInfo = serviceElementVerificationInfoList.get(
            serviceElementVerificationInfoList.size() - 1
        );
        assertThat(testServiceElementVerificationInfo.getIsDepartmentLeading()).isEqualTo(UPDATED_IS_DEPARTMENT_LEADING);
        assertThat(testServiceElementVerificationInfo.getVerifiedBy()).isEqualTo(UPDATED_VERIFIED_BY);
        assertThat(testServiceElementVerificationInfo.getVerifyDate()).isEqualTo(UPDATED_VERIFY_DATE);
    }

    @Test
    @Transactional
    void putNonExistingServiceElementVerificationInfo() throws Exception {
        int databaseSizeBeforeUpdate = serviceElementVerificationInfoRepository.findAll().size();
        serviceElementVerificationInfo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceElementVerificationInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, serviceElementVerificationInfo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceElementVerificationInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceElementVerificationInfo in the database
        List<ServiceElementVerificationInfo> serviceElementVerificationInfoList = serviceElementVerificationInfoRepository.findAll();
        assertThat(serviceElementVerificationInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchServiceElementVerificationInfo() throws Exception {
        int databaseSizeBeforeUpdate = serviceElementVerificationInfoRepository.findAll().size();
        serviceElementVerificationInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceElementVerificationInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceElementVerificationInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceElementVerificationInfo in the database
        List<ServiceElementVerificationInfo> serviceElementVerificationInfoList = serviceElementVerificationInfoRepository.findAll();
        assertThat(serviceElementVerificationInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamServiceElementVerificationInfo() throws Exception {
        int databaseSizeBeforeUpdate = serviceElementVerificationInfoRepository.findAll().size();
        serviceElementVerificationInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceElementVerificationInfoMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceElementVerificationInfo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceElementVerificationInfo in the database
        List<ServiceElementVerificationInfo> serviceElementVerificationInfoList = serviceElementVerificationInfoRepository.findAll();
        assertThat(serviceElementVerificationInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateServiceElementVerificationInfoWithPatch() throws Exception {
        // Initialize the database
        serviceElementVerificationInfoRepository.saveAndFlush(serviceElementVerificationInfo);

        int databaseSizeBeforeUpdate = serviceElementVerificationInfoRepository.findAll().size();

        // Update the serviceElementVerificationInfo using partial update
        ServiceElementVerificationInfo partialUpdatedServiceElementVerificationInfo = new ServiceElementVerificationInfo();
        partialUpdatedServiceElementVerificationInfo.setId(serviceElementVerificationInfo.getId());

        partialUpdatedServiceElementVerificationInfo
            .isDepartmentLeading(UPDATED_IS_DEPARTMENT_LEADING)
            .verifiedBy(UPDATED_VERIFIED_BY)
            .verifyDate(UPDATED_VERIFY_DATE);

        restServiceElementVerificationInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceElementVerificationInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceElementVerificationInfo))
            )
            .andExpect(status().isOk());

        // Validate the ServiceElementVerificationInfo in the database
        List<ServiceElementVerificationInfo> serviceElementVerificationInfoList = serviceElementVerificationInfoRepository.findAll();
        assertThat(serviceElementVerificationInfoList).hasSize(databaseSizeBeforeUpdate);
        ServiceElementVerificationInfo testServiceElementVerificationInfo = serviceElementVerificationInfoList.get(
            serviceElementVerificationInfoList.size() - 1
        );
        assertThat(testServiceElementVerificationInfo.getIsDepartmentLeading()).isEqualTo(UPDATED_IS_DEPARTMENT_LEADING);
        assertThat(testServiceElementVerificationInfo.getVerifiedBy()).isEqualTo(UPDATED_VERIFIED_BY);
        assertThat(testServiceElementVerificationInfo.getVerifyDate()).isEqualTo(UPDATED_VERIFY_DATE);
    }

    @Test
    @Transactional
    void fullUpdateServiceElementVerificationInfoWithPatch() throws Exception {
        // Initialize the database
        serviceElementVerificationInfoRepository.saveAndFlush(serviceElementVerificationInfo);

        int databaseSizeBeforeUpdate = serviceElementVerificationInfoRepository.findAll().size();

        // Update the serviceElementVerificationInfo using partial update
        ServiceElementVerificationInfo partialUpdatedServiceElementVerificationInfo = new ServiceElementVerificationInfo();
        partialUpdatedServiceElementVerificationInfo.setId(serviceElementVerificationInfo.getId());

        partialUpdatedServiceElementVerificationInfo
            .isDepartmentLeading(UPDATED_IS_DEPARTMENT_LEADING)
            .verifiedBy(UPDATED_VERIFIED_BY)
            .verifyDate(UPDATED_VERIFY_DATE);

        restServiceElementVerificationInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceElementVerificationInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceElementVerificationInfo))
            )
            .andExpect(status().isOk());

        // Validate the ServiceElementVerificationInfo in the database
        List<ServiceElementVerificationInfo> serviceElementVerificationInfoList = serviceElementVerificationInfoRepository.findAll();
        assertThat(serviceElementVerificationInfoList).hasSize(databaseSizeBeforeUpdate);
        ServiceElementVerificationInfo testServiceElementVerificationInfo = serviceElementVerificationInfoList.get(
            serviceElementVerificationInfoList.size() - 1
        );
        assertThat(testServiceElementVerificationInfo.getIsDepartmentLeading()).isEqualTo(UPDATED_IS_DEPARTMENT_LEADING);
        assertThat(testServiceElementVerificationInfo.getVerifiedBy()).isEqualTo(UPDATED_VERIFIED_BY);
        assertThat(testServiceElementVerificationInfo.getVerifyDate()).isEqualTo(UPDATED_VERIFY_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingServiceElementVerificationInfo() throws Exception {
        int databaseSizeBeforeUpdate = serviceElementVerificationInfoRepository.findAll().size();
        serviceElementVerificationInfo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceElementVerificationInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, serviceElementVerificationInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceElementVerificationInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceElementVerificationInfo in the database
        List<ServiceElementVerificationInfo> serviceElementVerificationInfoList = serviceElementVerificationInfoRepository.findAll();
        assertThat(serviceElementVerificationInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchServiceElementVerificationInfo() throws Exception {
        int databaseSizeBeforeUpdate = serviceElementVerificationInfoRepository.findAll().size();
        serviceElementVerificationInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceElementVerificationInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceElementVerificationInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceElementVerificationInfo in the database
        List<ServiceElementVerificationInfo> serviceElementVerificationInfoList = serviceElementVerificationInfoRepository.findAll();
        assertThat(serviceElementVerificationInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamServiceElementVerificationInfo() throws Exception {
        int databaseSizeBeforeUpdate = serviceElementVerificationInfoRepository.findAll().size();
        serviceElementVerificationInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceElementVerificationInfoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceElementVerificationInfo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceElementVerificationInfo in the database
        List<ServiceElementVerificationInfo> serviceElementVerificationInfoList = serviceElementVerificationInfoRepository.findAll();
        assertThat(serviceElementVerificationInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteServiceElementVerificationInfo() throws Exception {
        // Initialize the database
        serviceElementVerificationInfoRepository.saveAndFlush(serviceElementVerificationInfo);

        int databaseSizeBeforeDelete = serviceElementVerificationInfoRepository.findAll().size();

        // Delete the serviceElementVerificationInfo
        restServiceElementVerificationInfoMockMvc
            .perform(delete(ENTITY_API_URL_ID, serviceElementVerificationInfo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ServiceElementVerificationInfo> serviceElementVerificationInfoList = serviceElementVerificationInfoRepository.findAll();
        assertThat(serviceElementVerificationInfoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
