package com.lms.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.lms.domain.Department;
import com.lms.domain.Employee;
import com.lms.domain.LeaveApplication;
import com.lms.domain.LeaveApplicationHistory;
import com.lms.domain.LeaveBalance;
import com.lms.domain.LeaveRule;
import com.lms.domain.LeaveRuleAndMaxMinLeave;
import com.lms.domain.LeaveType;
import com.lms.domain.enumeration.EmpType2;
import com.lms.domain.enumeration.Post;
import com.lms.repository.EmployeeRepository;
import com.lms.repository.LeaveApplicationHistoryRepository;
import com.lms.repository.LeaveApplicationRepository;
import com.lms.repository.LeaveBalanceRepository;
import com.lms.repository.LeaveRuleAndMaxMinLeaveRepository;
import com.lms.repository.LeaveRuleAndNoOfDayRepository;
import com.lms.repository.LeaveRuleAndValidationTypeRepository;
import com.lms.repository.LeaveRuleRepository;
import com.lms.repository.LeaveTypeRepository;
import com.lms.repository.UserRepository;
import com.lms.security.SecurityUtils;
import com.lms.web.rest.errors.BadRequestAlertException;
import com.lms.web.rest.errors.CustomParameterizedException;
import com.lms.web.rest.util.HeaderUtil;

import io.github.jhipster.web.util.ResponseUtil;
import liquibase.exception.CustomChangeException;


/**
 * REST controller for managing LeaveApplication.
 */
@RestController
@RequestMapping("/api")
public class LeaveApplicationResource {

    private final Logger log = LoggerFactory.getLogger(LeaveApplicationResource.class);
    
    private static final String ENTITY_NAME = "leaveApplication";
    
    private static final String APPLIED = "APPLIED";
    private static final String REJECTED = "REJECTED";
    private static final String APPROVED = "APPROVED";
    private final LeaveApplicationRepository leaveApplicationRepository;
    private final LeaveApplicationHistoryRepository leaveApplicationHistoryRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveRuleRepository leaveRuleRepository;
    private final LeaveRuleAndMaxMinLeaveRepository leaveRuleAndMaxMinLeaveRepository;
    private final UserRepository userRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveTypeRepository leaveTypeRepository;

    public LeaveApplicationResource(LeaveApplicationRepository leaveApplicationRepository,
    		EmployeeRepository employeeRepository,LeaveBalanceRepository leaveBalanceRepository, 
    		UserRepository userRepository,LeaveApplicationHistoryRepository leaveApplicationHistoryRepository,
    		LeaveRuleRepository leaveRuleRepository,LeaveRuleAndMaxMinLeaveRepository leaveRuleAndMaxMinLeaveRepository,
    	LeaveTypeRepository leaveTypeRepository) {
        this.leaveApplicationRepository = leaveApplicationRepository;
        this.employeeRepository=employeeRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.userRepository = userRepository;
        this.leaveApplicationHistoryRepository = leaveApplicationHistoryRepository;
        this.leaveRuleAndMaxMinLeaveRepository = leaveRuleAndMaxMinLeaveRepository;
        this.leaveRuleRepository = leaveRuleRepository;
        this.leaveTypeRepository = leaveTypeRepository;
    }

    public void checkValidation(LeaveApplication leaveApplication){
        if(leaveApplication.getLeaveType() == null){
        	throw new CustomParameterizedException("Please select leave type", "custom.error");
        }
        if(leaveApplication.getFromDate() == null){
        	throw new CustomParameterizedException("Please enter start date", "custom.error");
        }
        if(leaveApplication.getToDate() == null){
        	throw new CustomParameterizedException("Please enter end date", "custom.error");
        }
        if(leaveApplication.getToDate().isBefore(leaveApplication.getFromDate())){
        	throw new CustomParameterizedException("Please enter valid date\nStart date should be less than end date", "custom.error");
        }
        if(leaveApplication.getReason().trim().equals("")){
        	throw new CustomParameterizedException("Please enter reason for leave", "custom.error");
        }
    }

    /**
     * POST  /leave-applications : Create a new leaveApplication.
     *
     * @param leaveApplication the leaveApplication to create
     * @return the ResponseEntity with status 201 (Created) and with body the new leaveApplication, or with status 400 (Bad Request) if the leaveApplication has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/leave-applications")
    @Timed
    public ResponseEntity<LeaveApplication> createLeaveApplication(@Valid @RequestBody LeaveApplication leaveApplication) throws URISyntaxException {
        log.debug("REST request to save LeaveApplication : {}", leaveApplication);
        LeaveApplication result = null;

        if (leaveApplication.getId() != null) {
            throw new BadRequestAlertException("A new leaveApplication cannot already have an ID", ENTITY_NAME,
                    "idexists");
        }
        checkValidation(leaveApplication);
        Employee employee = getLoggedUser();
        Double noOfDay = leaveApplication.getNoofday();

        leaveApplication.setEmployee(employee);
        leaveApplication.setLeaveType(leaveTypeRepository.findOne(leaveApplication.getLeaveType().getId()));
        LeaveRule leaveRule = leaveRuleRepository.findOneByLeave(leaveApplication.getLeaveType());

        if(leaveRule == null){
            throw new CustomParameterizedException("This leave type of leave application has no rule\nPlease contact to authority" ,"custom.error");
        }
        // check gender
        checkLeaveGender(leaveRule, employee);

        if (noOfDay < 1) {
            throw new CustomParameterizedException("No of day should be more than 0" ,"custom.error");
        }
        // get leave balance
        Double leaveBalance = leaveBalanceRepository.findOneByEmployeeAndLeaveType(leaveApplication.getEmployee(),
                leaveApplication.getLeaveType());
        // check he/she has leave balance
        if (leaveBalance == null) {
            throw new BadRequestAlertException(
                    "You have not been assigned this type of leave, \nPlease Contact to Authority", ENTITY_NAME,
                    "leaveNotAssign");
        }
        if (leaveApplication.getJoinLeave() == null) {
            leaveApplication.setJoinLeave("none");
        } else {
            if (!leaveApplication.getJoinLeave().equalsIgnoreCase("none")) {
            	leaveApplication.setJoinLeaveDay(noOfDay - leaveBalance);
            }
        }

        // check min max leave
        checkMaxMinLeave(leaveRule, noOfDay, employee);
        

        // to check if employee is going to take join leave
        if (!leaveApplication.getJoinLeave().equalsIgnoreCase("none")) {
            checkJoinLeaveBalance(leaveApplication, noOfDay, leaveBalance, employee);
        } else {
            checkLeaveBalance(leaveApplication, leaveBalance);
        }
        leaveApplication.setStatus(APPLIED);
        leaveApplication.setFlowStatus("NEW");
        leaveApplication.setNoofday(leaveApplication.getNoofday()-leaveApplication.getJoinLeaveDay());
        result = leaveApplicationRepository.save(leaveApplication);

        saveLeaveAppHistory(result, "");
        return ResponseEntity.created(new URI("/api/leave-applications/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
    }

    private void checkLeaveGender(LeaveRule leaveRule,Employee employee){
        String gender = leaveRule.getLeaveFor().name();
        if (!gender.equalsIgnoreCase("BOTH")) {
            if (!employee.getGender().toString().equalsIgnoreCase(gender)) {
                throw new CustomParameterizedException("This leave only for " + gender,"custom.error");
            }
        }
    }

    protected void checkLeaveBalance(LeaveApplication leaveApplication,Double leaveBalance){
        List<LeaveApplication> leaveApplicationList = leaveApplicationRepository.findAllByEmployeeAndLeaveTypeAndStatus(
                leaveApplication.getEmployee(), leaveApplication.getLeaveType(), APPLIED);

        // check applied leave balance
        Double totalAppliedLeave = 0.0;
        if (!leaveApplicationList.isEmpty()) {
            for (LeaveApplication l : leaveApplicationList) {
                totalAppliedLeave += l.getNoofday();
            }

            if ((totalAppliedLeave + leaveApplication.getNoofday()) > leaveBalance) {
                throw new BadRequestAlertException(
                        "You are not eligible for this type of leave \n Because you were already requested more than that",
                        ENTITY_NAME, "alreadyReaquested");
            }
        } else {
            // check enough leave balance
            if (leaveApplication.getNoofday() > leaveBalance) {
                throw new BadRequestAlertException(
                        "You are not eligible for this type of leave \n Because you have only " + leaveBalance
                                + " and it is less than that ",
                        ENTITY_NAME, "notEligible");
            }
        }
        
		leaveApplicationList = leaveApplicationRepository.findAllByEmployeeAndStatusAndJoinLeave(
				leaveApplication.getEmployee(), APPLIED, leaveApplication.getLeaveType().getCode());
		Double totalAppliedJoinLeave = totalAppliedLeave;
		if (!leaveApplicationList.isEmpty()) {
			for (LeaveApplication l : leaveApplicationList) {
				totalAppliedJoinLeave += l.getJoinLeaveDay();
			}

		}
		// check he/she has enough join leave balance
		if (totalAppliedJoinLeave+leaveApplication.getNoofday() > leaveBalance) {
			throw new CustomParameterizedException(
                    "You are not eligible for this type of leave \n Because you have already applied " + totalAppliedJoinLeave
                            + " leave and you have just "+leaveBalance,"custom.error");
		}
        
    }
    private void checkJoinLeaveBalance(LeaveApplication leaveApplication,Double noOfDay,Double leaveBalance,Employee employee){

    	List<LeaveApplication> leaveApplicationList = leaveApplicationRepository.findAllByEmployeeAndStatusAndJoinLeave(
				leaveApplication.getEmployee(), APPLIED, leaveApplication.getLeaveType().getCode());
        
		Double totalAppliedLeave=0.0;
		if (!leaveApplicationList.isEmpty()) {
			Double totalAppliedJoinLeave=0.0;
			for (LeaveApplication l : leaveApplicationList) {
				totalAppliedJoinLeave += l.getJoinLeaveDay();
			}
			totalAppliedLeave = totalAppliedJoinLeave;
			
		}
        
         leaveApplicationList = leaveApplicationRepository.findAllByEmployeeAndLeaveTypeAndStatus(
                leaveApplication.getEmployee(), leaveApplication.getLeaveType(), APPLIED);
        
        // check applied leave balance
        if (!leaveApplicationList.isEmpty()) {
            for (LeaveApplication l : leaveApplicationList) {
                totalAppliedLeave += l.getNoofday();
            }
            Double availableLeave = leaveBalance - totalAppliedLeave;
            
            
            // check leave requested day is < leave balance
            if (noOfDay < availableLeave) {
                throw new BadRequestAlertException("You have enough leave balance, can't take join leave", ENTITY_NAME,
                        "canNotJoinLeave");
            }

        }
        // check leave requested day is < leave balance
        else if  (leaveBalance >= noOfDay+totalAppliedLeave) {
            throw new BadRequestAlertException("You have enough leave balance, can't take join leave", ENTITY_NAME,
                    "canNotJoinLeave");
        }
        if(totalAppliedLeave >= leaveBalance){
        	 throw new CustomParameterizedException("You don't have leave balance of this type of leave application \n Because you were applied "+totalAppliedLeave+" leave", "custom.error");
        }
        Double joinLeaveBalance = leaveBalanceRepository.findOneByEmployeeAndLeaveType(leaveApplication.getEmployee(),
                leaveTypeRepository.findOneByCode(leaveApplication.getJoinLeave()));
        // check he/she has join leave balance 
        if (joinLeaveBalance == null) {
            throw new BadRequestAlertException(
                    "You have not been assigned join leave type balance, \nPlease Contact to Authority", ENTITY_NAME,
                    "joinLeaveNotAssign");
        }

        leaveApplicationList = leaveApplicationRepository.findAllByEmployeeAndStatusAndJoinLeave(employee, APPLIED,
                leaveApplication.getJoinLeave());
        leaveApplication.setJoinLeaveDay(leaveApplication.getJoinLeaveDay() + totalAppliedLeave);
        if (!leaveApplicationList.isEmpty()) {
            Double totalAppliedJoinLeave = 0.0;
            for (LeaveApplication l : leaveApplicationList) {
                totalAppliedJoinLeave += l.getJoinLeaveDay();
            }
            // check applied join leave
            if (totalAppliedJoinLeave + leaveApplication.getJoinLeaveDay() > joinLeaveBalance) {
                throw new BadRequestAlertException(
                        "You not have enough join leave balance, can't take join leave\n Please select other join leave",
                        ENTITY_NAME, "notEnoughJoinLeave");
            }
        } else {
            // check he/she has enough join leave balance
            if (leaveApplication.getJoinLeaveDay() > joinLeaveBalance) {
                throw new BadRequestAlertException(
                        "You not have enough join leave balance, can't take join leave\n Please select other join leave",
                        ENTITY_NAME, "notEnoughJoinLeave");
            }
        }
    }
    private void checkMaxMinLeave(LeaveRule leaveRule,Double intervalDays,Employee employee){
        
        List<LeaveRuleAndMaxMinLeave> leaveRuleAndMaxMinLeaves = leaveRuleAndMaxMinLeaveRepository
                .findAllByLeaveRule(leaveRule);
        if (leaveRuleAndMaxMinLeaves.size() > 1) {
            if (!employee.isTeachingstaff() && employee.isGranted()) {
                Double maxDay = leaveRuleAndMaxMinLeaveRepository.findMaxLeaveLimitByLeaveRuleAndEmployeeType(leaveRule,
                        EmpType2.MANAGEMENT);
                Double minDay = leaveRuleAndMaxMinLeaveRepository.findMinLeaveLimitByLeaveRuleAndEmployeeType(leaveRule,
                        EmpType2.MANAGEMENT);
                if(maxDay ==null && minDay == null) {
               	 System.err.println("maxDay: "+maxDay);
               	 System.err.println("minDay: "+minDay);
               	 throw new CustomParameterizedException("Problem in leave Rule\nPlease inform to Authority", "custom.error");
                }
                if (intervalDays > maxDay) {
                    throw new BadRequestAlertException("You reached max leave limit", ENTITY_NAME, "maxLeaveLimit");
                } else if (intervalDays < minDay) {
                    throw new BadRequestAlertException("You can't take leave below some limit", ENTITY_NAME,
                            "minLeaveLimit");
                }

            } else {
            	 Double maxDay = leaveRuleAndMaxMinLeaveRepository.findMaxLeaveLimitByLeaveRuleAndEmployeeType(leaveRule,
                         EmpType2.EDUCATIONAL);
                 Double minDay = leaveRuleAndMaxMinLeaveRepository.findMinLeaveLimitByLeaveRuleAndEmployeeType(leaveRule,
                         EmpType2.EDUCATIONAL);
                 if(maxDay ==null && minDay == null) {
                	 System.err.println("maxDay: "+maxDay);
                	 System.err.println("minDay: "+minDay);
                	 throw new CustomParameterizedException("Problem in leave Rule\nPlease inform to Authority", "custom.error");
                 }
                if (intervalDays > maxDay) {
                    throw new BadRequestAlertException("You reached max leave limit", ENTITY_NAME, "maxLeaveLimit");
                } else if (intervalDays < minDay) {
                    throw new BadRequestAlertException("You can't take leave below some limit", ENTITY_NAME,
                            "minLeaveLimit");
                }

            }
        }
    }
	private void saveLeaveAppHistory(LeaveApplication result, String forward) {
		LeaveApplicationHistory leaveApplicationHistory = new LeaveApplicationHistory();
        leaveApplicationHistory.setActionDate(LocalDate.now());
        leaveApplicationHistory.setStatus(result.getStatus());
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");  
        LocalDateTime now = LocalDateTime.now(); 
        String actor = getLoggedUser().getUser().getLogin();
        String dateTime = dtf.format(now);
        if(result.getStatus().equalsIgnoreCase(APPLIED)) {
        	 leaveApplicationHistory.setActionInfo("New leave request by " + actor+ " at " + dateTime );
        }
        else if(result.getStatus().equalsIgnoreCase(APPROVED)) {
        	 leaveApplicationHistory.setActionInfo("Leave approved by " + actor + " at " + dateTime );
        }
        else if(result.getStatus().equalsIgnoreCase("FORWARD")) {
       	 leaveApplicationHistory.setActionInfo("Leave forwarded by " + actor + " at " + dateTime + " to " + forward);
       }
        else  if(result.getStatus().equalsIgnoreCase(REJECTED)){
        	 leaveApplicationHistory.setActionInfo("Leave Reject by " + actor  + " at " + dateTime);
        }
        leaveApplicationHistory.setEmployee(result.getEmployee());
        leaveApplicationHistory.setLeaveType(result.getLeaveType());
        leaveApplicationHistory.setActor(getLoggedUser());
        leaveApplicationHistoryRepository.save(leaveApplicationHistory);
	}
    private Employee getLoggedUser()
    {
        return employeeRepository.findOneByUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().get()).get());
    }
    /**
     * PUT  /leave-applications : Updates an existing leaveApplication.
     *
     * @param leaveApplication the leaveApplication to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated leaveApplication,
     * or with status 400 (Bad Request) if the leaveApplication is not valid,
     * or with status 500 (Internal Server Error) if the leaveApplication couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/leave-applications")
    @Timed
    public ResponseEntity<LeaveApplication> updateLeaveApplication(@Valid @RequestBody LeaveApplication leaveApplication) throws URISyntaxException {
        log.debug("REST request to update LeaveApplication : {}", leaveApplication);
        if (leaveApplication.getId() == null) {
            return createLeaveApplication(leaveApplication); 
        }

        LeaveApplication l= leaveApplicationRepository.findOne(leaveApplication.getId());

        if(l != null) {
            if(!l.getStatus().equalsIgnoreCase(APPLIED)){
                throw new CustomParameterizedException("This leave application already " + l.getStatus(),"custome.error" );
            }
        }

        String status=leaveApplication.getStatus();
       
        if(status.equals(APPROVED) || status.equals(REJECTED))
        {
            if(leaveApplication.getStatus().equalsIgnoreCase(APPROVED))
            {
                System.out.println("\n########status: "+status);
                LeaveBalance leaveBalance;
                
                if(!leaveApplication.getJoinLeave().equalsIgnoreCase("none")){
                	leaveBalance = leaveBalanceRepository.findOneByLeaveTypeAndEmployee(leaveTypeRepository.findOneByCode(leaveApplication.getJoinLeave()),leaveApplication.getEmployee());
                	if(leaveApplication.getJoinLeaveDay() > leaveBalance.getNoOfLeave()){
                		leaveApplication.setStatus(APPLIED);
                		throw new CustomParameterizedException("This leave type has no enough join leave balance","custome.error" );
                	}
                	leaveBalance.setNoOfLeave(leaveBalance.getNoOfLeave()-leaveApplication.getJoinLeaveDay());
                	leaveBalance = leaveBalanceRepository.save(leaveBalance);
                	if(leaveBalance == null){
                		leaveApplication.setStatus(APPLIED);
                		throw new CustomParameterizedException("Error in leave approve","custome.error" );
                	}
                	leaveBalance = leaveBalanceRepository.findOneByLeaveTypeAndEmployee(leaveApplication.getLeaveType(),leaveApplication.getEmployee());
                	
                	leaveBalance.setNoOfLeave(leaveBalance.getNoOfLeave()-leaveApplication.getNoofday());
                	leaveBalance = leaveBalanceRepository.save(leaveBalance);
                	if(leaveBalance == null){
                		leaveApplication.setStatus(APPLIED);
                		throw new CustomParameterizedException("Error in leave approve","custome.error" );
                	}
                	
                } else{
                	leaveBalance = leaveBalanceRepository.findOneByLeaveTypeAndEmployee(leaveApplication.getLeaveType(),leaveApplication.getEmployee());
					if (leaveApplication.getNoofday() > leaveBalance.getNoOfLeave()) {
						leaveApplication.setStatus(APPLIED);
						throw new CustomParameterizedException(
								"The Person who is requested for this application is not eligible for this leave(he/she has no enough leave balance) ", "custome.error");
					}
					
					 leaveBalance.setNoOfLeave(leaveBalance.getNoOfLeave()-leaveApplication.getNoofday());
					 leaveBalance=leaveBalanceRepository.save(leaveBalance);
		             if(leaveBalance == null){
	                		leaveApplication.setStatus(APPLIED);
	                		throw new CustomParameterizedException("Error in leave approve","custome.error" );
	                	}
                }
               
            }
            leaveApplication.setApprovedBy(getLoggedUser());
            saveLeaveAppHistory(leaveApplication,"");
            
        }
        else if(status.equals("FORWARD") ){
            String flowStatus = leaveApplication.getFlowStatus();
            Employee employee = getLoggedUser();
            String post = employee.getPost().toString();
            switch(post)
            {
                case "SECTIONOFFICER":
                    leaveApplication.setFlowStatus(flowStatus+"->SECTIONOFFICER->ASSISTANTREGISTER");
                    break;
                case "ASSISTANTREGISTER":
                    if(flowStatus.equalsIgnoreCase("New"))
                        leaveApplication.setFlowStatus(flowStatus+"->ASSISTANTREGISTER->DEPUTYREGISTER");
                    else
                        leaveApplication.setFlowStatus(flowStatus+"->DEPUTYREGISTER");
                    break;
                case "DEPUTYREGISTER":
                    if(flowStatus.equalsIgnoreCase("New"))
                        leaveApplication.setFlowStatus(flowStatus+"->DEPUTYREGISTER->REGISTRAR");
                    else
                        leaveApplication.setFlowStatus(flowStatus+"->REGISTRAR");
                    break;
                case "HOD":
                    leaveApplication.setFlowStatus(flowStatus+"->HOD->REGISTRAR");
                    break;
                case "REGISTRAR":
                    if(flowStatus.equalsIgnoreCase("New"))
                        leaveApplication.setFlowStatus(flowStatus+"->REGISTRAR->VICECHANCELLOR");
                    else
                        leaveApplication.setFlowStatus(flowStatus+"->VICECHANCELLOR");
                    break;
                case "VICECHANCELLOR":
                    if(flowStatus.equalsIgnoreCase("New"))
                        leaveApplication.setFlowStatus(flowStatus+"->VICECHANCELLOR->CHANCELLOR");
                    else
                        leaveApplication.setFlowStatus(flowStatus+"->CHANCELLOR");
                    break;
                default : log.info("something wrong....");
            }
            String[] flow= leaveApplication.getFlowStatus().split("->");
            saveLeaveAppHistory(leaveApplication,flow[flow.length-1]);
            leaveApplication.setStatus(APPLIED);
        }
        LeaveApplication result = leaveApplicationRepository.save(leaveApplication);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, leaveApplication.getId().toString()))
            .body(result);
    }

    /**
     * GET  /leave-applications : get all the leaveApplications.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of leaveApplications in body
     */
    @GetMapping("/leave-applications")
    @Timed
    public List<LeaveApplication> getAllLeaveApplications(@RequestParam String status) {
        log.info("REST request to get all LeaveApplications: {}", "all LeaveApplications");
        List<LeaveApplication> list = new ArrayList<>();
        String user= SecurityUtils.getCurrentUserLogin().get();
        System.out.println("\n\n####User: "+user);
        if(status.equalsIgnoreCase("all")) {
            list=leaveApplicationRepository.findAll();// all for admin
        }
        else 
        {
            Employee employee = getLoggedUser();
            String post = employee.getPost().toString();
            log.info(post , "{} Login");
            if(post.equalsIgnoreCase("FACULTY") || post.equalsIgnoreCase("UDC") || post.equalsIgnoreCase("LDC"))
            {
                if(status.equals(APPLIED))
                    list = leaveApplicationRepository.findAllByEmployee(employee);
            }
            else{
                switch (post)
                {   
                    case "CHANCELLOR":
                       list=getAllLeaveApplicationsByCHANCELLOR(status,employee);
                        break;
                    case "VICECHANCELLOR":
                        list=getAllLeaveApplicationsByVICECHANCELLOR(status,employee);
                        break;
                    case "REGISTRAR":
                    list=getAllLeaveApplicationsByREGISTRAR(status,employee);
                        break;
                    case "HOD":
                        list=getAllLeaveApplicationsByHOD(status,employee);
                        break;
                    case "DEPUTYREGISTER":
                       list=getAllLeaveApplicationsByDEPUTYREGISTER(status,employee);
                        break;
                    case "ASSISTANTREGISTER":
                        list=getAllLeaveApplicationsByASSISTANTREGISTER(status,employee);
                        break;
                    case "SECTIONOFFICER":
                      list=getAllLeaveApplicationsBySECTIONOFFICER(status,employee);
                        break;
                    default: 
                            log.info("can't not find valid employee");
                }
            }
        }
        return  list;
    }
    public List<LeaveApplication> getAllLeaveApplicationsBySECTIONOFFICER(String status,Employee employee) {
        List<LeaveApplication> list = new ArrayList<>();
        if(status.equalsIgnoreCase(APPLIED)){
            // your leave
            list=leaveApplicationRepository.findAllByEmployee(employee);
        }
        else if(status.equalsIgnoreCase(APPROVED)){
            // approved or rejected leave
            List<String> statusList=new ArrayList<>();
            statusList.add(APPROVED);
            statusList.add(REJECTED);
            list=leaveApplicationRepository.findAllByApprovedByAndStatusIn(employee, statusList);
        }
        else if(status.equalsIgnoreCase("Forward")){
            String flowStatus = "SECTIONOFFICER->ASSISTANTREGISTER";
            list = leaveApplicationRepository.findAllByFlowStatusLike(flowStatus);
        }
        else if(status.equalsIgnoreCase("PENDDING")){
            Department department = employee.getDepartment();
            List<Post> postList= Arrays.asList(Post.LDC,Post.UDC);
            List<Employee> empList = employeeRepository.findAllByPostInAndDepartment(postList,department);
            list = leaveApplicationRepository.findAllByEmployeeInAndFlowStatusAndStatus(empList,"New",APPLIED);
        }
        return list;

    }

    public List<LeaveApplication> getAllLeaveApplicationsByASSISTANTREGISTER(String status,Employee employee) {
        List<LeaveApplication> list = new ArrayList<>();
       
        if(status.equalsIgnoreCase(APPLIED)){
            // your leave
            list=leaveApplicationRepository.findAllByEmployee(employee);
        }
        else if(status.equalsIgnoreCase(APPROVED)){
            // approved or rejected leave
            List<String> statusList=new ArrayList<>();
            statusList.add(APPROVED);
            statusList.add(REJECTED);
            list=leaveApplicationRepository.findAllByApprovedByAndStatusIn(employee, statusList);
        }
        else if(status.equalsIgnoreCase("Forward")){
            
            String flowStatus = "ASSISTANTREGISTER->DEPUTYREGISTER";
            list = leaveApplicationRepository.findAllByFlowStatusLike(flowStatus);
        }
        else if(status.equalsIgnoreCase("PENDDING")){
            Department department = employee.getDepartment();
            List<Post> postList= Arrays.asList(Post.SECTIONOFFICER);
            List<Employee> empList = employeeRepository.findAllByPostInAndDepartment(postList,department);
            list = leaveApplicationRepository.findAllByEmployeeInAndFlowStatusAndStatus(empList,"New",APPLIED);
            
            postList =Arrays.asList(Post.LDC,Post.UDC);
            List<String> flowStatusList=Arrays.asList("NEW->SECTIONOFFICER->ASSISTANTREGISTER");
            empList = employeeRepository.findAllByPostInAndDepartment(postList,department);
            list.addAll(leaveApplicationRepository.findAllByEmployeeInAndFlowStatusInAndStatus(empList,flowStatusList,APPLIED));
        }
        return list;

    }
    public List<LeaveApplication> getAllLeaveApplicationsByDEPUTYREGISTER(String status,Employee employee) {
        List<LeaveApplication> list = new ArrayList<>();
        
        if(status.equalsIgnoreCase(APPLIED)){
            // your leave
            list=leaveApplicationRepository.findAllByEmployee(employee);
        }
        else if(status.equalsIgnoreCase(APPROVED)){
            // approved or rejected leave
            List<String> statusList=new ArrayList<>();
            statusList.add(APPROVED);
            statusList.add(REJECTED);
            list=leaveApplicationRepository.findAllByApprovedByAndStatusIn(employee, statusList);
        }
        else if(status.equalsIgnoreCase("Forward")){
            String flowStatus = "DEPUTYREGISTER->REGISTRAR";
            list = leaveApplicationRepository.findAllByFlowStatusLike(flowStatus);
        }
        else if(status.equalsIgnoreCase("PENDDING")){
            Department department = employee.getDepartment();
            List<Post> postList= Arrays.asList(Post.ASSISTANTREGISTER);
            List<Employee> empList = employeeRepository.findAllByPostInAndDepartment(postList,department);
            list = leaveApplicationRepository.findAllByEmployeeInAndFlowStatusAndStatus(empList,"New",APPLIED);
            postList =Arrays.asList(Post.LDC,Post.UDC,Post.SECTIONOFFICER);
            List<String> flowStatusList=Arrays.asList("NEW->SECTIONOFFICER->ASSISTANTREGISTER->DEPUTYREGISTER","NEW->ASSISTANTREGISTER->DEPUTYREGISTER");
            empList = employeeRepository.findAllByPostInAndDepartment(postList,department);
            list.addAll(leaveApplicationRepository.findAllByEmployeeInAndFlowStatusInAndStatus(empList,flowStatusList,APPLIED));
        }
        return list;

    }
    public List<LeaveApplication> getAllLeaveApplicationsByCHANCELLOR(String status,Employee employee) {
        
        List<LeaveApplication> list = new ArrayList<>();
        if(status.equalsIgnoreCase(APPROVED)){
            // approved or rejected leave
            List<String> statusList=new ArrayList<>();
            statusList.add(APPROVED);
            statusList.add(REJECTED);
            list=leaveApplicationRepository.findAllByApprovedByAndStatusIn(employee, statusList);
        }
        else if(status.equalsIgnoreCase("PENDDING")){
            List<Post> postList= Arrays.asList(Post.VICECHANCELLOR);
            List<Employee> empList = employeeRepository.findAllByPostIn(postList);
            list = leaveApplicationRepository.findAllByEmployeeInAndFlowStatusAndStatus(empList,"New",APPLIED);

            postList =Arrays.asList(Post.VICECHANCELLOR,Post.CHANCELLOR);
             List<String> flowStatusList=Arrays.asList("NEW->HOD->REGISTRAR->VICECHANCELLOR->CHANCELLOR",
            "NEW->SECTIONOFFICER->ASSISTANTREGISTER->DEPUTYREGISTER->REGISTRAR->VICECHANCELLOR->CHANCELLOR",
            "NEW->ASSISTANTREGISTER->DEPUTYREGISTER->REGISTRAR->VICECHANCELLOR->CHANCELLOR",
            "NEW->DEPUTYREGISTER->REGISTRAR->VICECHANCELLOR->CHANCELLOR",
            "NEW->REGISTRAR->VICECHANCELLOR->CHANCELLOR",
            "NEW->VICECHANCELLOR->CHANCELLOR");
            empList = employeeRepository.findAllByPostNotIn(postList);
            list.addAll(leaveApplicationRepository.findAllByEmployeeInAndFlowStatusInAndStatus(empList,flowStatusList,APPLIED));
        }
        return list;

    }   
    public List<LeaveApplication> getAllLeaveApplicationsByVICECHANCELLOR(String status,Employee employee) {
        List<LeaveApplication> list = new ArrayList<>();
        if(status.equalsIgnoreCase(APPLIED)){
            // your leave
            list=leaveApplicationRepository.findAllByEmployee(employee);
        }
        else if(status.equalsIgnoreCase(APPROVED)){
            // approved or rejected leave
            List<String> statusList=new ArrayList<>();
            statusList.add(APPROVED);
            statusList.add(REJECTED);
            list=leaveApplicationRepository.findAllByApprovedByAndStatusIn(employee, statusList);
        }
        else if(status.equalsIgnoreCase("Forward")){
            list = leaveApplicationRepository.findAllByFlowStatusLike("VICECHANCELLOR->CHANCELLOR");
        }
        else if(status.equalsIgnoreCase("PENDDING")){
            List<Post> postList= Arrays.asList(Post.REGISTRAR);
            List<Employee> empList = employeeRepository.findAllByPostIn(postList);
            list = leaveApplicationRepository.findAllByEmployeeInAndFlowStatusAndStatus(empList,"New",APPLIED);

            postList =Arrays.asList(Post.VICECHANCELLOR,Post.CHANCELLOR);
             List<String> flowStatusList=Arrays.asList("NEW->HOD->REGISTRAR->VICECHANCELLOR",
            "NEW->SECTIONOFFICER->ASSISTANTREGISTER->DEPUTYREGISTER->REGISTRAR->VICECHANCELLOR",
            "NEW->ASSISTANTREGISTER->DEPUTYREGISTER->REGISTRAR->VICECHANCELLOR",
            "NEW->DEPUTYREGISTER->REGISTRAR->VICECHANCELLOR",
            "NEW->REGISTRAR->VICECHANCELLOR");
            empList = employeeRepository.findAllByPostNotIn(postList);
            list.addAll(leaveApplicationRepository.findAllByEmployeeInAndFlowStatusInAndStatus(empList,flowStatusList,APPLIED));
        }
        return list;

    }
    public List<LeaveApplication> getAllLeaveApplicationsByREGISTRAR(String status,Employee employee) {
        List<LeaveApplication> list = new ArrayList<>();
        if(status.equalsIgnoreCase(APPLIED)){
            // your leave
            list=leaveApplicationRepository.findAllByEmployee(employee);
        }
        else if(status.equalsIgnoreCase(APPROVED)){
            // approved or rejected leave
            List<String> statusList=new ArrayList<>();
            statusList.add(APPROVED);
            statusList.add(REJECTED);
            list=leaveApplicationRepository.findAllByApprovedByAndStatusIn(employee, statusList);
        }
        else if(status.equalsIgnoreCase("Forward")){
            String flowStatus = "REGISTRAR->VICECHANCELLOR";
            list = leaveApplicationRepository.findAllByFlowStatusLike(flowStatus);
        }
        else if(status.equalsIgnoreCase("PENDDING")){
            List<Post> postList= Arrays.asList(Post.DEPUTYREGISTER,Post.HOD);
            List<Employee> empList = employeeRepository.findAllByPostIn(postList);
            list = leaveApplicationRepository.findAllByEmployeeInAndFlowStatusAndStatus(empList,"New",APPLIED);

            postList =Arrays.asList(Post.REGISTRAR,Post.VICECHANCELLOR,Post.CHANCELLOR);
            List<String>  flowStatusList=Arrays.asList("NEW->HOD->REGISTRAR",
            "NEW->SECTIONOFFICER->ASSISTANTREGISTER->DEPUTYREGISTER->REGISTRAR",
            "NEW->ASSISTANTREGISTER->DEPUTYREGISTER->REGISTRAR",
            "NEW->DEPUTYREGISTER->REGISTRAR");
            empList = employeeRepository.findAllByPostNotIn(postList);
            list.addAll(leaveApplicationRepository.findAllByEmployeeInAndFlowStatusInAndStatus(empList,flowStatusList,APPLIED));
        }
        return list;

    }
    public List<LeaveApplication> getAllLeaveApplicationsByHOD(String status,Employee employee) {
        List<LeaveApplication> list = new ArrayList<>();
        
        if(status.equalsIgnoreCase(APPLIED)){
            // your leave
            list=leaveApplicationRepository.findAllByEmployee(employee);
        }
        else if(status.equalsIgnoreCase(APPROVED)){
            List<String> statusList=new ArrayList<>();
            statusList.add(APPROVED);
            statusList.add(REJECTED);
            list=leaveApplicationRepository.findAllByApprovedByAndStatusIn(employee, statusList);
        }
        else if(status.equalsIgnoreCase("Forward")){
            list = leaveApplicationRepository.findAllByFlowStatusLike("NEW->HOD");
        }
        else if(status.equalsIgnoreCase("PENDDING")){
            Department department = employee.getDepartment();
            List<Post> postList= Arrays.asList(Post.FACULTY);
            List<Employee> empList = employeeRepository.findAllByPostInAndDepartment(postList,department);
            list = leaveApplicationRepository.findAllByEmployeeInAndFlowStatusAndStatus(empList,"New",APPLIED);
        }
        return list;

    }

    /**
     * GET  /leave-applications/:id : get the "id" leaveApplication.
     *
     * @param id the id of the leaveApplication to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the leaveApplication, or with status 404 (Not Found)
     */
    @GetMapping("/leave-applications/{id}")
    @Timed
    public ResponseEntity<LeaveApplication> getLeaveApplication(@PathVariable Long id) {
        log.debug("REST request to get LeaveApplication : {}", id);
        LeaveApplication leaveApplication = leaveApplicationRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(leaveApplication));
    }

    /**
     * DELETE  /leave-applications/:id : delete the "id" leaveApplication.
     *
     * @param id the id of the leaveApplication to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/leave-applications/{id}")
    @Timed
    public ResponseEntity<Void> deleteLeaveApplication(@PathVariable Long id) {
        log.debug("REST request to delete LeaveApplication : {}", id);
        leaveApplicationRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
