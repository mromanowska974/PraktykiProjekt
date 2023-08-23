package pl.jswits.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import pl.jswits.web.rest.TestUtil;

class ServiceElementVerificationInfoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ServiceElementVerificationInfo.class);
        ServiceElementVerificationInfo serviceElementVerificationInfo1 = new ServiceElementVerificationInfo();
        serviceElementVerificationInfo1.setId(1L);
        ServiceElementVerificationInfo serviceElementVerificationInfo2 = new ServiceElementVerificationInfo();
        serviceElementVerificationInfo2.setId(serviceElementVerificationInfo1.getId());
        assertThat(serviceElementVerificationInfo1).isEqualTo(serviceElementVerificationInfo2);
        serviceElementVerificationInfo2.setId(2L);
        assertThat(serviceElementVerificationInfo1).isNotEqualTo(serviceElementVerificationInfo2);
        serviceElementVerificationInfo1.setId(null);
        assertThat(serviceElementVerificationInfo1).isNotEqualTo(serviceElementVerificationInfo2);
    }
}
