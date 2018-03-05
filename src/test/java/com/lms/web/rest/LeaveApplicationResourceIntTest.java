package com.lms.web.rest;

import com.lms.LmsApp;

import com.lms.domain.LeaveApplication;
import com.lms.domain.LeaveType;
import com.lms.repository.EmployeeRepository;
import com.lms.repository.LeaveApplicationRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static com.lms.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the LeaveApplicationResource REST controller.
 *
 * @see LeaveApplicationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LmsApp.class)
public class LeaveApplicationResourceIntTest {

    private static final String DEFAULT_REASON = "AAAAAAAAAA";
    private static final String UPDATED_REASON = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_FROM_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FROM_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_TO_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_TO_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Double DEFAULT_NOOFDAY = 1D;
    private static final Double UPDATED_NOOFDAY = 2D;

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_FLOW_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_FLOW_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    @Autowired
    private LeaveApplicationRepository leaveApplicationRepository;
     @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLeaveApplicationMockMvc;

    private LeaveApplication leaveApplication;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LeaveApplicationResource leaveApplicationResource = new LeaveApplicationResource(leaveApplicationRepository,employeeRepository);
        this.restLeaveApplicationMockMvc = MockMvcBuilders.standaloneSetup(leaveApplicationResource)
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
    public static LeaveApplication createEntity(EntityManager em) {
        LeaveApplication leaveApplication = new LeaveApplication()
            .reason(DEFAULT_REASON)
            .fromDate(DEFAULT_FROM_DATE)
            .toDate(DEFAULT_TO_DATE)
            .noofday(DEFAULT_NOOFDAY)
            .status(DEFAULT_STATUS)
            .flowStatus(DEFAULT_FLOW_STATUS)
            .comment(DEFAULT_COMMENT);
        // Add required entity
        LeaveType leaveType = LeaveTypeResourceIntTest.createEntity(em);
        em.persist(leaveType);
        em.flush();
        leaveApplication.setLeaveType(leaveType);
        return leaveApplication;
    }

    @Before
    public void initTest() {
        leaveApplication = createEntity(em);
    }

    @Test
    @Transactional
    public void createLeaveApplication() throws Exception {
        int databaseSizeBeforeCreate = leaveApplicationRepository.findAll().size();

        // Create the LeaveApplication
        restLeaveApplicationMockMvc.perform(post("/api/leave-applications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveApplication)))
            .andExpect(status().isCreated());

        // Validate the LeaveApplication in the database
        List<LeaveApplication> leaveApplicationList = leaveApplicationRepository.findAll();
        assertThat(leaveApplicationList).hasSize(databaseSizeBeforeCreate + 1);
        LeaveApplication testLeaveApplication = leaveApplicationList.get(leaveApplicationList.size() - 1);
        assertThat(testLeaveApplication.getReason()).isEqualTo(DEFAULT_REASON);
        assertThat(testLeaveApplication.getFromDate()).isEqualTo(DEFAULT_FROM_DATE);
        assertThat(testLeaveApplication.getToDate()).isEqualTo(DEFAULT_TO_DATE);
        assertThat(testLeaveApplication.getNoofday()).isEqualTo(DEFAULT_NOOFDAY);
        assertThat(testLeaveApplication.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testLeaveApplication.getFlowStatus()).isEqualTo(DEFAULT_FLOW_STATUS);
        assertThat(testLeaveApplication.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    public void createLeaveApplicationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = leaveApplicationRepository.findAll().size();

        // Create the LeaveApplication with an existing ID
        leaveApplication.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLeaveApplicationMockMvc.perform(post("/api/leave-applications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveApplication)))
            .andExpect(status().isBadRequest());

        // Validate the LeaveApplication in the database
        List<LeaveApplication> leaveApplicationList = leaveApplicationRepository.findAll();
        assertThat(leaveApplicationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkReasonIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveApplicationRepository.findAll().size();
        // set the field null
        leaveApplication.setReason(null);

        // Create the LeaveApplication, which fails.

        restLeaveApplicationMockMvc.perform(post("/api/leave-applications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveApplication)))
            .andExpect(status().isBadRequest());

        List<LeaveApplication> leaveApplicationList = leaveApplicationRepository.findAll();
        assertThat(leaveApplicationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkFromDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveApplicationRepository.findAll().size();
        // set the field null
        leaveApplication.setFromDate(null);

        // Create the LeaveApplication, which fails.

        restLeaveApplicationMockMvc.perform(post("/api/leave-applications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveApplication)))
            .andExpect(status().isBadRequest());

        List<LeaveApplication> leaveApplicationList = leaveApplicationRepository.findAll();
        assertThat(leaveApplicationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkToDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveApplicationRepository.findAll().size();
        // set the field null
        leaveApplication.setToDate(null);

        // Create the LeaveApplication, which fails.

        restLeaveApplicationMockMvc.perform(post("/api/leave-applications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveApplication)))
            .andExpect(status().isBadRequest());

        List<LeaveApplication> leaveApplicationList = leaveApplicationRepository.findAll();
        assertThat(leaveApplicationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLeaveApplications() throws Exception {
        // Initialize the database
        leaveApplicationRepository.saveAndFlush(leaveApplication);

        // Get all the leaveApplicationList
        restLeaveApplicationMockMvc.perform(get("/api/leave-applications?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(leaveApplication.getId().intValue())))
            .andExpect(jsonPath("$.[*].reason").value(hasItem(DEFAULT_REASON.toString())))
            .andExpect(jsonPath("$.[*].fromDate").value(hasItem(DEFAULT_FROM_DATE.toString())))
            .andExpect(jsonPath("$.[*].toDate").value(hasItem(DEFAULT_TO_DATE.toString())))
            .andExpect(jsonPath("$.[*].noofday").value(hasItem(DEFAULT_NOOFDAY.doubleValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].flowStatus").value(hasItem(DEFAULT_FLOW_STATUS.toString())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())));
    }

    @Test
    @Transactional
    public void getLeaveApplication() throws Exception {
        // Initialize the database
        leaveApplicationRepository.saveAndFlush(leaveApplication);

        // Get the leaveApplication
        restLeaveApplicationMockMvc.perform(get("/api/leave-applications/{id}", leaveApplication.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(leaveApplication.getId().intValue()))
            .andExpect(jsonPath("$.reason").value(DEFAULT_REASON.toString()))
            .andExpect(jsonPath("$.fromDate").value(DEFAULT_FROM_DATE.toString()))
            .andExpect(jsonPath("$.toDate").value(DEFAULT_TO_DATE.toString()))
            .andExpect(jsonPath("$.noofday").value(DEFAULT_NOOFDAY.doubleValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.flowStatus").value(DEFAULT_FLOW_STATUS.toString()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLeaveApplication() throws Exception {
        // Get the leaveApplication
        restLeaveApplicationMockMvc.perform(get("/api/leave-applications/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLeaveApplication() throws Exception {
        // Initialize the database
        leaveApplicationRepository.saveAndFlush(leaveApplication);
        int databaseSizeBeforeUpdate = leaveApplicationRepository.findAll().size();

        // Update the leaveApplication
        LeaveApplication updatedLeaveApplication = leaveApplicationRepository.findOne(leaveApplication.getId());
        // Disconnect from session so that the updates on updatedLeaveApplication are not directly saved in db
        em.detach(updatedLeaveApplication);
        updatedLeaveApplication
            .reason(UPDATED_REASON)
            .fromDate(UPDATED_FROM_DATE)
            .toDate(UPDATED_TO_DATE)
            .noofday(UPDATED_NOOFDAY)
            .status(UPDATED_STATUS)
            .flowStatus(UPDATED_FLOW_STATUS)
            .comment(UPDATED_COMMENT);

        restLeaveApplicationMockMvc.perform(put("/api/leave-applications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLeaveApplication)))
            .andExpect(status().isOk());

        // Validate the LeaveApplication in the database
        List<LeaveApplication> leaveApplicationList = leaveApplicationRepository.findAll();
        assertThat(leaveApplicationList).hasSize(databaseSizeBeforeUpdate);
        LeaveApplication testLeaveApplication = leaveApplicationList.get(leaveApplicationList.size() - 1);
        assertThat(testLeaveApplication.getReason()).isEqualTo(UPDATED_REASON);
        assertThat(testLeaveApplication.getFromDate()).isEqualTo(UPDATED_FROM_DATE);
        assertThat(testLeaveApplication.getToDate()).isEqualTo(UPDATED_TO_DATE);
        assertThat(testLeaveApplication.getNoofday()).isEqualTo(UPDATED_NOOFDAY);
        assertThat(testLeaveApplication.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testLeaveApplication.getFlowStatus()).isEqualTo(UPDATED_FLOW_STATUS);
        assertThat(testLeaveApplication.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    public void updateNonExistingLeaveApplication() throws Exception {
        int databaseSizeBeforeUpdate = leaveApplicationRepository.findAll().size();

        // Create the LeaveApplication

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLeaveApplicationMockMvc.perform(put("/api/leave-applications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveApplication)))
            .andExpect(status().isCreated());

        // Validate the LeaveApplication in the database
        List<LeaveApplication> leaveApplicationList = leaveApplicationRepository.findAll();
        assertThat(leaveApplicationList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLeaveApplication() throws Exception {
        // Initialize the database
        leaveApplicationRepository.saveAndFlush(leaveApplication);
        int databaseSizeBeforeDelete = leaveApplicationRepository.findAll().size();

        // Get the leaveApplication
        restLeaveApplicationMockMvc.perform(delete("/api/leave-applications/{id}", leaveApplication.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<LeaveApplication> leaveApplicationList = leaveApplicationRepository.findAll();
        assertThat(leaveApplicationList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LeaveApplication.class);
        LeaveApplication leaveApplication1 = new LeaveApplication();
        leaveApplication1.setId(1L);
        LeaveApplication leaveApplication2 = new LeaveApplication();
        leaveApplication2.setId(leaveApplication1.getId());
        assertThat(leaveApplication1).isEqualTo(leaveApplication2);
        leaveApplication2.setId(2L);
        assertThat(leaveApplication1).isNotEqualTo(leaveApplication2);
        leaveApplication1.setId(null);
        assertThat(leaveApplication1).isNotEqualTo(leaveApplication2);
    }
}
