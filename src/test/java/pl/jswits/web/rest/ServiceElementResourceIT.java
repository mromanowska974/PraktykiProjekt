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
import pl.jswits.domain.ServiceElement;
import pl.jswits.domain.enumeration.PaymentType;
import pl.jswits.domain.enumeration.StatusOfServiceElement;
import pl.jswits.repository.ServiceElementRepository;

/**
 * Integration tests for the {@link ServiceElementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ServiceElementResourceIT {

    private static final Float DEFAULT_PRICE = 1F;
    private static final Float UPDATED_PRICE = 2F;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_VALUATION_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_VALUATION_NUMBER = "BBBBBBBBBB";

    private static final PaymentType DEFAULT_PAYMENT_TYPE = PaymentType.DISPOSABLE;
    private static final PaymentType UPDATED_PAYMENT_TYPE = PaymentType.MONTHLY;

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_PERIOD_OF_PROVISION_OF_SERVICE_IN_MONTHS = 1;
    private static final Integer UPDATED_PERIOD_OF_PROVISION_OF_SERVICE_IN_MONTHS = 2;

    private static final String DEFAULT_TYPE_OF_PERIOD_OF_PROVISION_OF_SERVICE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE_OF_PERIOD_OF_PROVISION_OF_SERVICE = "BBBBBBBBBB";

    private static final Instant DEFAULT_END_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final StatusOfServiceElement DEFAULT_STATUS = StatusOfServiceElement.ACTIVE;
    private static final StatusOfServiceElement UPDATED_STATUS = StatusOfServiceElement.NOT_ACTIVE;

    private static final String DEFAULT_BMC_REGISTRATION = "AAAAAAAAAA";
    private static final String UPDATED_BMC_REGISTRATION = "BBBBBBBBBB";

    private static final Float DEFAULT_PRICE_FROM_CALCULATION = 1F;
    private static final Float UPDATED_PRICE_FROM_CALCULATION = 2F;

    private static final Instant DEFAULT_EXPIRATION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_EXPIRATION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/service-elements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ServiceElementRepository serviceElementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restServiceElementMockMvc;

    private ServiceElement serviceElement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceElement createEntity(EntityManager em) {
        ServiceElement serviceElement = new ServiceElement()
            .price(DEFAULT_PRICE)
            .description(DEFAULT_DESCRIPTION)
            .valuationNumber(DEFAULT_VALUATION_NUMBER)
            .paymentType(DEFAULT_PAYMENT_TYPE)
            .startDate(DEFAULT_START_DATE)
            .periodOfProvisionOfServiceInMonths(DEFAULT_PERIOD_OF_PROVISION_OF_SERVICE_IN_MONTHS)
            .typeOfPeriodOfProvisionOfService(DEFAULT_TYPE_OF_PERIOD_OF_PROVISION_OF_SERVICE)
            .endDate(DEFAULT_END_DATE)
            .status(DEFAULT_STATUS)
            .bmcRegistration(DEFAULT_BMC_REGISTRATION)
            .priceFromCalculation(DEFAULT_PRICE_FROM_CALCULATION)
            .expirationDate(DEFAULT_EXPIRATION_DATE);
        return serviceElement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceElement createUpdatedEntity(EntityManager em) {
        ServiceElement serviceElement = new ServiceElement()
            .price(UPDATED_PRICE)
            .description(UPDATED_DESCRIPTION)
            .valuationNumber(UPDATED_VALUATION_NUMBER)
            .paymentType(UPDATED_PAYMENT_TYPE)
            .startDate(UPDATED_START_DATE)
            .periodOfProvisionOfServiceInMonths(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE_IN_MONTHS)
            .typeOfPeriodOfProvisionOfService(UPDATED_TYPE_OF_PERIOD_OF_PROVISION_OF_SERVICE)
            .endDate(UPDATED_END_DATE)
            .status(UPDATED_STATUS)
            .bmcRegistration(UPDATED_BMC_REGISTRATION)
            .priceFromCalculation(UPDATED_PRICE_FROM_CALCULATION)
            .expirationDate(UPDATED_EXPIRATION_DATE);
        return serviceElement;
    }

    @BeforeEach
    public void initTest() {
        serviceElement = createEntity(em);
    }

    @Test
    @Transactional
    void createServiceElement() throws Exception {
        int databaseSizeBeforeCreate = serviceElementRepository.findAll().size();
        // Create the ServiceElement
        restServiceElementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(serviceElement))
            )
            .andExpect(status().isCreated());

        // Validate the ServiceElement in the database
        List<ServiceElement> serviceElementList = serviceElementRepository.findAll();
        assertThat(serviceElementList).hasSize(databaseSizeBeforeCreate + 1);
        ServiceElement testServiceElement = serviceElementList.get(serviceElementList.size() - 1);
        assertThat(testServiceElement.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testServiceElement.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testServiceElement.getValuationNumber()).isEqualTo(DEFAULT_VALUATION_NUMBER);
        assertThat(testServiceElement.getPaymentType()).isEqualTo(DEFAULT_PAYMENT_TYPE);
        assertThat(testServiceElement.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testServiceElement.getPeriodOfProvisionOfServiceInMonths()).isEqualTo(DEFAULT_PERIOD_OF_PROVISION_OF_SERVICE_IN_MONTHS);
        assertThat(testServiceElement.getTypeOfPeriodOfProvisionOfService()).isEqualTo(DEFAULT_TYPE_OF_PERIOD_OF_PROVISION_OF_SERVICE);
        assertThat(testServiceElement.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testServiceElement.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testServiceElement.getBmcRegistration()).isEqualTo(DEFAULT_BMC_REGISTRATION);
        assertThat(testServiceElement.getPriceFromCalculation()).isEqualTo(DEFAULT_PRICE_FROM_CALCULATION);
        assertThat(testServiceElement.getExpirationDate()).isEqualTo(DEFAULT_EXPIRATION_DATE);
    }

    @Test
    @Transactional
    void createServiceElementWithExistingId() throws Exception {
        // Create the ServiceElement with an existing ID
        serviceElement.setId(1L);

        int databaseSizeBeforeCreate = serviceElementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restServiceElementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(serviceElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceElement in the database
        List<ServiceElement> serviceElementList = serviceElementRepository.findAll();
        assertThat(serviceElementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllServiceElements() throws Exception {
        // Initialize the database
        serviceElementRepository.saveAndFlush(serviceElement);

        // Get all the serviceElementList
        restServiceElementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(serviceElement.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].valuationNumber").value(hasItem(DEFAULT_VALUATION_NUMBER)))
            .andExpect(jsonPath("$.[*].paymentType").value(hasItem(DEFAULT_PAYMENT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(
                jsonPath("$.[*].periodOfProvisionOfServiceInMonths").value(hasItem(DEFAULT_PERIOD_OF_PROVISION_OF_SERVICE_IN_MONTHS))
            )
            .andExpect(jsonPath("$.[*].typeOfPeriodOfProvisionOfService").value(hasItem(DEFAULT_TYPE_OF_PERIOD_OF_PROVISION_OF_SERVICE)))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].bmcRegistration").value(hasItem(DEFAULT_BMC_REGISTRATION)))
            .andExpect(jsonPath("$.[*].priceFromCalculation").value(hasItem(DEFAULT_PRICE_FROM_CALCULATION.doubleValue())))
            .andExpect(jsonPath("$.[*].expirationDate").value(hasItem(DEFAULT_EXPIRATION_DATE.toString())));
    }

    @Test
    @Transactional
    void getServiceElement() throws Exception {
        // Initialize the database
        serviceElementRepository.saveAndFlush(serviceElement);

        // Get the serviceElement
        restServiceElementMockMvc
            .perform(get(ENTITY_API_URL_ID, serviceElement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(serviceElement.getId().intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.valuationNumber").value(DEFAULT_VALUATION_NUMBER))
            .andExpect(jsonPath("$.paymentType").value(DEFAULT_PAYMENT_TYPE.toString()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.periodOfProvisionOfServiceInMonths").value(DEFAULT_PERIOD_OF_PROVISION_OF_SERVICE_IN_MONTHS))
            .andExpect(jsonPath("$.typeOfPeriodOfProvisionOfService").value(DEFAULT_TYPE_OF_PERIOD_OF_PROVISION_OF_SERVICE))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.bmcRegistration").value(DEFAULT_BMC_REGISTRATION))
            .andExpect(jsonPath("$.priceFromCalculation").value(DEFAULT_PRICE_FROM_CALCULATION.doubleValue()))
            .andExpect(jsonPath("$.expirationDate").value(DEFAULT_EXPIRATION_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingServiceElement() throws Exception {
        // Get the serviceElement
        restServiceElementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingServiceElement() throws Exception {
        // Initialize the database
        serviceElementRepository.saveAndFlush(serviceElement);

        int databaseSizeBeforeUpdate = serviceElementRepository.findAll().size();

        // Update the serviceElement
        ServiceElement updatedServiceElement = serviceElementRepository.findById(serviceElement.getId()).get();
        // Disconnect from session so that the updates on updatedServiceElement are not directly saved in db
        em.detach(updatedServiceElement);
        updatedServiceElement
            .price(UPDATED_PRICE)
            .description(UPDATED_DESCRIPTION)
            .valuationNumber(UPDATED_VALUATION_NUMBER)
            .paymentType(UPDATED_PAYMENT_TYPE)
            .startDate(UPDATED_START_DATE)
            .periodOfProvisionOfServiceInMonths(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE_IN_MONTHS)
            .typeOfPeriodOfProvisionOfService(UPDATED_TYPE_OF_PERIOD_OF_PROVISION_OF_SERVICE)
            .endDate(UPDATED_END_DATE)
            .status(UPDATED_STATUS)
            .bmcRegistration(UPDATED_BMC_REGISTRATION)
            .priceFromCalculation(UPDATED_PRICE_FROM_CALCULATION)
            .expirationDate(UPDATED_EXPIRATION_DATE);

        restServiceElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedServiceElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedServiceElement))
            )
            .andExpect(status().isOk());

        // Validate the ServiceElement in the database
        List<ServiceElement> serviceElementList = serviceElementRepository.findAll();
        assertThat(serviceElementList).hasSize(databaseSizeBeforeUpdate);
        ServiceElement testServiceElement = serviceElementList.get(serviceElementList.size() - 1);
        assertThat(testServiceElement.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testServiceElement.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testServiceElement.getValuationNumber()).isEqualTo(UPDATED_VALUATION_NUMBER);
        assertThat(testServiceElement.getPaymentType()).isEqualTo(UPDATED_PAYMENT_TYPE);
        assertThat(testServiceElement.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testServiceElement.getPeriodOfProvisionOfServiceInMonths()).isEqualTo(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE_IN_MONTHS);
        assertThat(testServiceElement.getTypeOfPeriodOfProvisionOfService()).isEqualTo(UPDATED_TYPE_OF_PERIOD_OF_PROVISION_OF_SERVICE);
        assertThat(testServiceElement.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testServiceElement.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testServiceElement.getBmcRegistration()).isEqualTo(UPDATED_BMC_REGISTRATION);
        assertThat(testServiceElement.getPriceFromCalculation()).isEqualTo(UPDATED_PRICE_FROM_CALCULATION);
        assertThat(testServiceElement.getExpirationDate()).isEqualTo(UPDATED_EXPIRATION_DATE);
    }

    @Test
    @Transactional
    void putNonExistingServiceElement() throws Exception {
        int databaseSizeBeforeUpdate = serviceElementRepository.findAll().size();
        serviceElement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, serviceElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceElement in the database
        List<ServiceElement> serviceElementList = serviceElementRepository.findAll();
        assertThat(serviceElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchServiceElement() throws Exception {
        int databaseSizeBeforeUpdate = serviceElementRepository.findAll().size();
        serviceElement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceElement in the database
        List<ServiceElement> serviceElementList = serviceElementRepository.findAll();
        assertThat(serviceElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamServiceElement() throws Exception {
        int databaseSizeBeforeUpdate = serviceElementRepository.findAll().size();
        serviceElement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceElementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(serviceElement)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceElement in the database
        List<ServiceElement> serviceElementList = serviceElementRepository.findAll();
        assertThat(serviceElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateServiceElementWithPatch() throws Exception {
        // Initialize the database
        serviceElementRepository.saveAndFlush(serviceElement);

        int databaseSizeBeforeUpdate = serviceElementRepository.findAll().size();

        // Update the serviceElement using partial update
        ServiceElement partialUpdatedServiceElement = new ServiceElement();
        partialUpdatedServiceElement.setId(serviceElement.getId());

        partialUpdatedServiceElement
            .description(UPDATED_DESCRIPTION)
            .valuationNumber(UPDATED_VALUATION_NUMBER)
            .periodOfProvisionOfServiceInMonths(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE_IN_MONTHS)
            .endDate(UPDATED_END_DATE)
            .priceFromCalculation(UPDATED_PRICE_FROM_CALCULATION)
            .expirationDate(UPDATED_EXPIRATION_DATE);

        restServiceElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceElement))
            )
            .andExpect(status().isOk());

        // Validate the ServiceElement in the database
        List<ServiceElement> serviceElementList = serviceElementRepository.findAll();
        assertThat(serviceElementList).hasSize(databaseSizeBeforeUpdate);
        ServiceElement testServiceElement = serviceElementList.get(serviceElementList.size() - 1);
        assertThat(testServiceElement.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testServiceElement.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testServiceElement.getValuationNumber()).isEqualTo(UPDATED_VALUATION_NUMBER);
        assertThat(testServiceElement.getPaymentType()).isEqualTo(DEFAULT_PAYMENT_TYPE);
        assertThat(testServiceElement.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testServiceElement.getPeriodOfProvisionOfServiceInMonths()).isEqualTo(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE_IN_MONTHS);
        assertThat(testServiceElement.getTypeOfPeriodOfProvisionOfService()).isEqualTo(DEFAULT_TYPE_OF_PERIOD_OF_PROVISION_OF_SERVICE);
        assertThat(testServiceElement.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testServiceElement.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testServiceElement.getBmcRegistration()).isEqualTo(DEFAULT_BMC_REGISTRATION);
        assertThat(testServiceElement.getPriceFromCalculation()).isEqualTo(UPDATED_PRICE_FROM_CALCULATION);
        assertThat(testServiceElement.getExpirationDate()).isEqualTo(UPDATED_EXPIRATION_DATE);
    }

    @Test
    @Transactional
    void fullUpdateServiceElementWithPatch() throws Exception {
        // Initialize the database
        serviceElementRepository.saveAndFlush(serviceElement);

        int databaseSizeBeforeUpdate = serviceElementRepository.findAll().size();

        // Update the serviceElement using partial update
        ServiceElement partialUpdatedServiceElement = new ServiceElement();
        partialUpdatedServiceElement.setId(serviceElement.getId());

        partialUpdatedServiceElement
            .price(UPDATED_PRICE)
            .description(UPDATED_DESCRIPTION)
            .valuationNumber(UPDATED_VALUATION_NUMBER)
            .paymentType(UPDATED_PAYMENT_TYPE)
            .startDate(UPDATED_START_DATE)
            .periodOfProvisionOfServiceInMonths(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE_IN_MONTHS)
            .typeOfPeriodOfProvisionOfService(UPDATED_TYPE_OF_PERIOD_OF_PROVISION_OF_SERVICE)
            .endDate(UPDATED_END_DATE)
            .status(UPDATED_STATUS)
            .bmcRegistration(UPDATED_BMC_REGISTRATION)
            .priceFromCalculation(UPDATED_PRICE_FROM_CALCULATION)
            .expirationDate(UPDATED_EXPIRATION_DATE);

        restServiceElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceElement))
            )
            .andExpect(status().isOk());

        // Validate the ServiceElement in the database
        List<ServiceElement> serviceElementList = serviceElementRepository.findAll();
        assertThat(serviceElementList).hasSize(databaseSizeBeforeUpdate);
        ServiceElement testServiceElement = serviceElementList.get(serviceElementList.size() - 1);
        assertThat(testServiceElement.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testServiceElement.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testServiceElement.getValuationNumber()).isEqualTo(UPDATED_VALUATION_NUMBER);
        assertThat(testServiceElement.getPaymentType()).isEqualTo(UPDATED_PAYMENT_TYPE);
        assertThat(testServiceElement.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testServiceElement.getPeriodOfProvisionOfServiceInMonths()).isEqualTo(UPDATED_PERIOD_OF_PROVISION_OF_SERVICE_IN_MONTHS);
        assertThat(testServiceElement.getTypeOfPeriodOfProvisionOfService()).isEqualTo(UPDATED_TYPE_OF_PERIOD_OF_PROVISION_OF_SERVICE);
        assertThat(testServiceElement.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testServiceElement.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testServiceElement.getBmcRegistration()).isEqualTo(UPDATED_BMC_REGISTRATION);
        assertThat(testServiceElement.getPriceFromCalculation()).isEqualTo(UPDATED_PRICE_FROM_CALCULATION);
        assertThat(testServiceElement.getExpirationDate()).isEqualTo(UPDATED_EXPIRATION_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingServiceElement() throws Exception {
        int databaseSizeBeforeUpdate = serviceElementRepository.findAll().size();
        serviceElement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, serviceElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceElement in the database
        List<ServiceElement> serviceElementList = serviceElementRepository.findAll();
        assertThat(serviceElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchServiceElement() throws Exception {
        int databaseSizeBeforeUpdate = serviceElementRepository.findAll().size();
        serviceElement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceElement in the database
        List<ServiceElement> serviceElementList = serviceElementRepository.findAll();
        assertThat(serviceElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamServiceElement() throws Exception {
        int databaseSizeBeforeUpdate = serviceElementRepository.findAll().size();
        serviceElement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceElementMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(serviceElement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceElement in the database
        List<ServiceElement> serviceElementList = serviceElementRepository.findAll();
        assertThat(serviceElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteServiceElement() throws Exception {
        // Initialize the database
        serviceElementRepository.saveAndFlush(serviceElement);

        int databaseSizeBeforeDelete = serviceElementRepository.findAll().size();

        // Delete the serviceElement
        restServiceElementMockMvc
            .perform(delete(ENTITY_API_URL_ID, serviceElement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ServiceElement> serviceElementList = serviceElementRepository.findAll();
        assertThat(serviceElementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
