package pl.jswits.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import pl.jswits.domain.enumeration.PaymentType;
import pl.jswits.domain.enumeration.StatusOfServiceElement;
import pl.jswits.domain.enumeration.TypeOfPeriodOfProvisionOfService;

/**
 * A ServiceElement.
 */
@Entity
@Table(name = "service_element")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ServiceElement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "price")
    private Float price;

    @Column(name = "description")
    private String description;

    @Column(name = "valuation_number")
    private String valuationNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type")
    private PaymentType paymentType;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "period_of_provision_of_service_in_months")
    private Integer periodOfProvisionOfServiceInMonths;

    @Column(name = "end_date")
    private Instant endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusOfServiceElement status;

    @Column(name = "bmc_registration")
    private String bmcRegistration;

    @Column(name = "price_from_calculation")
    private Float priceFromCalculation;

    @Column(name = "expiration_date")
    private Instant expirationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_of_period_of_provision_of_service")
    private TypeOfPeriodOfProvisionOfService typeOfPeriodOfProvisionOfService;

    @Column(name = "offer_location_link")
    private String offerLocationLink;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(
        value = { "parameters", "serviceElements", "internalServices", "client", "employee", "department" },
        allowSetters = true
    )
    private BusinessService businessService;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(
        value = { "parameters", "serviceElements", "externalCompanies", "employee", "businessServices" },
        allowSetters = true
    )
    private InternalService internalService;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "serviceElement")
    @JsonIgnoreProperties(value = { "department", "serviceElement" }, allowSetters = true)
    private Set<ServiceElementVerificationInfo> serviceElementVerificationInfos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ServiceElement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getPrice() {
        return this.price;
    }

    public ServiceElement price(Float price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public String getDescription() {
        return this.description;
    }

    public ServiceElement description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getValuationNumber() {
        return this.valuationNumber;
    }

    public ServiceElement valuationNumber(String valuationNumber) {
        this.setValuationNumber(valuationNumber);
        return this;
    }

    public void setValuationNumber(String valuationNumber) {
        this.valuationNumber = valuationNumber;
    }

    public PaymentType getPaymentType() {
        return this.paymentType;
    }

    public ServiceElement paymentType(PaymentType paymentType) {
        this.setPaymentType(paymentType);
        return this;
    }

    public void setPaymentType(PaymentType paymentType) {
        this.paymentType = paymentType;
    }

    public Instant getStartDate() {
        return this.startDate;
    }

    public ServiceElement startDate(Instant startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Integer getPeriodOfProvisionOfServiceInMonths() {
        return this.periodOfProvisionOfServiceInMonths;
    }

    public ServiceElement periodOfProvisionOfServiceInMonths(Integer periodOfProvisionOfServiceInMonths) {
        this.setPeriodOfProvisionOfServiceInMonths(periodOfProvisionOfServiceInMonths);
        return this;
    }

    public void setPeriodOfProvisionOfServiceInMonths(Integer periodOfProvisionOfServiceInMonths) {
        this.periodOfProvisionOfServiceInMonths = periodOfProvisionOfServiceInMonths;
    }

    public Instant getEndDate() {
        return this.endDate;
    }

    public ServiceElement endDate(Instant endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public StatusOfServiceElement getStatus() {
        return this.status;
    }

    public ServiceElement status(StatusOfServiceElement status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(StatusOfServiceElement status) {
        this.status = status;
    }

    public String getBmcRegistration() {
        return this.bmcRegistration;
    }

    public ServiceElement bmcRegistration(String bmcRegistration) {
        this.setBmcRegistration(bmcRegistration);
        return this;
    }

    public void setBmcRegistration(String bmcRegistration) {
        this.bmcRegistration = bmcRegistration;
    }

    public Float getPriceFromCalculation() {
        return this.priceFromCalculation;
    }

    public ServiceElement priceFromCalculation(Float priceFromCalculation) {
        this.setPriceFromCalculation(priceFromCalculation);
        return this;
    }

    public void setPriceFromCalculation(Float priceFromCalculation) {
        this.priceFromCalculation = priceFromCalculation;
    }

    public Instant getExpirationDate() {
        return this.expirationDate;
    }

    public ServiceElement expirationDate(Instant expirationDate) {
        this.setExpirationDate(expirationDate);
        return this;
    }

    public void setExpirationDate(Instant expirationDate) {
        this.expirationDate = expirationDate;
    }

    public TypeOfPeriodOfProvisionOfService getTypeOfPeriodOfProvisionOfService() {
        return this.typeOfPeriodOfProvisionOfService;
    }

    public ServiceElement typeOfPeriodOfProvisionOfService(TypeOfPeriodOfProvisionOfService typeOfPeriodOfProvisionOfService) {
        this.setTypeOfPeriodOfProvisionOfService(typeOfPeriodOfProvisionOfService);
        return this;
    }

    public void setTypeOfPeriodOfProvisionOfService(TypeOfPeriodOfProvisionOfService typeOfPeriodOfProvisionOfService) {
        this.typeOfPeriodOfProvisionOfService = typeOfPeriodOfProvisionOfService;
    }

    public String getOfferLocationLink() {
        return this.offerLocationLink;
    }

    public ServiceElement offerLocationLink(String offerLocationLink) {
        this.setOfferLocationLink(offerLocationLink);
        return this;
    }

    public void setOfferLocationLink(String offerLocationLink) {
        this.offerLocationLink = offerLocationLink;
    }

    public BusinessService getBusinessService() {
        return this.businessService;
    }

    public void setBusinessService(BusinessService businessService) {
        this.businessService = businessService;
    }

    public ServiceElement businessService(BusinessService businessService) {
        this.setBusinessService(businessService);
        return this;
    }

    public InternalService getInternalService() {
        return this.internalService;
    }

    public void setInternalService(InternalService internalService) {
        this.internalService = internalService;
    }

    public ServiceElement internalService(InternalService internalService) {
        this.setInternalService(internalService);
        return this;
    }

    public Set<ServiceElementVerificationInfo> getServiceElementVerificationInfos() {
        return this.serviceElementVerificationInfos;
    }

    public void setServiceElementVerificationInfos(Set<ServiceElementVerificationInfo> serviceElementVerificationInfos) {
        if (this.serviceElementVerificationInfos != null) {
            this.serviceElementVerificationInfos.forEach(i -> i.setServiceElement(null));
        }
        if (serviceElementVerificationInfos != null) {
            serviceElementVerificationInfos.forEach(i -> i.setServiceElement(this));
        }
        this.serviceElementVerificationInfos = serviceElementVerificationInfos;
    }

    public ServiceElement serviceElementVerificationInfos(Set<ServiceElementVerificationInfo> serviceElementVerificationInfos) {
        this.setServiceElementVerificationInfos(serviceElementVerificationInfos);
        return this;
    }

    public ServiceElement addServiceElementVerificationInfo(ServiceElementVerificationInfo serviceElementVerificationInfo) {
        this.serviceElementVerificationInfos.add(serviceElementVerificationInfo);
        serviceElementVerificationInfo.setServiceElement(this);
        return this;
    }

    public ServiceElement removeServiceElementVerificationInfo(ServiceElementVerificationInfo serviceElementVerificationInfo) {
        this.serviceElementVerificationInfos.remove(serviceElementVerificationInfo);
        serviceElementVerificationInfo.setServiceElement(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ServiceElement)) {
            return false;
        }
        return id != null && id.equals(((ServiceElement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ServiceElement{" +
            "id=" + getId() +
            ", price=" + getPrice() +
            ", description='" + getDescription() + "'" +
            ", valuationNumber='" + getValuationNumber() + "'" +
            ", paymentType='" + getPaymentType() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", periodOfProvisionOfServiceInMonths=" + getPeriodOfProvisionOfServiceInMonths() +
            ", endDate='" + getEndDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", bmcRegistration='" + getBmcRegistration() + "'" +
            ", priceFromCalculation=" + getPriceFromCalculation() +
            ", expirationDate='" + getExpirationDate() + "'" +
            ", typeOfPeriodOfProvisionOfService='" + getTypeOfPeriodOfProvisionOfService() + "'" +
            ", offerLocationLink='" + getOfferLocationLink() + "'" +
            "}";
    }
}
