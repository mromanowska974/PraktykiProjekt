package pl.jswits.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import pl.jswits.web.rest.TestUtil;

class InternalServiceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(InternalService.class);
        InternalService internalService1 = new InternalService();
        internalService1.setId(1L);
        InternalService internalService2 = new InternalService();
        internalService2.setId(internalService1.getId());
        assertThat(internalService1).isEqualTo(internalService2);
        internalService2.setId(2L);
        assertThat(internalService1).isNotEqualTo(internalService2);
        internalService1.setId(null);
        assertThat(internalService1).isNotEqualTo(internalService2);
    }
}
