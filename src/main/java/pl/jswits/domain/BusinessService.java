package pl.jswits.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import pl.jswits.domain.enumeration.StatusOfServiceElement;

/**
 * A BusinessService.
 */
@Entity
@Table(name = "business_service")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BusinessService implements Serializable {

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
    private StatusOfServiceElement status;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "businessService")
    @JsonIgnoreProperties(value = { "businessService", "internalService" }, allowSetters = true)
    private Set<Parameter> parameters = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "businessService")
    @JsonIgnoreProperties(value = { "businessService", "internalService" }, allowSetters = true)
    private Set<ServiceElement> serviceElements = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_business_service__internal_service",
        joinColumns = @JoinColumn(name = "business_service_id"),
        inverseJoinColumns = @JoinColumn(name = "internal_service_id")
    )
    @JsonIgnoreProperties(
        value = { "parameters", "serviceElements", "externalCompanies", "employee", "businessServices" },
        allowSetters = true
    )
    private Set<InternalService> internalServices = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "businessServices" }, allowSetters = true)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "businessServices", "internalServices" }, allowSetters = true)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "businessServices" }, allowSetters = true)
    private Department department;

    public BusinessService(
        String name,
        String symbol,
        Set<InternalService> internalServices,
        Client client,
        Employee employee,
        Department department
    ) {
        this.name = name;
        this.symbol = symbol;
        this.internalServices = internalServices;
        this.client = client;
        this.employee = employee;
        this.department = department;
    }

    public BusinessService() {}

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BusinessService id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public BusinessService name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSymbol() {
        return this.symbol;
    }

    public BusinessService symbol(String symbol) {
        this.setSymbol(symbol);
        return this;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getFunctionalDescription() {
        return this.functionalDescription;
    }

    public BusinessService functionalDescription(String functionalDescription) {
        this.setFunctionalDescription(functionalDescription);
        return this;
    }

    public void setFunctionalDescription(String functionalDescription) {
        this.functionalDescription = functionalDescription;
    }

    public String getExclusions() {
        return this.exclusions;
    }

    public BusinessService exclusions(String exclusions) {
        this.setExclusions(exclusions);
        return this;
    }

    public void setExclusions(String exclusions) {
        this.exclusions = exclusions;
    }

    public String getDutiesAndResponsibilities() {
        return this.dutiesAndResponsibilities;
    }

    public BusinessService dutiesAndResponsibilities(String dutiesAndResponsibilities) {
        this.setDutiesAndResponsibilities(dutiesAndResponsibilities);
        return this;
    }

    public void setDutiesAndResponsibilities(String dutiesAndResponsibilities) {
        this.dutiesAndResponsibilities = dutiesAndResponsibilities;
    }

    public String getPersonResponsibleForService() {
        return this.personResponsibleForService;
    }

    public BusinessService personResponsibleForService(String personResponsibleForService) {
        this.setPersonResponsibleForService(personResponsibleForService);
        return this;
    }

    public void setPersonResponsibleForService(String personResponsibleForService) {
        this.personResponsibleForService = personResponsibleForService;
    }

    public String getHoursOfService() {
        return this.hoursOfService;
    }

    public BusinessService hoursOfService(String hoursOfService) {
        this.setHoursOfService(hoursOfService);
        return this;
    }

    public void setHoursOfService(String hoursOfService) {
        this.hoursOfService = hoursOfService;
    }

    public String getServiceActivatingCost() {
        return this.serviceActivatingCost;
    }

    public BusinessService serviceActivatingCost(String serviceActivatingCost) {
        this.setServiceActivatingCost(serviceActivatingCost);
        return this;
    }

    public void setServiceActivatingCost(String serviceActivatingCost) {
        this.serviceActivatingCost = serviceActivatingCost;
    }

    public String getPriceListOfService() {
        return this.priceListOfService;
    }

    public BusinessService priceListOfService(String priceListOfService) {
        this.setPriceListOfService(priceListOfService);
        return this;
    }

    public void setPriceListOfService(String priceListOfService) {
        this.priceListOfService = priceListOfService;
    }

    public String getNotes() {
        return this.notes;
    }

    public BusinessService notes(String notes) {
        this.setNotes(notes);
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public StatusOfServiceElement getStatus() {
        return this.status;
    }

    public BusinessService status(StatusOfServiceElement status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(StatusOfServiceElement status) {
        this.status = status;
    }

    public Set<Parameter> getParameters() {
        return this.parameters;
    }

    public void setParameters(Set<Parameter> parameters) {
        if (this.parameters != null) {
            this.parameters.forEach(i -> i.setBusinessService(null));
        }
        if (parameters != null) {
            parameters.forEach(i -> i.setBusinessService(this));
        }
        this.parameters = parameters;
    }

    public BusinessService parameters(Set<Parameter> parameters) {
        this.setParameters(parameters);
        return this;
    }

    public BusinessService addParameter(Parameter parameter) {
        this.parameters.add(parameter);
        parameter.setBusinessService(this);
        return this;
    }

    public BusinessService removeParameter(Parameter parameter) {
        this.parameters.remove(parameter);
        parameter.setBusinessService(null);
        return this;
    }

    public Set<ServiceElement> getServiceElements() {
        return this.serviceElements;
    }

    public void setServiceElements(Set<ServiceElement> serviceElements) {
        if (this.serviceElements != null) {
            this.serviceElements.forEach(i -> i.setBusinessService(null));
        }
        if (serviceElements != null) {
            serviceElements.forEach(i -> i.setBusinessService(this));
        }
        this.serviceElements = serviceElements;
    }

    public BusinessService serviceElements(Set<ServiceElement> serviceElements) {
        this.setServiceElements(serviceElements);
        return this;
    }

    public BusinessService addServiceElement(ServiceElement serviceElement) {
        this.serviceElements.add(serviceElement);
        serviceElement.setBusinessService(this);
        return this;
    }

    public BusinessService removeServiceElement(ServiceElement serviceElement) {
        this.serviceElements.remove(serviceElement);
        serviceElement.setBusinessService(null);
        return this;
    }

    public Set<InternalService> getInternalServices() {
        return this.internalServices;
    }

    public void setInternalServices(Set<InternalService> internalServices) {
        this.internalServices = internalServices;
    }

    public BusinessService internalServices(Set<InternalService> internalServices) {
        this.setInternalServices(internalServices);
        return this;
    }

    public BusinessService addInternalService(InternalService internalService) {
        this.internalServices.add(internalService);
        internalService.getBusinessServices().add(this);
        return this;
    }

    public BusinessService removeInternalService(InternalService internalService) {
        this.internalServices.remove(internalService);
        internalService.getBusinessServices().remove(this);
        return this;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public BusinessService client(Client client) {
        this.setClient(client);
        return this;
    }

    public Employee getEmployee() {
        return this.employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public BusinessService employee(Employee employee) {
        this.setEmployee(employee);
        return this;
    }

    public Department getDepartment() {
        return this.department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public BusinessService department(Department department) {
        this.setDepartment(department);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BusinessService)) {
            return false;
        }
        return id != null && id.equals(((BusinessService) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BusinessService{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", symbol='" + getSymbol() + "'" +
            ", functionalDescription='" + getFunctionalDescription() + "'" +
            ", exclusions='" + getExclusions() + "'" +
            ", dutiesAndResponsibilities='" + getDutiesAndResponsibilities() + "'" +
            ", personResponsibleForService='" + getPersonResponsibleForService() + "'" +
            ", hoursOfService='" + getHoursOfService() + "'" +
            ", serviceActivatingCost='" + getServiceActivatingCost() + "'" +
            ", priceListOfService='" + getPriceListOfService() + "'" +
            ", notes='" + getNotes() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
