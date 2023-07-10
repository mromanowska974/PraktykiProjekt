package pl.jswits.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Employee.
 */
@Entity
@Table(name = "employee")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "employee")
    @JsonIgnoreProperties(
        value = { "parameters", "serviceElements", "internalServices", "client", "employee", "department" },
        allowSetters = true
    )
    private Set<BusinessService> businessServices = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "employee")
    @JsonIgnoreProperties(
        value = { "parameters", "serviceElements", "externalCompanies", "employee", "businessServices" },
        allowSetters = true
    )
    private Set<InternalService> internalServices = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Employee id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Employee name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return this.surname;
    }

    public Employee surname(String surname) {
        this.setSurname(surname);
        return this;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public Set<BusinessService> getBusinessServices() {
        return this.businessServices;
    }

    public void setBusinessServices(Set<BusinessService> businessServices) {
        if (this.businessServices != null) {
            this.businessServices.forEach(i -> i.setEmployee(null));
        }
        if (businessServices != null) {
            businessServices.forEach(i -> i.setEmployee(this));
        }
        this.businessServices = businessServices;
    }

    public Employee businessServices(Set<BusinessService> businessServices) {
        this.setBusinessServices(businessServices);
        return this;
    }

    public Employee addBusinessService(BusinessService businessService) {
        this.businessServices.add(businessService);
        businessService.setEmployee(this);
        return this;
    }

    public Employee removeBusinessService(BusinessService businessService) {
        this.businessServices.remove(businessService);
        businessService.setEmployee(null);
        return this;
    }

    public Set<InternalService> getInternalServices() {
        return this.internalServices;
    }

    public void setInternalServices(Set<InternalService> internalServices) {
        if (this.internalServices != null) {
            this.internalServices.forEach(i -> i.setEmployee(null));
        }
        if (internalServices != null) {
            internalServices.forEach(i -> i.setEmployee(this));
        }
        this.internalServices = internalServices;
    }

    public Employee internalServices(Set<InternalService> internalServices) {
        this.setInternalServices(internalServices);
        return this;
    }

    public Employee addInternalService(InternalService internalService) {
        this.internalServices.add(internalService);
        internalService.setEmployee(this);
        return this;
    }

    public Employee removeInternalService(InternalService internalService) {
        this.internalServices.remove(internalService);
        internalService.setEmployee(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Employee)) {
            return false;
        }
        return id != null && id.equals(((Employee) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Employee{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", surname='" + getSurname() + "'" +
            "}";
    }
}
