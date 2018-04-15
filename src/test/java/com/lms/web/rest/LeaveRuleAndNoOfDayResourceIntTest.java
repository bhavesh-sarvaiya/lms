package com.lms.web.rest;

import com.lms.LmsApp;

import com.lms.domain.LeaveRuleAndNoOfDay;
import com.lms.domain.LeaveRule;
import com.lms.repository.LeaveRuleAndNoOfDayRepository;
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

import com.lms.domain.enumeration.EmpType1;
/**
 * Test class for the LeaveRuleAndNoOfDayResource REST controller.
 *
 * @see LeaveRuleAndNoOfDayResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LmsApp.class)
public class LeaveRuleAndNoOfDayResourceIntTest {

    private static final EmpType1 DEFAULT_EMPLOYEE_TYPE = EmpType1.ALL;
    private static final EmpType1 UPDATED_EMPLOYEE_TYPE = EmpType1.EDUCATIONAL_WITH_VACATIONER_AND_EDUCATIONAL_WITH_NON_VACATIONER;

    private static final Double DEFAULT_NO_OFDAY = 1D;
    private static final Double UPDATED_NO_OFDAY = 2D;

    @Autowired
    private LeaveRuleAndNoOfDayRepository leaveRuleAndNoOfDayRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLeaveRuleAndNoOfDayMockMvc;

    private LeaveRuleAndNoOfDay leaveRuleAndNoOfDay;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LeaveRuleAndNoOfDayResource leaveRuleAndNoOfDayResource = new LeaveRuleAndNoOfDayResource(leaveRuleAndNoOfDayRepository);
        this.restLeaveRuleAndNoOfDayMockMvc = MockMvcBuilders.standaloneSetup(leaveRuleAndNoOfDayResource)
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
    public static LeaveRuleAndNoOfDay createEntity(EntityManager em) {
        LeaveRuleAndNoOfDay leaveRuleAndNoOfDay = new LeaveRuleAndNoOfDay()
            .employeeType(DEFAULT_EMPLOYEE_TYPE)
            .noOfday(DEFAULT_NO_OFDAY);
        // Add required entity
        LeaveRule leaveRule = LeaveRuleResourceIntTest.createEntity(em);
        em.persist(leaveRule);
        em.flush();
        leaveRuleAndNoOfDay.setLeaveRule(leaveRule);
        return leaveRuleAndNoOfDay;
    }

    @Before
    public void initTest() {
        leaveRuleAndNoOfDay = createEntity(em);
    }

    @Test
    @Transactional
    public void createLeaveRuleAndNoOfDay() throws Exception {
        int databaseSizeBeforeCreate = leaveRuleAndNoOfDayRepository.findAll().size();

        // Create the LeaveRuleAndNoOfDay
        restLeaveRuleAndNoOfDayMockMvc.perform(post("/api/leave-rule-and-no-of-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndNoOfDay)))
            .andExpect(status().isCreated());

        // Validate the LeaveRuleAndNoOfDay in the database
        List<LeaveRuleAndNoOfDay> leaveRuleAndNoOfDayList = leaveRuleAndNoOfDayRepository.findAll();
        assertThat(leaveRuleAndNoOfDayList).hasSize(databaseSizeBeforeCreate + 1);
        LeaveRuleAndNoOfDay testLeaveRuleAndNoOfDay = leaveRuleAndNoOfDayList.get(leaveRuleAndNoOfDayList.size() - 1);
        assertThat(testLeaveRuleAndNoOfDay.getEmployeeType()).isEqualTo(DEFAULT_EMPLOYEE_TYPE);
        assertThat(testLeaveRuleAndNoOfDay.getNoOfday()).isEqualTo(DEFAULT_NO_OFDAY);
    }

    @Test
    @Transactional
    public void createLeaveRuleAndNoOfDayWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = leaveRuleAndNoOfDayRepository.findAll().size();

        // Create the LeaveRuleAndNoOfDay with an existing ID
        leaveRuleAndNoOfDay.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLeaveRuleAndNoOfDayMockMvc.perform(post("/api/leave-rule-and-no-of-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndNoOfDay)))
            .andExpect(status().isBadRequest());

        // Validate the LeaveRuleAndNoOfDay in the database
        List<LeaveRuleAndNoOfDay> leaveRuleAndNoOfDayList = leaveRuleAndNoOfDayRepository.findAll();
        assertThat(leaveRuleAndNoOfDayList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkEmployeeTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveRuleAndNoOfDayRepository.findAll().size();
        // set the field null
        leaveRuleAndNoOfDay.setEmployeeType(null);

        // Create the LeaveRuleAndNoOfDay, which fails.

        restLeaveRuleAndNoOfDayMockMvc.perform(post("/api/leave-rule-and-no-of-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndNoOfDay)))
            .andExpect(status().isBadRequest());

        List<LeaveRuleAndNoOfDay> leaveRuleAndNoOfDayList = leaveRuleAndNoOfDayRepository.findAll();
        assertThat(leaveRuleAndNoOfDayList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNoOfdayIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveRuleAndNoOfDayRepository.findAll().size();
        // set the field null
        leaveRuleAndNoOfDay.setNoOfday(null);

        // Create the LeaveRuleAndNoOfDay, which fails.

        restLeaveRuleAndNoOfDayMockMvc.perform(post("/api/leave-rule-and-no-of-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndNoOfDay)))
            .andExpect(status().isBadRequest());

        List<LeaveRuleAndNoOfDay> leaveRuleAndNoOfDayList = leaveRuleAndNoOfDayRepository.findAll();
        assertThat(leaveRuleAndNoOfDayList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLeaveRuleAndNoOfDays() throws Exception {
        // Initialize the database
        leaveRuleAndNoOfDayRepository.saveAndFlush(leaveRuleAndNoOfDay);

        // Get all the leaveRuleAndNoOfDayList
        restLeaveRuleAndNoOfDayMockMvc.perform(get("/api/leave-rule-and-no-of-days?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(leaveRuleAndNoOfDay.getId().intValue())))
            .andExpect(jsonPath("$.[*].employeeType").value(hasItem(DEFAULT_EMPLOYEE_TYPE.toString())))
            .andExpect(jsonPath("$.[*].noOfday").value(hasItem(DEFAULT_NO_OFDAY.doubleValue())));
    }

    @Test
    @Transactional
    public void getLeaveRuleAndNoOfDay() throws Exception {
        // Initialize the database
        leaveRuleAndNoOfDayRepository.saveAndFlush(leaveRuleAndNoOfDay);

        // Get the leaveRuleAndNoOfDay
        restLeaveRuleAndNoOfDayMockMvc.perform(get("/api/leave-rule-and-no-of-days/{id}", leaveRuleAndNoOfDay.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(leaveRuleAndNoOfDay.getId().intValue()))
            .andExpect(jsonPath("$.employeeType").value(DEFAULT_EMPLOYEE_TYPE.toString()))
            .andExpect(jsonPath("$.noOfday").value(DEFAULT_NO_OFDAY.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingLeaveRuleAndNoOfDay() throws Exception {
        // Get the leaveRuleAndNoOfDay
        restLeaveRuleAndNoOfDayMockMvc.perform(get("/api/leave-rule-and-no-of-days/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLeaveRuleAndNoOfDay() throws Exception {
        // Initialize the database
        leaveRuleAndNoOfDayRepository.saveAndFlush(leaveRuleAndNoOfDay);
        int databaseSizeBeforeUpdate = leaveRuleAndNoOfDayRepository.findAll().size();

        // Update the leaveRuleAndNoOfDay
        LeaveRuleAndNoOfDay updatedLeaveRuleAndNoOfDay = leaveRuleAndNoOfDayRepository.findOne(leaveRuleAndNoOfDay.getId());
        // Disconnect from session so that the updates on updatedLeaveRuleAndNoOfDay are not directly saved in db
        em.detach(updatedLeaveRuleAndNoOfDay);
        updatedLeaveRuleAndNoOfDay
            .employeeType(UPDATED_EMPLOYEE_TYPE)
            .noOfday(UPDATED_NO_OFDAY);

        restLeaveRuleAndNoOfDayMockMvc.perform(put("/api/leave-rule-and-no-of-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLeaveRuleAndNoOfDay)))
            .andExpect(status().isOk());

        // Validate the LeaveRuleAndNoOfDay in the database
        List<LeaveRuleAndNoOfDay> leaveRuleAndNoOfDayList = leaveRuleAndNoOfDayRepository.findAll();
        assertThat(leaveRuleAndNoOfDayList).hasSize(databaseSizeBeforeUpdate);
        LeaveRuleAndNoOfDay testLeaveRuleAndNoOfDay = leaveRuleAndNoOfDayList.get(leaveRuleAndNoOfDayList.size() - 1);
        assertThat(testLeaveRuleAndNoOfDay.getEmployeeType()).isEqualTo(UPDATED_EMPLOYEE_TYPE);
        assertThat(testLeaveRuleAndNoOfDay.getNoOfday()).isEqualTo(UPDATED_NO_OFDAY);
    }

    @Test
    @Transactional
    public void updateNonExistingLeaveRuleAndNoOfDay() throws Exception {
        int databaseSizeBeforeUpdate = leaveRuleAndNoOfDayRepository.findAll().size();

        // Create the LeaveRuleAndNoOfDay

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLeaveRuleAndNoOfDayMockMvc.perform(put("/api/leave-rule-and-no-of-days")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndNoOfDay)))
            .andExpect(status().isCreated());

        // Validate the LeaveRuleAndNoOfDay in the database
        List<LeaveRuleAndNoOfDay> leaveRuleAndNoOfDayList = leaveRuleAndNoOfDayRepository.findAll();
        assertThat(leaveRuleAndNoOfDayList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLeaveRuleAndNoOfDay() throws Exception {
        // Initialize the database
        leaveRuleAndNoOfDayRepository.saveAndFlush(leaveRuleAndNoOfDay);
        int databaseSizeBeforeDelete = leaveRuleAndNoOfDayRepository.findAll().size();

        // Get the leaveRuleAndNoOfDay
        restLeaveRuleAndNoOfDayMockMvc.perform(delete("/api/leave-rule-and-no-of-days/{id}", leaveRuleAndNoOfDay.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<LeaveRuleAndNoOfDay> leaveRuleAndNoOfDayList = leaveRuleAndNoOfDayRepository.findAll();
        assertThat(leaveRuleAndNoOfDayList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LeaveRuleAndNoOfDay.class);
        LeaveRuleAndNoOfDay leaveRuleAndNoOfDay1 = new LeaveRuleAndNoOfDay();
        leaveRuleAndNoOfDay1.setId(1L);
        LeaveRuleAndNoOfDay leaveRuleAndNoOfDay2 = new LeaveRuleAndNoOfDay();
        leaveRuleAndNoOfDay2.setId(leaveRuleAndNoOfDay1.getId());
        assertThat(leaveRuleAndNoOfDay1).isEqualTo(leaveRuleAndNoOfDay2);
        leaveRuleAndNoOfDay2.setId(2L);
        assertThat(leaveRuleAndNoOfDay1).isNotEqualTo(leaveRuleAndNoOfDay2);
        leaveRuleAndNoOfDay1.setId(null);
        assertThat(leaveRuleAndNoOfDay1).isNotEqualTo(leaveRuleAndNoOfDay2);
    }
}
