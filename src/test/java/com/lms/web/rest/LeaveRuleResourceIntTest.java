package com.lms.web.rest;

import com.lms.LmsApp;

import com.lms.domain.LeaveRule;
import com.lms.repository.LeaveRuleRepository;
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

import com.lms.domain.enumeration.LeaveFor;
import com.lms.domain.enumeration.Period;
/**
 * Test class for the LeaveRuleResource REST controller.
 *
 * @see LeaveRuleResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LmsApp.class)
public class LeaveRuleResourceIntTest {

    private static final LeaveFor DEFAULT_LEAVE_FOR = LeaveFor.BOTH;
    private static final LeaveFor UPDATED_LEAVE_FOR = LeaveFor.MALE;

    private static final Period DEFAULT_ALLOCATION_TIME_PERIOD = Period.YEALRY;
    private static final Period UPDATED_ALLOCATION_TIME_PERIOD = Period.QUARTERLY;

    private static final Boolean DEFAULT_COMMULATIVE = false;
    private static final Boolean UPDATED_COMMULATIVE = true;

    private static final Double DEFAULT_COMMULATIVE_LIMIT = 1D;
    private static final Double UPDATED_COMMULATIVE_LIMIT = 2D;

    @Autowired
    private LeaveRuleRepository leaveRuleRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLeaveRuleMockMvc;

    private LeaveRule leaveRule;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LeaveRuleResource leaveRuleResource = new LeaveRuleResource(leaveRuleRepository);
        this.restLeaveRuleMockMvc = MockMvcBuilders.standaloneSetup(leaveRuleResource)
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
    public static LeaveRule createEntity(EntityManager em) {
        LeaveRule leaveRule = new LeaveRule()
            .leaveFor(DEFAULT_LEAVE_FOR)
            .allocationTimePeriod(DEFAULT_ALLOCATION_TIME_PERIOD)
            .commulative(DEFAULT_COMMULATIVE)
            .commulativeLimit(DEFAULT_COMMULATIVE_LIMIT);
        return leaveRule;
    }

    @Before
    public void initTest() {
        leaveRule = createEntity(em);
    }

    @Test
    @Transactional
    public void createLeaveRule() throws Exception {
        int databaseSizeBeforeCreate = leaveRuleRepository.findAll().size();

        // Create the LeaveRule
        restLeaveRuleMockMvc.perform(post("/api/leave-rules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRule)))
            .andExpect(status().isCreated());

        // Validate the LeaveRule in the database
        List<LeaveRule> leaveRuleList = leaveRuleRepository.findAll();
        assertThat(leaveRuleList).hasSize(databaseSizeBeforeCreate + 1);
        LeaveRule testLeaveRule = leaveRuleList.get(leaveRuleList.size() - 1);
        assertThat(testLeaveRule.getLeaveFor()).isEqualTo(DEFAULT_LEAVE_FOR);
        assertThat(testLeaveRule.getAllocationTimePeriod()).isEqualTo(DEFAULT_ALLOCATION_TIME_PERIOD);
        assertThat(testLeaveRule.isCommulative()).isEqualTo(DEFAULT_COMMULATIVE);
        assertThat(testLeaveRule.getCommulativeLimit()).isEqualTo(DEFAULT_COMMULATIVE_LIMIT);
    }

    @Test
    @Transactional
    public void createLeaveRuleWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = leaveRuleRepository.findAll().size();

        // Create the LeaveRule with an existing ID
        leaveRule.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLeaveRuleMockMvc.perform(post("/api/leave-rules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRule)))
            .andExpect(status().isBadRequest());

        // Validate the LeaveRule in the database
        List<LeaveRule> leaveRuleList = leaveRuleRepository.findAll();
        assertThat(leaveRuleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkLeaveForIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveRuleRepository.findAll().size();
        // set the field null
        leaveRule.setLeaveFor(null);

        // Create the LeaveRule, which fails.

        restLeaveRuleMockMvc.perform(post("/api/leave-rules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRule)))
            .andExpect(status().isBadRequest());

        List<LeaveRule> leaveRuleList = leaveRuleRepository.findAll();
        assertThat(leaveRuleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAllocationTimePeriodIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveRuleRepository.findAll().size();
        // set the field null
        leaveRule.setAllocationTimePeriod(null);

        // Create the LeaveRule, which fails.

        restLeaveRuleMockMvc.perform(post("/api/leave-rules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRule)))
            .andExpect(status().isBadRequest());

        List<LeaveRule> leaveRuleList = leaveRuleRepository.findAll();
        assertThat(leaveRuleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLeaveRules() throws Exception {
        // Initialize the database
        leaveRuleRepository.saveAndFlush(leaveRule);

        // Get all the leaveRuleList
        restLeaveRuleMockMvc.perform(get("/api/leave-rules?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(leaveRule.getId().intValue())))
            .andExpect(jsonPath("$.[*].leaveFor").value(hasItem(DEFAULT_LEAVE_FOR.toString())))
            .andExpect(jsonPath("$.[*].allocationTimePeriod").value(hasItem(DEFAULT_ALLOCATION_TIME_PERIOD.toString())))
            .andExpect(jsonPath("$.[*].commulative").value(hasItem(DEFAULT_COMMULATIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].commulativeLimit").value(hasItem(DEFAULT_COMMULATIVE_LIMIT.doubleValue())));
    }

    @Test
    @Transactional
    public void getLeaveRule() throws Exception {
        // Initialize the database
        leaveRuleRepository.saveAndFlush(leaveRule);

        // Get the leaveRule
        restLeaveRuleMockMvc.perform(get("/api/leave-rules/{id}", leaveRule.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(leaveRule.getId().intValue()))
            .andExpect(jsonPath("$.leaveFor").value(DEFAULT_LEAVE_FOR.toString()))
            .andExpect(jsonPath("$.allocationTimePeriod").value(DEFAULT_ALLOCATION_TIME_PERIOD.toString()))
            .andExpect(jsonPath("$.commulative").value(DEFAULT_COMMULATIVE.booleanValue()))
            .andExpect(jsonPath("$.commulativeLimit").value(DEFAULT_COMMULATIVE_LIMIT.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingLeaveRule() throws Exception {
        // Get the leaveRule
        restLeaveRuleMockMvc.perform(get("/api/leave-rules/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLeaveRule() throws Exception {
        // Initialize the database
        leaveRuleRepository.saveAndFlush(leaveRule);
        int databaseSizeBeforeUpdate = leaveRuleRepository.findAll().size();

        // Update the leaveRule
        LeaveRule updatedLeaveRule = leaveRuleRepository.findOne(leaveRule.getId());
        // Disconnect from session so that the updates on updatedLeaveRule are not directly saved in db
        em.detach(updatedLeaveRule);
        updatedLeaveRule
            .leaveFor(UPDATED_LEAVE_FOR)
            .allocationTimePeriod(UPDATED_ALLOCATION_TIME_PERIOD)
            .commulative(UPDATED_COMMULATIVE)
            .commulativeLimit(UPDATED_COMMULATIVE_LIMIT);

        restLeaveRuleMockMvc.perform(put("/api/leave-rules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLeaveRule)))
            .andExpect(status().isOk());

        // Validate the LeaveRule in the database
        List<LeaveRule> leaveRuleList = leaveRuleRepository.findAll();
        assertThat(leaveRuleList).hasSize(databaseSizeBeforeUpdate);
        LeaveRule testLeaveRule = leaveRuleList.get(leaveRuleList.size() - 1);
        assertThat(testLeaveRule.getLeaveFor()).isEqualTo(UPDATED_LEAVE_FOR);
        assertThat(testLeaveRule.getAllocationTimePeriod()).isEqualTo(UPDATED_ALLOCATION_TIME_PERIOD);
        assertThat(testLeaveRule.isCommulative()).isEqualTo(UPDATED_COMMULATIVE);
        assertThat(testLeaveRule.getCommulativeLimit()).isEqualTo(UPDATED_COMMULATIVE_LIMIT);
    }

    @Test
    @Transactional
    public void updateNonExistingLeaveRule() throws Exception {
        int databaseSizeBeforeUpdate = leaveRuleRepository.findAll().size();

        // Create the LeaveRule

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLeaveRuleMockMvc.perform(put("/api/leave-rules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRule)))
            .andExpect(status().isCreated());

        // Validate the LeaveRule in the database
        List<LeaveRule> leaveRuleList = leaveRuleRepository.findAll();
        assertThat(leaveRuleList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLeaveRule() throws Exception {
        // Initialize the database
        leaveRuleRepository.saveAndFlush(leaveRule);
        int databaseSizeBeforeDelete = leaveRuleRepository.findAll().size();

        // Get the leaveRule
        restLeaveRuleMockMvc.perform(delete("/api/leave-rules/{id}", leaveRule.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<LeaveRule> leaveRuleList = leaveRuleRepository.findAll();
        assertThat(leaveRuleList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LeaveRule.class);
        LeaveRule leaveRule1 = new LeaveRule();
        leaveRule1.setId(1L);
        LeaveRule leaveRule2 = new LeaveRule();
        leaveRule2.setId(leaveRule1.getId());
        assertThat(leaveRule1).isEqualTo(leaveRule2);
        leaveRule2.setId(2L);
        assertThat(leaveRule1).isNotEqualTo(leaveRule2);
        leaveRule1.setId(null);
        assertThat(leaveRule1).isNotEqualTo(leaveRule2);
    }
}
