package pl.jswits.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import pl.jswits.web.rest.TestUtil;

class ServiceElementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ServiceElement.class);
        ServiceElement serviceElement1 = new ServiceElement();
        serviceElement1.setId(1L);
        ServiceElement serviceElement2 = new ServiceElement();
        serviceElement2.setId(serviceElement1.getId());
        assertThat(serviceElement1).isEqualTo(serviceElement2);
        serviceElement2.setId(2L);
        assertThat(serviceElement1).isNotEqualTo(serviceElement2);
        serviceElement1.setId(null);
        assertThat(serviceElement1).isNotEqualTo(serviceElement2);
    }
}
