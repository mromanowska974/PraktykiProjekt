package pl.jswits.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;

/**
 * A ExternalCompany.
 */
@Entity
@Table(name = "external_company")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ExternalCompany implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "contract_number")
    private String contractNumber;

    @Column(name = "s_la_parameters")
    private String sLAParameters;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(
        value = { "parameters", "serviceElements", "externalCompanies", "employee", "businessServices" },
        allowSetters = true
    )
    private InternalService internalService;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ExternalCompany id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ExternalCompany name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContractNumber() {
        return this.contractNumber;
    }

    public ExternalCompany contractNumber(String contractNumber) {
        this.setContractNumber(contractNumber);
        return this;
    }

    public void setContractNumber(String contractNumber) {
        this.contractNumber = contractNumber;
    }

    public String getsLAParameters() {
        return this.sLAParameters;
    }

    public ExternalCompany sLAParameters(String sLAParameters) {
        this.setsLAParameters(sLAParameters);
        return this;
    }

    public void setsLAParameters(String sLAParameters) {
        this.sLAParameters = sLAParameters;
    }

    public InternalService getInternalService() {
        return this.internalService;
    }

    public void setInternalService(InternalService internalService) {
        this.internalService = internalService;
    }

    public ExternalCompany internalService(InternalService internalService) {
        this.setInternalService(internalService);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExternalCompany)) {
            return false;
        }
        return id != null && id.equals(((ExternalCompany) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExternalCompany{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", contractNumber='" + getContractNumber() + "'" +
            ", sLAParameters='" + getsLAParameters() + "'" +
            "}";
    }
}
