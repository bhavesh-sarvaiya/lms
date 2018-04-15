package com.lms.web.rest;

import com.lms.LmsApp;

import com.lms.domain.LeaveRuleAndMaxMinLeave;
import com.lms.repository.LeaveRuleAndMaxMinLeaveRepository;
import com.lms.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static com.lms.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.lms.domain.enumeration.EmpType2;
/**
 * Test class for the LeaveRuleAndMaxMinLeaveResource REST controller.
 *
 * @see LeaveRuleAndMaxMinLeaveResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LmsApp.class)
public class LeaveRuleAndMaxMinLeaveResourceIntTest {

    private static final EmpType2 DEFAULT_EMPLOYEE_TYPE = EmpType2.ALL;
    private static final EmpType2 UPDATED_EMPLOYEE_TYPE = EmpType2.MANAGEMENT_AND_EDUCATIONAL;

    private static final Double DEFAULT_MAX_LEAVE_LIMIT = 1D;
    private static final Double UPDATED_MAX_LEAVE_LIMIT = 2D;

    private static final Double DEFAULT_MIN_LEAVE_LIMIT = 1D;
    private static final Double UPDATED_MIN_LEAVE_LIMIT = 2D;

    @Autowired
    private LeaveRuleAndMaxMinLeaveRepository leaveRuleAndMaxMinLeaveRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLeaveRuleAndMaxMinLeaveMockMvc;

    private LeaveRuleAndMaxMinLeave leaveRuleAndMaxMinLeave;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LeaveRuleAndMaxMinLeaveResource leaveRuleAndMaxMinLeaveResource = new LeaveRuleAndMaxMinLeaveResource(leaveRuleAndMaxMinLeaveRepository);
        this.restLeaveRuleAndMaxMinLeaveMockMvc = MockMvcBuilders.standaloneSetup(leaveRuleAndMaxMinLeaveResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LeaveRuleAndMaxMinLeave createEntity(EntityManager em) {
        LeaveRuleAndMaxMinLeave leaveRuleAndMaxMinLeave = new LeaveRuleAndMaxMinLeave()
            .employeeType(DEFAULT_EMPLOYEE_TYPE)
            .maxLeaveLimit(DEFAULT_MAX_LEAVE_LIMIT)
            .minLeaveLimit(DEFAULT_MIN_LEAVE_LIMIT);
        return leaveRuleAndMaxMinLeave;
    }

    @Before
    public void initTest() {
        leaveRuleAndMaxMinLeave = createEntity(em);
    }

    @Test
    @Transactional
    public void createLeaveRuleAndMaxMinLeave() throws Exception {
        int databaseSizeBeforeCreate = leaveRuleAndMaxMinLeaveRepository.findAll().size();

        // Create the LeaveRuleAndMaxMinLeave
        restLeaveRuleAndMaxMinLeaveMockMvc.perform(post("/api/leave-rule-and-max-min-leaves")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndMaxMinLeave)))
            .andExpect(status().isCreated());

        // Validate the LeaveRuleAndMaxMinLeave in the database
        List<LeaveRuleAndMaxMinLeave> leaveRuleAndMaxMinLeaveList = leaveRuleAndMaxMinLeaveRepository.findAll();
        assertThat(leaveRuleAndMaxMinLeaveList).hasSize(databaseSizeBeforeCreate + 1);
        LeaveRuleAndMaxMinLeave testLeaveRuleAndMaxMinLeave = leaveRuleAndMaxMinLeaveList.get(leaveRuleAndMaxMinLeaveList.size() - 1);
        assertThat(testLeaveRuleAndMaxMinLeave.getEmployeeType()).isEqualTo(DEFAULT_EMPLOYEE_TYPE);
        assertThat(testLeaveRuleAndMaxMinLeave.getMaxLeaveLimit()).isEqualTo(DEFAULT_MAX_LEAVE_LIMIT);
        assertThat(testLeaveRuleAndMaxMinLeave.getMinLeaveLimit()).isEqualTo(DEFAULT_MIN_LEAVE_LIMIT);
    }

    @Test
    @Transactional
    public void createLeaveRuleAndMaxMinLeaveWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = leaveRuleAndMaxMinLeaveRepository.findAll().size();

        // Create the LeaveRuleAndMaxMinLeave with an existing ID
        leaveRuleAndMaxMinLeave.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLeaveRuleAndMaxMinLeaveMockMvc.perform(post("/api/leave-rule-and-max-min-leaves")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndMaxMinLeave)))
            .andExpect(status().isBadRequest());

        // Validate the LeaveRuleAndMaxMinLeave in the database
        List<LeaveRuleAndMaxMinLeave> leaveRuleAndMaxMinLeaveList = leaveRuleAndMaxMinLeaveRepository.findAll();
        assertThat(leaveRuleAndMaxMinLeaveList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkEmployeeTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveRuleAndMaxMinLeaveRepository.findAll().size();
        // set the field null
        leaveRuleAndMaxMinLeave.setEmployeeType(null);

        // Create the LeaveRuleAndMaxMinLeave, which fails.

        restLeaveRuleAndMaxMinLeaveMockMvc.perform(post("/api/leave-rule-and-max-min-leaves")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndMaxMinLeave)))
            .andExpect(status().isBadRequest());

        List<LeaveRuleAndMaxMinLeave> leaveRuleAndMaxMinLeaveList = leaveRuleAndMaxMinLeaveRepository.findAll();
        assertThat(leaveRuleAndMaxMinLeaveList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkMaxLeaveLimitIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveRuleAndMaxMinLeaveRepository.findAll().size();
        // set the field null
        leaveRuleAndMaxMinLeave.setMaxLeaveLimit(null);

        // Create the LeaveRuleAndMaxMinLeave, which fails.

        restLeaveRuleAndMaxMinLeaveMockMvc.perform(post("/api/leave-rule-and-max-min-leaves")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndMaxMinLeave)))
            .andExpect(status().isBadRequest());

        List<LeaveRuleAndMaxMinLeave> leaveRuleAndMaxMinLeaveList = leaveRuleAndMaxMinLeaveRepository.findAll();
        assertThat(leaveRuleAndMaxMinLeaveList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkMinLeaveLimitIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveRuleAndMaxMinLeaveRepository.findAll().size();
        // set the field null
        leaveRuleAndMaxMinLeave.setMinLeaveLimit(null);

        // Create the LeaveRuleAndMaxMinLeave, which fails.

        restLeaveRuleAndMaxMinLeaveMockMvc.perform(post("/api/leave-rule-and-max-min-leaves")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndMaxMinLeave)))
            .andExpect(status().isBadRequest());

        List<LeaveRuleAndMaxMinLeave> leaveRuleAndMaxMinLeaveList = leaveRuleAndMaxMinLeaveRepository.findAll();
        assertThat(leaveRuleAndMaxMinLeaveList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLeaveRuleAndMaxMinLeaves() throws Exception {
        // Initialize the database
        leaveRuleAndMaxMinLeaveRepository.saveAndFlush(leaveRuleAndMaxMinLeave);

        // Get all the leaveRuleAndMaxMinLeaveList
        restLeaveRuleAndMaxMinLeaveMockMvc.perform(get("/api/leave-rule-and-max-min-leaves?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(leaveRuleAndMaxMinLeave.getId().intValue())))
            .andExpect(jsonPath("$.[*].employeeType").value(hasItem(DEFAULT_EMPLOYEE_TYPE.toString())))
            .andExpect(jsonPath("$.[*].maxLeaveLimit").value(hasItem(DEFAULT_MAX_LEAVE_LIMIT.doubleValue())))
            .andExpect(jsonPath("$.[*].minLeaveLimit").value(hasItem(DEFAULT_MIN_LEAVE_LIMIT.doubleValue())));
    }

    @Test
    @Transactional
    public void getLeaveRuleAndMaxMinLeave() throws Exception {
        // Initialize the database
        leaveRuleAndMaxMinLeaveRepository.saveAndFlush(leaveRuleAndMaxMinLeave);

        // Get the leaveRuleAndMaxMinLeave
        restLeaveRuleAndMaxMinLeaveMockMvc.perform(get("/api/leave-rule-and-max-min-leaves/{id}", leaveRuleAndMaxMinLeave.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(leaveRuleAndMaxMinLeave.getId().intValue()))
            .andExpect(jsonPath("$.employeeType").value(DEFAULT_EMPLOYEE_TYPE.toString()))
            .andExpect(jsonPath("$.maxLeaveLimit").value(DEFAULT_MAX_LEAVE_LIMIT.doubleValue()))
            .andExpect(jsonPath("$.minLeaveLimit").value(DEFAULT_MIN_LEAVE_LIMIT.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingLeaveRuleAndMaxMinLeave() throws Exception {
        // Get the leaveRuleAndMaxMinLeave
        restLeaveRuleAndMaxMinLeaveMockMvc.perform(get("/api/leave-rule-and-max-min-leaves/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLeaveRuleAndMaxMinLeave() throws Exception {
        // Initialize the database
        leaveRuleAndMaxMinLeaveRepository.saveAndFlush(leaveRuleAndMaxMinLeave);
        int databaseSizeBeforeUpdate = leaveRuleAndMaxMinLeaveRepository.findAll().size();

        // Update the leaveRuleAndMaxMinLeave
        LeaveRuleAndMaxMinLeave updatedLeaveRuleAndMaxMinLeave = leaveRuleAndMaxMinLeaveRepository.findOne(leaveRuleAndMaxMinLeave.getId());
        // Disconnect from session so that the updates on updatedLeaveRuleAndMaxMinLeave are not directly saved in db
        em.detach(updatedLeaveRuleAndMaxMinLeave);
        updatedLeaveRuleAndMaxMinLeave
            .employeeType(UPDATED_EMPLOYEE_TYPE)
            .maxLeaveLimit(UPDATED_MAX_LEAVE_LIMIT)
            .minLeaveLimit(UPDATED_MIN_LEAVE_LIMIT);

        restLeaveRuleAndMaxMinLeaveMockMvc.perform(put("/api/leave-rule-and-max-min-leaves")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLeaveRuleAndMaxMinLeave)))
            .andExpect(status().isOk());

        // Validate the LeaveRuleAndMaxMinLeave in the database
        List<LeaveRuleAndMaxMinLeave> leaveRuleAndMaxMinLeaveList = leaveRuleAndMaxMinLeaveRepository.findAll();
        assertThat(leaveRuleAndMaxMinLeaveList).hasSize(databaseSizeBeforeUpdate);
        LeaveRuleAndMaxMinLeave testLeaveRuleAndMaxMinLeave = leaveRuleAndMaxMinLeaveList.get(leaveRuleAndMaxMinLeaveList.size() - 1);
        assertThat(testLeaveRuleAndMaxMinLeave.getEmployeeType()).isEqualTo(UPDATED_EMPLOYEE_TYPE);
        assertThat(testLeaveRuleAndMaxMinLeave.getMaxLeaveLimit()).isEqualTo(UPDATED_MAX_LEAVE_LIMIT);
        assertThat(testLeaveRuleAndMaxMinLeave.getMinLeaveLimit()).isEqualTo(UPDATED_MIN_LEAVE_LIMIT);
    }

    @Test
    @Transactional
    public void updateNonExistingLeaveRuleAndMaxMinLeave() throws Exception {
        int databaseSizeBeforeUpdate = leaveRuleAndMaxMinLeaveRepository.findAll().size();

        // Create the LeaveRuleAndMaxMinLeave

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLeaveRuleAndMaxMinLeaveMockMvc.perform(put("/api/leave-rule-and-max-min-leaves")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndMaxMinLeave)))
            .andExpect(status().isCreated());

        // Validate the LeaveRuleAndMaxMinLeave in the database
        List<LeaveRuleAndMaxMinLeave> leaveRuleAndMaxMinLeaveList = leaveRuleAndMaxMinLeaveRepository.findAll();
        assertThat(leaveRuleAndMaxMinLeaveList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLeaveRuleAndMaxMinLeave() throws Exception {
        // Initialize the database
        leaveRuleAndMaxMinLeaveRepository.saveAndFlush(leaveRuleAndMaxMinLeave);
        int databaseSizeBeforeDelete = leaveRuleAndMaxMinLeaveRepository.findAll().size();

        // Get the leaveRuleAndMaxMinLeave
        restLeaveRuleAndMaxMinLeaveMockMvc.perform(delete("/api/leave-rule-and-max-min-leaves/{id}", leaveRuleAndMaxMinLeave.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<LeaveRuleAndMaxMinLeave> leaveRuleAndMaxMinLeaveList = leaveRuleAndMaxMinLeaveRepository.findAll();
        assertThat(leaveRuleAndMaxMinLeaveList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LeaveRuleAndMaxMinLeave.class);
        LeaveRuleAndMaxMinLeave leaveRuleAndMaxMinLeave1 = new LeaveRuleAndMaxMinLeave();
        leaveRuleAndMaxMinLeave1.setId(1L);
        LeaveRuleAndMaxMinLeave leaveRuleAndMaxMinLeave2 = new LeaveRuleAndMaxMinLeave();
        leaveRuleAndMaxMinLeave2.setId(leaveRuleAndMaxMinLeave1.getId());
        assertThat(leaveRuleAndMaxMinLeave1).isEqualTo(leaveRuleAndMaxMinLeave2);
        leaveRuleAndMaxMinLeave2.setId(2L);
        assertThat(leaveRuleAndMaxMinLeave1).isNotEqualTo(leaveRuleAndMaxMinLeave2);
        leaveRuleAndMaxMinLeave1.setId(null);
        assertThat(leaveRuleAndMaxMinLeave1).isNotEqualTo(leaveRuleAndMaxMinLeave2);
    }
}
