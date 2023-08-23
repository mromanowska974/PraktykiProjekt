package pl.jswits.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;

/**
 * A ServiceElementVerificationInfo.
 */
@Entity
@Table(name = "service_element_verification_info")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ServiceElementVerificationInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "is_department_leading")
    private Boolean isDepartmentLeading;

    @Column(name = "verified_by")
    private String verifiedBy;

    @Column(name = "verify_date")
    private Instant verifyDate;

    @JsonIgnoreProperties(value = { "businessServices", "serviceElementVerificationInfo" }, allowSetters = true)
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(unique = true)
    private Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "businessService", "internalService", "serviceElementVerificationInfos" }, allowSetters = true)
    private ServiceElement serviceElement;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ServiceElementVerificationInfo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsDepartmentLeading() {
        return this.isDepartmentLeading;
    }

    public ServiceElementVerificationInfo isDepartmentLeading(Boolean isDepartmentLeading) {
        this.setIsDepartmentLeading(isDepartmentLeading);
        return this;
    }

    public void setIsDepartmentLeading(Boolean isDepartmentLeading) {
        this.isDepartmentLeading = isDepartmentLeading;
    }

    public String getVerifiedBy() {
        return this.verifiedBy;
    }

    public ServiceElementVerificationInfo verifiedBy(String verifiedBy) {
        this.setVerifiedBy(verifiedBy);
        return this;
    }

    public void setVerifiedBy(String verifiedBy) {
        this.verifiedBy = verifiedBy;
    }

    public Instant getVerifyDate() {
        return this.verifyDate;
    }

    public ServiceElementVerificationInfo verifyDate(Instant verifyDate) {
        this.setVerifyDate(verifyDate);
        return this;
    }

    public void setVerifyDate(Instant verifyDate) {
        this.verifyDate = verifyDate;
    }

    public Department getDepartment() {
        return this.department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public ServiceElementVerificationInfo department(Department department) {
        this.setDepartment(department);
        return this;
    }

    public ServiceElement getServiceElement() {
        return this.serviceElement;
    }

    public void setServiceElement(ServiceElement serviceElement) {
        this.serviceElement = serviceElement;
    }

    public ServiceElementVerificationInfo serviceElement(ServiceElement serviceElement) {
        this.setServiceElement(serviceElement);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ServiceElementVerificationInfo)) {
            return false;
        }
        return id != null && id.equals(((ServiceElementVerificationInfo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ServiceElementVerificationInfo{" +
            "id=" + getId() +
            ", isDepartmentLeading='" + getIsDepartmentLeading() + "'" +
            ", verifiedBy='" + getVerifiedBy() + "'" +
            ", verifyDate='" + getVerifyDate() + "'" +
            "}";
    }
}
