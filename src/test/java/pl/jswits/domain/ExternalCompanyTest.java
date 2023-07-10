package pl.jswits.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import pl.jswits.web.rest.TestUtil;

class ExternalCompanyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExternalCompany.class);
        ExternalCompany externalCompany1 = new ExternalCompany();
        externalCompany1.setId(1L);
        ExternalCompany externalCompany2 = new ExternalCompany();
        externalCompany2.setId(externalCompany1.getId());
        assertThat(externalCompany1).isEqualTo(externalCompany2);
        externalCompany2.setId(2L);
        assertThat(externalCompany1).isNotEqualTo(externalCompany2);
        externalCompany1.setId(null);
        assertThat(externalCompany1).isNotEqualTo(externalCompany2);
    }
}
