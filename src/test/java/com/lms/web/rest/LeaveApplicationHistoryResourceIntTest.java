package com.lms.web.rest;

import com.lms.LmsApp;

import com.lms.domain.LeaveApplicationHistory;
import com.lms.repository.EmployeeRepository;
import com.lms.repository.LeaveApplicationHistoryRepository;
import com.lms.repository.UserRepository;
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
 * Test class for the LeaveApplicationHistoryResource REST controller.
 *
 * @see LeaveApplicationHistoryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LmsApp.class)
public class LeaveApplicationHistoryResourceIntTest {

    private static final LocalDate DEFAULT_ACTION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_ACTION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_ACTION_INFO = "AAAAAAAAAA";
    private static final String UPDATED_ACTION_INFO = "BBBBBBBBBB";

    @Autowired
    private LeaveApplicationHistoryRepository leaveApplicationHistoryRepository;

    @Autowired
    private UserRepository userRepository;

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

    private MockMvc restLeaveApplicationHistoryMockMvc;

    private LeaveApplicationHistory leaveApplicationHistory;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LeaveApplicationHistoryResource leaveApplicationHistoryResource = new LeaveApplicationHistoryResource(leaveApplicationHistoryRepository,employeeRepository,userRepository);
        this.restLeaveApplicationHistoryMockMvc = MockMvcBuilders.standaloneSetup(leaveApplicationHistoryResource)
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
    public static LeaveApplicationHistory createEntity(EntityManager em) {
        LeaveApplicationHistory leaveApplicationHistory = new LeaveApplicationHistory()
            .actionDate(DEFAULT_ACTION_DATE)
            .status(DEFAULT_STATUS)
            .actionInfo(DEFAULT_ACTION_INFO);
        return leaveApplicationHistory;
    }

    @Before
    public void initTest() {
        leaveApplicationHistory = createEntity(em);
    }

    @Test
    @Transactional
    public void createLeaveApplicationHistory() throws Exception {
        int databaseSizeBeforeCreate = leaveApplicationHistoryRepository.findAll().size();

        // Create the LeaveApplicationHistory
        restLeaveApplicationHistoryMockMvc.perform(post("/api/leave-application-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveApplicationHistory)))
            .andExpect(status().isCreated());

        // Validate the LeaveApplicationHistory in the database
        List<LeaveApplicationHistory> leaveApplicationHistoryList = leaveApplicationHistoryRepository.findAll();
        assertThat(leaveApplicationHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        LeaveApplicationHistory testLeaveApplicationHistory = leaveApplicationHistoryList.get(leaveApplicationHistoryList.size() - 1);
        assertThat(testLeaveApplicationHistory.getActionDate()).isEqualTo(DEFAULT_ACTION_DATE);
        assertThat(testLeaveApplicationHistory.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testLeaveApplicationHistory.getActionInfo()).isEqualTo(DEFAULT_ACTION_INFO);
    }

    @Test
    @Transactional
    public void createLeaveApplicationHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = leaveApplicationHistoryRepository.findAll().size();

        // Create the LeaveApplicationHistory with an existing ID
        leaveApplicationHistory.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLeaveApplicationHistoryMockMvc.perform(post("/api/leave-application-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveApplicationHistory)))
            .andExpect(status().isBadRequest());

        // Validate the LeaveApplicationHistory in the database
        List<LeaveApplicationHistory> leaveApplicationHistoryList = leaveApplicationHistoryRepository.findAll();
        assertThat(leaveApplicationHistoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllLeaveApplicationHistories() throws Exception {
        // Initialize the database
        leaveApplicationHistoryRepository.saveAndFlush(leaveApplicationHistory);

        // Get all the leaveApplicationHistoryList
        restLeaveApplicationHistoryMockMvc.perform(get("/api/leave-application-histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(leaveApplicationHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].actionDate").value(hasItem(DEFAULT_ACTION_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].actionInfo").value(hasItem(DEFAULT_ACTION_INFO.toString())));
    }

    @Test
    @Transactional
    public void getLeaveApplicationHistory() throws Exception {
        // Initialize the database
        leaveApplicationHistoryRepository.saveAndFlush(leaveApplicationHistory);

        // Get the leaveApplicationHistory
        restLeaveApplicationHistoryMockMvc.perform(get("/api/leave-application-histories/{id}", leaveApplicationHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(leaveApplicationHistory.getId().intValue()))
            .andExpect(jsonPath("$.actionDate").value(DEFAULT_ACTION_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.actionInfo").value(DEFAULT_ACTION_INFO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLeaveApplicationHistory() throws Exception {
        // Get the leaveApplicationHistory
        restLeaveApplicationHistoryMockMvc.perform(get("/api/leave-application-histories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLeaveApplicationHistory() throws Exception {
        // Initialize the database
        leaveApplicationHistoryRepository.saveAndFlush(leaveApplicationHistory);
        int databaseSizeBeforeUpdate = leaveApplicationHistoryRepository.findAll().size();

        // Update the leaveApplicationHistory
        LeaveApplicationHistory updatedLeaveApplicationHistory = leaveApplicationHistoryRepository.findOne(leaveApplicationHistory.getId());
        // Disconnect from session so that the updates on updatedLeaveApplicationHistory are not directly saved in db
        em.detach(updatedLeaveApplicationHistory);
        updatedLeaveApplicationHistory
            .actionDate(UPDATED_ACTION_DATE)
            .status(UPDATED_STATUS)
            .actionInfo(UPDATED_ACTION_INFO);

        restLeaveApplicationHistoryMockMvc.perform(put("/api/leave-application-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLeaveApplicationHistory)))
            .andExpect(status().isOk());

        // Validate the LeaveApplicationHistory in the database
        List<LeaveApplicationHistory> leaveApplicationHistoryList = leaveApplicationHistoryRepository.findAll();
        assertThat(leaveApplicationHistoryList).hasSize(databaseSizeBeforeUpdate);
        LeaveApplicationHistory testLeaveApplicationHistory = leaveApplicationHistoryList.get(leaveApplicationHistoryList.size() - 1);
        assertThat(testLeaveApplicationHistory.getActionDate()).isEqualTo(UPDATED_ACTION_DATE);
        assertThat(testLeaveApplicationHistory.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testLeaveApplicationHistory.getActionInfo()).isEqualTo(UPDATED_ACTION_INFO);
    }

    @Test
    @Transactional
    public void updateNonExistingLeaveApplicationHistory() throws Exception {
        int databaseSizeBeforeUpdate = leaveApplicationHistoryRepository.findAll().size();

        // Create the LeaveApplicationHistory

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLeaveApplicationHistoryMockMvc.perform(put("/api/leave-application-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveApplicationHistory)))
            .andExpect(status().isCreated());

        // Validate the LeaveApplicationHistory in the database
        List<LeaveApplicationHistory> leaveApplicationHistoryList = leaveApplicationHistoryRepository.findAll();
        assertThat(leaveApplicationHistoryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLeaveApplicationHistory() throws Exception {
        // Initialize the database
        leaveApplicationHistoryRepository.saveAndFlush(leaveApplicationHistory);
        int databaseSizeBeforeDelete = leaveApplicationHistoryRepository.findAll().size();

        // Get the leaveApplicationHistory
        restLeaveApplicationHistoryMockMvc.perform(delete("/api/leave-application-histories/{id}", leaveApplicationHistory.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<LeaveApplicationHistory> leaveApplicationHistoryList = leaveApplicationHistoryRepository.findAll();
        assertThat(leaveApplicationHistoryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LeaveApplicationHistory.class);
        LeaveApplicationHistory leaveApplicationHistory1 = new LeaveApplicationHistory();
        leaveApplicationHistory1.setId(1L);
        LeaveApplicationHistory leaveApplicationHistory2 = new LeaveApplicationHistory();
        leaveApplicationHistory2.setId(leaveApplicationHistory1.getId());
        assertThat(leaveApplicationHistory1).isEqualTo(leaveApplicationHistory2);
        leaveApplicationHistory2.setId(2L);
        assertThat(leaveApplicationHistory1).isNotEqualTo(leaveApplicationHistory2);
        leaveApplicationHistory1.setId(null);
        assertThat(leaveApplicationHistory1).isNotEqualTo(leaveApplicationHistory2);
    }
}
