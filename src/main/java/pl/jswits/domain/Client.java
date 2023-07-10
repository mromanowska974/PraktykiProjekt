package pl.jswits.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Client.
 */
@Entity
@Table(name = "client")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Client implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
    @JsonIgnoreProperties(
        value = { "parameters", "serviceElements", "internalServices", "client", "employee", "department" },
        allowSetters = true
    )
    private Set<BusinessService> businessServices = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Client id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Client name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<BusinessService> getBusinessServices() {
        return this.businessServices;
    }

    public void setBusinessServices(Set<BusinessService> businessServices) {
        if (this.businessServices != null) {
            this.businessServices.forEach(i -> i.setClient(null));
        }
        if (businessServices != null) {
            businessServices.forEach(i -> i.setClient(this));
        }
        this.businessServices = businessServices;
    }

    public Client businessServices(Set<BusinessService> businessServices) {
        this.setBusinessServices(businessServices);
        return this;
    }

    public Client addBusinessService(BusinessService businessService) {
        this.businessServices.add(businessService);
        businessService.setClient(this);
        return this;
    }

    public Client removeBusinessService(BusinessService businessService) {
        this.businessServices.remove(businessService);
        businessService.setClient(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Client)) {
            return false;
        }
        return id != null && id.equals(((Client) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Client{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
