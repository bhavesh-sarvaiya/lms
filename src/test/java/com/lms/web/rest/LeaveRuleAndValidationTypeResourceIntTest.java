package com.lms.web.rest;

import com.lms.LmsApp;

import com.lms.domain.LeaveRuleAndValidationType;
import com.lms.domain.LeaveRule;
import com.lms.repository.LeaveRuleAndValidationTypeRepository;
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
import com.lms.domain.enumeration.ValidationType;
/**
 * Test class for the LeaveRuleAndValidationTypeResource REST controller.
 *
 * @see LeaveRuleAndValidationTypeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LmsApp.class)
public class LeaveRuleAndValidationTypeResourceIntTest {

    private static final EmpType2 DEFAULT_EMPLOYEE_TYPE = EmpType2.ALL;
    private static final EmpType2 UPDATED_EMPLOYEE_TYPE = EmpType2.MANAGEMENT_AND_EDUCATIONAL;

    private static final ValidationType DEFAULT_VALIDATION_TYPE = ValidationType.LEVEL1;
    private static final ValidationType UPDATED_VALIDATION_TYPE = ValidationType.LEVEL2;

    private static final Double DEFAULT_LEVEL_1 = 1D;
    private static final Double UPDATED_LEVEL_1 = 2D;

    private static final Double DEFAULT_LEVEL_2 = 1D;
    private static final Double UPDATED_LEVEL_2 = 2D;

    private static final Double DEFAULT_LEVEL_3 = 1D;
    private static final Double UPDATED_LEVEL_3 = 2D;

    private static final Double DEFAULT_LEVEL_4 = 1D;
    private static final Double UPDATED_LEVEL_4 = 2D;

    private static final Double DEFAULT_LEVEL_5 = 1D;
    private static final Double UPDATED_LEVEL_5 = 2D;

    private static final Double DEFAULT_LEVEL_6 = 1D;
    private static final Double UPDATED_LEVEL_6 = 2D;

    @Autowired
    private LeaveRuleAndValidationTypeRepository leaveRuleAndValidationTypeRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLeaveRuleAndValidationTypeMockMvc;

    private LeaveRuleAndValidationType leaveRuleAndValidationType;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LeaveRuleAndValidationTypeResource leaveRuleAndValidationTypeResource = new LeaveRuleAndValidationTypeResource(leaveRuleAndValidationTypeRepository);
        this.restLeaveRuleAndValidationTypeMockMvc = MockMvcBuilders.standaloneSetup(leaveRuleAndValidationTypeResource)
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
    public static LeaveRuleAndValidationType createEntity(EntityManager em) {
        LeaveRuleAndValidationType leaveRuleAndValidationType = new LeaveRuleAndValidationType()
            .employeeType(DEFAULT_EMPLOYEE_TYPE)
            .validationType(DEFAULT_VALIDATION_TYPE)
            .level1(DEFAULT_LEVEL_1)
            .level2(DEFAULT_LEVEL_2)
            .level3(DEFAULT_LEVEL_3)
            .level4(DEFAULT_LEVEL_4)
            .level5(DEFAULT_LEVEL_5)
            .level6(DEFAULT_LEVEL_6);
        // Add required entity
        LeaveRule leaveRule = LeaveRuleResourceIntTest.createEntity(em);
        em.persist(leaveRule);
        em.flush();
        leaveRuleAndValidationType.setLeaveRule(leaveRule);
        return leaveRuleAndValidationType;
    }

    @Before
    public void initTest() {
        leaveRuleAndValidationType = createEntity(em);
    }

    @Test
    @Transactional
    public void createLeaveRuleAndValidationType() throws Exception {
        int databaseSizeBeforeCreate = leaveRuleAndValidationTypeRepository.findAll().size();

        // Create the LeaveRuleAndValidationType
        restLeaveRuleAndValidationTypeMockMvc.perform(post("/api/leave-rule-and-validation-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndValidationType)))
            .andExpect(status().isCreated());

        // Validate the LeaveRuleAndValidationType in the database
        List<LeaveRuleAndValidationType> leaveRuleAndValidationTypeList = leaveRuleAndValidationTypeRepository.findAll();
        assertThat(leaveRuleAndValidationTypeList).hasSize(databaseSizeBeforeCreate + 1);
        LeaveRuleAndValidationType testLeaveRuleAndValidationType = leaveRuleAndValidationTypeList.get(leaveRuleAndValidationTypeList.size() - 1);
        assertThat(testLeaveRuleAndValidationType.getEmployeeType()).isEqualTo(DEFAULT_EMPLOYEE_TYPE);
        assertThat(testLeaveRuleAndValidationType.getValidationType()).isEqualTo(DEFAULT_VALIDATION_TYPE);
        assertThat(testLeaveRuleAndValidationType.getLevel1()).isEqualTo(DEFAULT_LEVEL_1);
        assertThat(testLeaveRuleAndValidationType.getLevel2()).isEqualTo(DEFAULT_LEVEL_2);
        assertThat(testLeaveRuleAndValidationType.getLevel3()).isEqualTo(DEFAULT_LEVEL_3);
        assertThat(testLeaveRuleAndValidationType.getLevel4()).isEqualTo(DEFAULT_LEVEL_4);
        assertThat(testLeaveRuleAndValidationType.getLevel5()).isEqualTo(DEFAULT_LEVEL_5);
        assertThat(testLeaveRuleAndValidationType.getLevel6()).isEqualTo(DEFAULT_LEVEL_6);
    }

    @Test
    @Transactional
    public void createLeaveRuleAndValidationTypeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = leaveRuleAndValidationTypeRepository.findAll().size();

        // Create the LeaveRuleAndValidationType with an existing ID
        leaveRuleAndValidationType.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLeaveRuleAndValidationTypeMockMvc.perform(post("/api/leave-rule-and-validation-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndValidationType)))
            .andExpect(status().isBadRequest());

        // Validate the LeaveRuleAndValidationType in the database
        List<LeaveRuleAndValidationType> leaveRuleAndValidationTypeList = leaveRuleAndValidationTypeRepository.findAll();
        assertThat(leaveRuleAndValidationTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkEmployeeTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveRuleAndValidationTypeRepository.findAll().size();
        // set the field null
        leaveRuleAndValidationType.setEmployeeType(null);

        // Create the LeaveRuleAndValidationType, which fails.

        restLeaveRuleAndValidationTypeMockMvc.perform(post("/api/leave-rule-and-validation-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndValidationType)))
            .andExpect(status().isBadRequest());

        List<LeaveRuleAndValidationType> leaveRuleAndValidationTypeList = leaveRuleAndValidationTypeRepository.findAll();
        assertThat(leaveRuleAndValidationTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkValidationTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveRuleAndValidationTypeRepository.findAll().size();
        // set the field null
        leaveRuleAndValidationType.setValidationType(null);

        // Create the LeaveRuleAndValidationType, which fails.

        restLeaveRuleAndValidationTypeMockMvc.perform(post("/api/leave-rule-and-validation-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndValidationType)))
            .andExpect(status().isBadRequest());

        List<LeaveRuleAndValidationType> leaveRuleAndValidationTypeList = leaveRuleAndValidationTypeRepository.findAll();
        assertThat(leaveRuleAndValidationTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLevel1IsRequired() throws Exception {
        int databaseSizeBeforeTest = leaveRuleAndValidationTypeRepository.findAll().size();
        // set the field null
        leaveRuleAndValidationType.setLevel1(null);

        // Create the LeaveRuleAndValidationType, which fails.

        restLeaveRuleAndValidationTypeMockMvc.perform(post("/api/leave-rule-and-validation-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndValidationType)))
            .andExpect(status().isBadRequest());

        List<LeaveRuleAndValidationType> leaveRuleAndValidationTypeList = leaveRuleAndValidationTypeRepository.findAll();
        assertThat(leaveRuleAndValidationTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLeaveRuleAndValidationTypes() throws Exception {
        // Initialize the database
        leaveRuleAndValidationTypeRepository.saveAndFlush(leaveRuleAndValidationType);

        // Get all the leaveRuleAndValidationTypeList
        restLeaveRuleAndValidationTypeMockMvc.perform(get("/api/leave-rule-and-validation-types?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(leaveRuleAndValidationType.getId().intValue())))
            .andExpect(jsonPath("$.[*].employeeType").value(hasItem(DEFAULT_EMPLOYEE_TYPE.toString())))
            .andExpect(jsonPath("$.[*].validationType").value(hasItem(DEFAULT_VALIDATION_TYPE.toString())))
            .andExpect(jsonPath("$.[*].level1").value(hasItem(DEFAULT_LEVEL_1.doubleValue())))
            .andExpect(jsonPath("$.[*].level2").value(hasItem(DEFAULT_LEVEL_2.doubleValue())))
            .andExpect(jsonPath("$.[*].level3").value(hasItem(DEFAULT_LEVEL_3.doubleValue())))
            .andExpect(jsonPath("$.[*].level4").value(hasItem(DEFAULT_LEVEL_4.doubleValue())))
            .andExpect(jsonPath("$.[*].level5").value(hasItem(DEFAULT_LEVEL_5.doubleValue())))
            .andExpect(jsonPath("$.[*].level6").value(hasItem(DEFAULT_LEVEL_6.doubleValue())));
    }

    @Test
    @Transactional
    public void getLeaveRuleAndValidationType() throws Exception {
        // Initialize the database
        leaveRuleAndValidationTypeRepository.saveAndFlush(leaveRuleAndValidationType);

        // Get the leaveRuleAndValidationType
        restLeaveRuleAndValidationTypeMockMvc.perform(get("/api/leave-rule-and-validation-types/{id}", leaveRuleAndValidationType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(leaveRuleAndValidationType.getId().intValue()))
            .andExpect(jsonPath("$.employeeType").value(DEFAULT_EMPLOYEE_TYPE.toString()))
            .andExpect(jsonPath("$.validationType").value(DEFAULT_VALIDATION_TYPE.toString()))
            .andExpect(jsonPath("$.level1").value(DEFAULT_LEVEL_1.doubleValue()))
            .andExpect(jsonPath("$.level2").value(DEFAULT_LEVEL_2.doubleValue()))
            .andExpect(jsonPath("$.level3").value(DEFAULT_LEVEL_3.doubleValue()))
            .andExpect(jsonPath("$.level4").value(DEFAULT_LEVEL_4.doubleValue()))
            .andExpect(jsonPath("$.level5").value(DEFAULT_LEVEL_5.doubleValue()))
            .andExpect(jsonPath("$.level6").value(DEFAULT_LEVEL_6.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingLeaveRuleAndValidationType() throws Exception {
        // Get the leaveRuleAndValidationType
        restLeaveRuleAndValidationTypeMockMvc.perform(get("/api/leave-rule-and-validation-types/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLeaveRuleAndValidationType() throws Exception {
        // Initialize the database
        leaveRuleAndValidationTypeRepository.saveAndFlush(leaveRuleAndValidationType);
        int databaseSizeBeforeUpdate = leaveRuleAndValidationTypeRepository.findAll().size();

        // Update the leaveRuleAndValidationType
        LeaveRuleAndValidationType updatedLeaveRuleAndValidationType = leaveRuleAndValidationTypeRepository.findOne(leaveRuleAndValidationType.getId());
        // Disconnect from session so that the updates on updatedLeaveRuleAndValidationType are not directly saved in db
        em.detach(updatedLeaveRuleAndValidationType);
        updatedLeaveRuleAndValidationType
            .employeeType(UPDATED_EMPLOYEE_TYPE)
            .validationType(UPDATED_VALIDATION_TYPE)
            .level1(UPDATED_LEVEL_1)
            .level2(UPDATED_LEVEL_2)
            .level3(UPDATED_LEVEL_3)
            .level4(UPDATED_LEVEL_4)
            .level5(UPDATED_LEVEL_5)
            .level6(UPDATED_LEVEL_6);

        restLeaveRuleAndValidationTypeMockMvc.perform(put("/api/leave-rule-and-validation-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLeaveRuleAndValidationType)))
            .andExpect(status().isOk());

        // Validate the LeaveRuleAndValidationType in the database
        List<LeaveRuleAndValidationType> leaveRuleAndValidationTypeList = leaveRuleAndValidationTypeRepository.findAll();
        assertThat(leaveRuleAndValidationTypeList).hasSize(databaseSizeBeforeUpdate);
        LeaveRuleAndValidationType testLeaveRuleAndValidationType = leaveRuleAndValidationTypeList.get(leaveRuleAndValidationTypeList.size() - 1);
        assertThat(testLeaveRuleAndValidationType.getEmployeeType()).isEqualTo(UPDATED_EMPLOYEE_TYPE);
        assertThat(testLeaveRuleAndValidationType.getValidationType()).isEqualTo(UPDATED_VALIDATION_TYPE);
        assertThat(testLeaveRuleAndValidationType.getLevel1()).isEqualTo(UPDATED_LEVEL_1);
        assertThat(testLeaveRuleAndValidationType.getLevel2()).isEqualTo(UPDATED_LEVEL_2);
        assertThat(testLeaveRuleAndValidationType.getLevel3()).isEqualTo(UPDATED_LEVEL_3);
        assertThat(testLeaveRuleAndValidationType.getLevel4()).isEqualTo(UPDATED_LEVEL_4);
        assertThat(testLeaveRuleAndValidationType.getLevel5()).isEqualTo(UPDATED_LEVEL_5);
        assertThat(testLeaveRuleAndValidationType.getLevel6()).isEqualTo(UPDATED_LEVEL_6);
    }

    @Test
    @Transactional
    public void updateNonExistingLeaveRuleAndValidationType() throws Exception {
        int databaseSizeBeforeUpdate = leaveRuleAndValidationTypeRepository.findAll().size();

        // Create the LeaveRuleAndValidationType

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLeaveRuleAndValidationTypeMockMvc.perform(put("/api/leave-rule-and-validation-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(leaveRuleAndValidationType)))
            .andExpect(status().isCreated());

        // Validate the LeaveRuleAndValidationType in the database
        List<LeaveRuleAndValidationType> leaveRuleAndValidationTypeList = leaveRuleAndValidationTypeRepository.findAll();
        assertThat(leaveRuleAndValidationTypeList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLeaveRuleAndValidationType() throws Exception {
        // Initialize the database
        leaveRuleAndValidationTypeRepository.saveAndFlush(leaveRuleAndValidationType);
        int databaseSizeBeforeDelete = leaveRuleAndValidationTypeRepository.findAll().size();

        // Get the leaveRuleAndValidationType
        restLeaveRuleAndValidationTypeMockMvc.perform(delete("/api/leave-rule-and-validation-types/{id}", leaveRuleAndValidationType.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<LeaveRuleAndValidationType> leaveRuleAndValidationTypeList = leaveRuleAndValidationTypeRepository.findAll();
        assertThat(leaveRuleAndValidationTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LeaveRuleAndValidationType.class);
        LeaveRuleAndValidationType leaveRuleAndValidationType1 = new LeaveRuleAndValidationType();
        leaveRuleAndValidationType1.setId(1L);
        LeaveRuleAndValidationType leaveRuleAndValidationType2 = new LeaveRuleAndValidationType();
        leaveRuleAndValidationType2.setId(leaveRuleAndValidationType1.getId());
        assertThat(leaveRuleAndValidationType1).isEqualTo(leaveRuleAndValidationType2);
        leaveRuleAndValidationType2.setId(2L);
        assertThat(leaveRuleAndValidationType1).isNotEqualTo(leaveRuleAndValidationType2);
        leaveRuleAndValidationType1.setId(null);
        assertThat(leaveRuleAndValidationType1).isNotEqualTo(leaveRuleAndValidationType2);
    }
}
