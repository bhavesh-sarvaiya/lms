package com.lms.web.rest;

import static com.lms.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import javax.persistence.EntityManager;

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

import com.lms.LmsApp;
import com.lms.domain.Employee;
import com.lms.domain.LeaveBalance;
import com.lms.repository.EmployeeRepository;
import com.lms.repository.LeaveBalanceRepository;
import com.lms.web.rest.errors.ExceptionTranslator;

/**
 * Test class for the LeaveBalanceResource REST controller.
 *
 * @see LeaveBalanceResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LmsApp.class)
public class LeaveBalanceResourceIntTest {

    private static final Double DEFAULT_NO_OF_LEAVE = 1.0;
    private static final Double UPDATED_NO_OF_LEAVE = 2.0;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;
    
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

    private MockMvc restLeaveBalanceMockMvc;

    private LeaveBalance leaveBalance;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LeaveBalanceResource leaveBalanceResource = new LeaveBalanceResource(leaveBalanceRepository,employeeRepository);
        this.restLeaveBalanceMockMvc = MockMvcBuilders.standaloneSetup(leaveBalanceResource)
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
    public static LeaveBalance createEntity(EntityManager em) {
        LeaveBalance leaveBalance = new LeaveBalance()
            .noOfLeave(DEFAULT_NO_OF_LEAVE);
        // Add required entity
        Employee employee = EmployeeResourceIntTest.createEntity(em);
        em.persist(employee);
        em.flush();
        leaveBalance.setEmployee(employee);
        return leaveBalance;
    }

    @Before
    public void initTest() {
        leaveBalance = createEntity(em);
    }

    @Test
    @Transactional
    public void createLeaveBalance() throws Exception {
        int databaseSizeBeforeCreate = leaveBalanceRepository.findAll().size();

        // Create the LeaveBalance
        restLeaveBalanceMockMvc.perform(post("/api/leave-balances")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveBalance)))
            .andExpect(status().isCreated());

        // Validate the LeaveBalance in the database
        List<LeaveBalance> leaveBalanceList = leaveBalanceRepository.findAll();
        assertThat(leaveBalanceList).hasSize(databaseSizeBeforeCreate + 1);
        LeaveBalance testLeaveBalance = leaveBalanceList.get(leaveBalanceList.size() - 1);
        assertThat(testLeaveBalance.getNoOfLeave()).isEqualTo(DEFAULT_NO_OF_LEAVE);
    }

    @Test
    @Transactional
    public void createLeaveBalanceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = leaveBalanceRepository.findAll().size();

        // Create the LeaveBalance with an existing ID
        leaveBalance.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLeaveBalanceMockMvc.perform(post("/api/leave-balances")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveBalance)))
            .andExpect(status().isBadRequest());

        // Validate the LeaveBalance in the database
        List<LeaveBalance> leaveBalanceList = leaveBalanceRepository.findAll();
        assertThat(leaveBalanceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNoOfLeaveIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveBalanceRepository.findAll().size();
        // set the field null
        leaveBalance.setNoOfLeave(null);

        // Create the LeaveBalance, which fails.

        restLeaveBalanceMockMvc.perform(post("/api/leave-balances")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveBalance)))
            .andExpect(status().isBadRequest());

        List<LeaveBalance> leaveBalanceList = leaveBalanceRepository.findAll();
        assertThat(leaveBalanceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLeaveBalances() throws Exception {
        // Initialize the database
        leaveBalanceRepository.saveAndFlush(leaveBalance);

        // Get all the leaveBalanceList
        restLeaveBalanceMockMvc.perform(get("/api/leave-balances?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(leaveBalance.getId().intValue())))
            .andExpect(jsonPath("$.[*].noOfLeave").value(hasItem(DEFAULT_NO_OF_LEAVE)));
    }

    @Test
    @Transactional
    public void getLeaveBalance() throws Exception {
        // Initialize the database
        leaveBalanceRepository.saveAndFlush(leaveBalance);

        // Get the leaveBalance
        restLeaveBalanceMockMvc.perform(get("/api/leave-balances/{id}", leaveBalance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(leaveBalance.getId().intValue()))
            .andExpect(jsonPath("$.noOfLeave").value(DEFAULT_NO_OF_LEAVE));
    }

    @Test
    @Transactional
    public void getNonExistingLeaveBalance() throws Exception {
        // Get the leaveBalance
        restLeaveBalanceMockMvc.perform(get("/api/leave-balances/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLeaveBalance() throws Exception {
        // Initialize the database
        leaveBalanceRepository.saveAndFlush(leaveBalance);
        int databaseSizeBeforeUpdate = leaveBalanceRepository.findAll().size();

        // Update the leaveBalance
        LeaveBalance updatedLeaveBalance = leaveBalanceRepository.findOne(leaveBalance.getId());
        // Disconnect from session so that the updates on updatedLeaveBalance are not directly saved in db
        em.detach(updatedLeaveBalance);
        updatedLeaveBalance
            .noOfLeave(UPDATED_NO_OF_LEAVE);

        restLeaveBalanceMockMvc.perform(put("/api/leave-balances")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLeaveBalance)))
            .andExpect(status().isOk());

        // Validate the LeaveBalance in the database
        List<LeaveBalance> leaveBalanceList = leaveBalanceRepository.findAll();
        assertThat(leaveBalanceList).hasSize(databaseSizeBeforeUpdate);
        LeaveBalance testLeaveBalance = leaveBalanceList.get(leaveBalanceList.size() - 1);
        assertThat(testLeaveBalance.getNoOfLeave()).isEqualTo(UPDATED_NO_OF_LEAVE);
    }

    @Test
    @Transactional
    public void updateNonExistingLeaveBalance() throws Exception {
        int databaseSizeBeforeUpdate = leaveBalanceRepository.findAll().size();

        // Create the LeaveBalance

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLeaveBalanceMockMvc.perform(put("/api/leave-balances")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveBalance)))
            .andExpect(status().isCreated());

        // Validate the LeaveBalance in the database
        List<LeaveBalance> leaveBalanceList = leaveBalanceRepository.findAll();
        assertThat(leaveBalanceList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLeaveBalance() throws Exception {
        // Initialize the database
        leaveBalanceRepository.saveAndFlush(leaveBalance);
        int databaseSizeBeforeDelete = leaveBalanceRepository.findAll().size();

        // Get the leaveBalance
        restLeaveBalanceMockMvc.perform(delete("/api/leave-balances/{id}", leaveBalance.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<LeaveBalance> leaveBalanceList = leaveBalanceRepository.findAll();
        assertThat(leaveBalanceList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LeaveBalance.class);
        LeaveBalance leaveBalance1 = new LeaveBalance();
        leaveBalance1.setId(1L);
        LeaveBalance leaveBalance2 = new LeaveBalance();
        leaveBalance2.setId(leaveBalance1.getId());
        assertThat(leaveBalance1).isEqualTo(leaveBalance2);
        leaveBalance2.setId(2L);
        assertThat(leaveBalance1).isNotEqualTo(leaveBalance2);
        leaveBalance1.setId(null);
        assertThat(leaveBalance1).isNotEqualTo(leaveBalance2);
    }
}
