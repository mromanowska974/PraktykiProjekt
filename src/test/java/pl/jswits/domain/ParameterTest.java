package pl.jswits.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import pl.jswits.web.rest.TestUtil;

class ParameterTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Parameter.class);
        Parameter parameter1 = new Parameter();
        parameter1.setId(1L);
        Parameter parameter2 = new Parameter();
        parameter2.setId(parameter1.getId());
        assertThat(parameter1).isEqualTo(parameter2);
        parameter2.setId(2L);
        assertThat(parameter1).isNotEqualTo(parameter2);
        parameter1.setId(null);
        assertThat(parameter1).isNotEqualTo(parameter2);
    }
}
