package pl.jswits.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import pl.jswits.domain.enumeration.StatusOfServiceCard;

/**
 * A InternalService.
 */
@Entity
@Table(name = "internal_service")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class InternalService implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "symbol")
    private String symbol;

    @Column(name = "functional_description")
    private String functionalDescription;

    @Column(name = "service_comissions")
    private String serviceComissions;

    @Column(name = "exclusions")
    private String exclusions;

    @Column(name = "duties_and_responsibilities")
    private String dutiesAndResponsibilities;

    @Column(name = "person_responsible_for_service")
    private String personResponsibleForService;

    @Column(name = "hours_of_service")
    private String hoursOfService;

    @Column(name = "service_activating_cost")
    private String serviceActivatingCost;

    @Column(name = "price_list_of_service")
    private String priceListOfService;

    @Column(name = "notes")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusOfServiceCard status;

    @Column(name = "critical_service")
    private Boolean criticalService;

    @Column(name = "guaranteed_levels_of_provision_of_service")
    private String guaranteedLevelsOfProvisionOfService;

    @Column(name = "period_of_provision_of_service")
    private String periodOfProvisionOfService;

    @Column(name = "window_of_service")
    private String windowOfService;

    @Column(name = "level_of_accessibility")
    private String levelOfAccessibility;

    @Column(name = "plan_disaster_recovery")
    private String planDisasterRecovery;

    @Column(name = "r_po")
    private String rPO;

    @Column(name = "r_to")
    private String rTO;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "internalService")
    @JsonIgnoreProperties(value = { "businessService", "internalService" }, allowSetters = true)
    private Set<Parameter> parameters = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "internalService")
    @JsonIgnoreProperties(value = { "businessService", "internalService" }, allowSetters = true)
    private Set<ServiceElement> serviceElements = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "internalService")
    @JsonIgnoreProperties(value = { "internalService" }, allowSetters = true)
    private Set<ExternalCompany> externalCompanies = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "businessServices", "internalServices" }, allowSetters = true)
    private Employee employee;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "internalServices")
    @JsonIgnoreProperties(
        value = { "parameters", "serviceElements", "internalServices", "client", "employee", "department" },
        allowSetters = true
    )
    private Set<BusinessService> businessServices = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public InternalService id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public InternalService name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSymbol() {
        return this.symbol;
    }

    public InternalService symbol(String symbol) {
        this.setSymbol(symbol);
        return this;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getFunctionalDescription() {
        return this.functionalDescription;
    }

    public InternalService functionalDescription(String functionalDescription) {
        this.setFunctionalDescription(functionalDescription);
        return this;
    }

    public void setFunctionalDescription(String functionalDescription) {
        this.functionalDescription = functionalDescription;
    }

    public String getServiceComissions() {
        return this.serviceComissions;
    }

    public InternalService serviceComissions(String serviceComissions) {
        this.setServiceComissions(serviceComissions);
        return this;
    }

    public void setServiceComissions(String serviceComissions) {
        this.serviceComissions = serviceComissions;
    }

    public String getExclusions() {
        return this.exclusions;
    }

    public InternalService exclusions(String exclusions) {
        this.setExclusions(exclusions);
        return this;
    }

    public void setExclusions(String exclusions) {
        this.exclusions = exclusions;
    }

    public String getDutiesAndResponsibilities() {
        return this.dutiesAndResponsibilities;
    }

    public InternalService dutiesAndResponsibilities(String dutiesAndResponsibilities) {
        this.setDutiesAndResponsibilities(dutiesAndResponsibilities);
        return this;
    }

    public void setDutiesAndResponsibilities(String dutiesAndResponsibilities) {
        this.dutiesAndResponsibilities = dutiesAndResponsibilities;
    }

    public String getPersonResponsibleForService() {
        return this.personResponsibleForService;
    }

    public InternalService personResponsibleForService(String personResponsibleForService) {
        this.setPersonResponsibleForService(personResponsibleForService);
        return this;
    }

    public void setPersonResponsibleForService(String personResponsibleForService) {
        this.personResponsibleForService = personResponsibleForService;
    }

    public String getHoursOfService() {
        return this.hoursOfService;
    }

    public InternalService hoursOfService(String hoursOfService) {
        this.setHoursOfService(hoursOfService);
        return this;
    }

    public void setHoursOfService(String hoursOfService) {
        this.hoursOfService = hoursOfService;
    }

    public String getServiceActivatingCost() {
        return this.serviceActivatingCost;
    }

    public InternalService serviceActivatingCost(String serviceActivatingCost) {
        this.setServiceActivatingCost(serviceActivatingCost);
        return this;
    }

    public void setServiceActivatingCost(String serviceActivatingCost) {
        this.serviceActivatingCost = serviceActivatingCost;
    }

    public String getPriceListOfService() {
        return this.priceListOfService;
    }

    public InternalService priceListOfService(String priceListOfService) {
        this.setPriceListOfService(priceListOfService);
        return this;
    }

    public void setPriceListOfService(String priceListOfService) {
        this.priceListOfService = priceListOfService;
    }

    public String getNotes() {
        return this.notes;
    }

    public InternalService notes(String notes) {
        this.setNotes(notes);
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public StatusOfServiceCard getStatus() {
        return this.status;
    }

    public InternalService status(StatusOfServiceCard status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(StatusOfServiceCard status) {
        this.status = status;
    }

    public Boolean getCriticalService() {
        return this.criticalService;
    }

    public InternalService criticalService(Boolean criticalService) {
        this.setCriticalService(criticalService);
        return this;
    }

    public void setCriticalService(Boolean criticalService) {
        this.criticalService = criticalService;
    }

    public String getGuaranteedLevelsOfProvisionOfService() {
        return this.guaranteedLevelsOfProvisionOfService;
    }

    public InternalService guaranteedLevelsOfProvisionOfService(String guaranteedLevelsOfProvisionOfService) {
        this.setGuaranteedLevelsOfProvisionOfService(guaranteedLevelsOfProvisionOfService);
        return this;
    }

    public void setGuaranteedLevelsOfProvisionOfService(String guaranteedLevelsOfProvisionOfService) {
        this.guaranteedLevelsOfProvisionOfService = guaranteedLevelsOfProvisionOfService;
    }

    public String getPeriodOfProvisionOfService() {
        return this.periodOfProvisionOfService;
    }

    public InternalService periodOfProvisionOfService(String periodOfProvisionOfService) {
        this.setPeriodOfProvisionOfService(periodOfProvisionOfService);
        return this;
    }

    public void setPeriodOfProvisionOfService(String periodOfProvisionOfService) {
        this.periodOfProvisionOfService = periodOfProvisionOfService;
    }

    public String getWindowOfService() {
        return this.windowOfService;
    }

    public InternalService windowOfService(String windowOfService) {
        this.setWindowOfService(windowOfService);
        return this;
    }

    public void setWindowOfService(String windowOfService) {
        this.windowOfService = windowOfService;
    }

    public String getLevelOfAccessibility() {
        return this.levelOfAccessibility;
    }

    public InternalService levelOfAccessibility(String levelOfAccessibility) {
        this.setLevelOfAccessibility(levelOfAccessibility);
        return this;
    }

    public void setLevelOfAccessibility(String levelOfAccessibility) {
        this.levelOfAccessibility = levelOfAccessibility;
    }

    public String getPlanDisasterRecovery() {
        return this.planDisasterRecovery;
    }

    public InternalService planDisasterRecovery(String planDisasterRecovery) {
        this.setPlanDisasterRecovery(planDisasterRecovery);
        return this;
    }

    public void setPlanDisasterRecovery(String planDisasterRecovery) {
        this.planDisasterRecovery = planDisasterRecovery;
    }

    public String getrPO() {
        return this.rPO;
    }

    public InternalService rPO(String rPO) {
        this.setrPO(rPO);
        return this;
    }

    public void setrPO(String rPO) {
        this.rPO = rPO;
    }

    public String getrTO() {
        return this.rTO;
    }

    public InternalService rTO(String rTO) {
        this.setrTO(rTO);
        return this;
    }

    public void setrTO(String rTO) {
        this.rTO = rTO;
    }

    public Set<Parameter> getParameters() {
        return this.parameters;
    }

    public void setParameters(Set<Parameter> parameters) {
        if (this.parameters != null) {
            this.parameters.forEach(i -> i.setInternalService(null));
        }
        if (parameters != null) {
            parameters.forEach(i -> i.setInternalService(this));
        }
        this.parameters = parameters;
    }

    public InternalService parameters(Set<Parameter> parameters) {
        this.setParameters(parameters);
        return this;
    }

    public InternalService addParameter(Parameter parameter) {
        this.parameters.add(parameter);
        parameter.setInternalService(this);
        return this;
    }

    public InternalService removeParameter(Parameter parameter) {
        this.parameters.remove(parameter);
        parameter.setInternalService(null);
        return this;
    }

    public Set<ServiceElement> getServiceElements() {
        return this.serviceElements;
    }

    public void setServiceElements(Set<ServiceElement> serviceElements) {
        if (this.serviceElements != null) {
            this.serviceElements.forEach(i -> i.setInternalService(null));
        }
        if (serviceElements != null) {
            serviceElements.forEach(i -> i.setInternalService(this));
        }
        this.serviceElements = serviceElements;
    }

    public InternalService serviceElements(Set<ServiceElement> serviceElements) {
        this.setServiceElements(serviceElements);
        return this;
    }

    public InternalService addServiceElement(ServiceElement serviceElement) {
        this.serviceElements.add(serviceElement);
        serviceElement.setInternalService(this);
        return this;
    }

    public InternalService removeServiceElement(ServiceElement serviceElement) {
        this.serviceElements.remove(serviceElement);
        serviceElement.setInternalService(null);
        return this;
    }

    public Set<ExternalCompany> getExternalCompanies() {
        return this.externalCompanies;
    }

    public void setExternalCompanies(Set<ExternalCompany> externalCompanies) {
        if (this.externalCompanies != null) {
            this.externalCompanies.forEach(i -> i.setInternalService(null));
        }
        if (externalCompanies != null) {
            externalCompanies.forEach(i -> i.setInternalService(this));
        }
        this.externalCompanies = externalCompanies;
    }

    public InternalService externalCompanies(Set<ExternalCompany> externalCompanies) {
        this.setExternalCompanies(externalCompanies);
        return this;
    }

    public InternalService addExternalCompany(ExternalCompany externalCompany) {
        this.externalCompanies.add(externalCompany);
        externalCompany.setInternalService(this);
        return this;
    }

    public InternalService removeExternalCompany(ExternalCompany externalCompany) {
        this.externalCompanies.remove(externalCompany);
        externalCompany.setInternalService(null);
        return this;
    }

    public Employee getEmployee() {
        return this.employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public InternalService employee(Employee employee) {
        this.setEmployee(employee);
        return this;
    }

    public Set<BusinessService> getBusinessServices() {
        return this.businessServices;
    }

    public void setBusinessServices(Set<BusinessService> businessServices) {
        if (this.businessServices != null) {
            this.businessServices.forEach(i -> i.removeInternalService(this));
        }
        if (businessServices != null) {
            businessServices.forEach(i -> i.addInternalService(this));
        }
        this.businessServices = businessServices;
    }

    public InternalService businessServices(Set<BusinessService> businessServices) {
        this.setBusinessServices(businessServices);
        return this;
    }

    public InternalService addBusinessService(BusinessService businessService) {
        this.businessServices.add(businessService);
        businessService.getInternalServices().add(this);
        return this;
    }

    public InternalService removeBusinessService(BusinessService businessService) {
        this.businessServices.remove(businessService);
        businessService.getInternalServices().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof InternalService)) {
            return false;
        }
        return id != null && id.equals(((InternalService) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "InternalService{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", symbol='" + getSymbol() + "'" +
            ", functionalDescription='" + getFunctionalDescription() + "'" +
            ", serviceComissions='" + getServiceComissions() + "'" +
            ", exclusions='" + getExclusions() + "'" +
            ", dutiesAndResponsibilities='" + getDutiesAndResponsibilities() + "'" +
            ", personResponsibleForService='" + getPersonResponsibleForService() + "'" +
            ", hoursOfService='" + getHoursOfService() + "'" +
            ", serviceActivatingCost='" + getServiceActivatingCost() + "'" +
            ", priceListOfService='" + getPriceListOfService() + "'" +
            ", notes='" + getNotes() + "'" +
            ", status='" + getStatus() + "'" +
            ", criticalService='" + getCriticalService() + "'" +
            ", guaranteedLevelsOfProvisionOfService='" + getGuaranteedLevelsOfProvisionOfService() + "'" +
            ", periodOfProvisionOfService='" + getPeriodOfProvisionOfService() + "'" +
            ", windowOfService='" + getWindowOfService() + "'" +
            ", levelOfAccessibility='" + getLevelOfAccessibility() + "'" +
            ", planDisasterRecovery='" + getPlanDisasterRecovery() + "'" +
            ", rPO='" + getrPO() + "'" +
            ", rTO='" + getrTO() + "'" +
            "}";
    }
}
