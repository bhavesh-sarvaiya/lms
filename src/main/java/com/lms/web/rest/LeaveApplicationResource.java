package com.lms.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.lms.domain.Employee;
import com.lms.domain.LeaveApplication;
import com.lms.domain.LeaveApplicationHistory;
import com.lms.domain.LeaveBalance;
import com.lms.domain.LeaveRule;
import com.lms.domain.LeaveRuleAndMaxMinLeave;
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
import com.lms.repository.UserRepository;
import com.lms.security.SecurityUtils;
import com.lms.web.rest.errors.BadRequestAlertException;
import com.lms.web.rest.util.HeaderUtil;

import io.github.jhipster.web.util.ResponseUtil;

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
    private final LeaveRuleAndNoOfDayRepository leaveRuleAndNoOfDayRepository;
    private final LeaveRuleAndValidationTypeRepository leaveRuleAndValidationTypeRepository;
    private final UserRepository userRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;

    public LeaveApplicationResource(LeaveApplicationRepository leaveApplicationRepository,EmployeeRepository employeeRepository,LeaveBalanceRepository leaveBalanceRepository, UserRepository userRepository,LeaveApplicationHistoryRepository leaveApplicationHistoryRepository,LeaveRuleRepository leaveRuleRepository,LeaveRuleAndMaxMinLeaveRepository leaveRuleAndMaxMinLeaveRepository,LeaveRuleAndNoOfDayRepository leaveRuleAndNoOfDayRepository,LeaveRuleAndValidationTypeRepository leaveRuleAndValidationTypeRepository) {
        this.leaveApplicationRepository = leaveApplicationRepository;
        this.employeeRepository=employeeRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.userRepository = userRepository;
        this.leaveApplicationHistoryRepository = leaveApplicationHistoryRepository;
        this.leaveRuleAndMaxMinLeaveRepository = leaveRuleAndMaxMinLeaveRepository;
        this.leaveRuleAndNoOfDayRepository = leaveRuleAndNoOfDayRepository;
        this.leaveRuleAndValidationTypeRepository = leaveRuleAndValidationTypeRepository;
        this.leaveRuleRepository = leaveRuleRepository;
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
        if (leaveApplication.getId() != null) {
            throw new BadRequestAlertException("A new leaveApplication cannot already have an ID", ENTITY_NAME, "idexists");
        }
       Employee employee = getLoggedUser();
        Double intervalDays = leaveApplication.getNoofday();
        if(intervalDays < 1 )
        {
            throw new BadRequestAlertException("Please Input valid date", ENTITY_NAME, "invalid.date");
        }
       leaveApplication.setEmployee(employee);
        Double leave = leaveBalanceRepository.findOneByEmployeeAndLeaveType(leaveApplication.getEmployee(),leaveApplication.getLeaveType());
        if(leave == null)
        {
           throw new BadRequestAlertException("You have not been assigned this type of leave, \nPlease Contact to Authority", ENTITY_NAME, "leaveNotAssign");
        }
        

        List<LeaveApplication> leaveApplicationList = leaveApplicationRepository.findAllByEmployeeAndLeaveTypeAndStatus(leaveApplication.getEmployee(), leaveApplication.getLeaveType(), APPLIED);
       
        if(!leaveApplicationList.isEmpty())
        {
        	Double totalAppliedLeave = 0.0;
        	for (LeaveApplication l : leaveApplicationList)
        		totalAppliedLeave += l.getNoofday();
        	
            if((totalAppliedLeave + leaveApplication.getNoofday()) > leave) {
            	throw new BadRequestAlertException("You are not eligible for this type of leave \n Because you have only and you are requested more than that ", ENTITY_NAME, "notEligible");
            }
        	
        }
        if(leaveApplication.getNoofday() > leave){
           throw new BadRequestAlertException("You are not eligible for this type of leave \n Because you have only "+leave+ " and you are requested more than that ", ENTITY_NAME, "notEligible");
        }
       
        LeaveRule leaveRule = leaveRuleRepository.findOneByLeave(leaveApplication.getLeaveType());
        //check gender
        String gender = leaveRule.getLeaveFor().name();
        if(!gender.equalsIgnoreCase("BOTH"))
        {
         if(!employee.getGender().toString().equalsIgnoreCase(gender)){
            throw new BadRequestAlertException("This leave only for "+gender, ENTITY_NAME, "invalid.gender");
         }
        }

        List<LeaveRuleAndMaxMinLeave> leaveRuleAndMaxMinLeaves= leaveRuleAndMaxMinLeaveRepository.findAllByLeaveRule(leaveRule);

        if(leaveRuleAndMaxMinLeaves.size() > 1){
            if(!employee.isTeachingstaff() && employee.isGranted()){
                Double maxDay = leaveRuleAndMaxMinLeaveRepository.findMaxLeaveLimitByLeaveRuleAndEmployeeType(leaveRule, EmpType2.MANAGEMENT);
                Double minDay = leaveRuleAndMaxMinLeaveRepository.findMinLeaveLimitByLeaveRuleAndEmployeeType(leaveRule, EmpType2.EDUCATIONAL);
                if(intervalDays > maxDay) {
                    throw new BadRequestAlertException("You reached max leave limit", ENTITY_NAME, "maxLeaveLimit");
                }
                else if(intervalDays < minDay) {
                    throw new BadRequestAlertException("You can't take leave below some limit", ENTITY_NAME, "minLeaveLimit");
                }

            }
            else {
                if(intervalDays > leaveRuleAndMaxMinLeaves.get(0).getMaxLeaveLimit()) {
                    throw new BadRequestAlertException("You reached max leave limit", ENTITY_NAME, "maxLeaveLimit");
                }
                else if(intervalDays < leaveRuleAndMaxMinLeaves.get(0).getMinLeaveLimit()) {
                    throw new BadRequestAlertException("You can't take leave below some limit", ENTITY_NAME, "minLeaveLimit");
                }
            }
            
        }
       
        leaveApplication.setStatus(APPLIED);
        leaveApplication.setFlowStatus("NEW");
        LeaveApplication result = leaveApplicationRepository.save(leaveApplication);
        
        saveLeaveAppHistory(result,"");
        return ResponseEntity.created(new URI("/api/leave-applications/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
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
        String status=leaveApplication.getStatus();
        if(status.equals(APPROVED) || status.equals(REJECTED))
        {
            if(leaveApplication.getStatus().equalsIgnoreCase(APPROVED))
            {
                LeaveBalance leaveBalance = leaveBalanceRepository.findOneByLeaveTypeAndEmployee(leaveApplication.getLeaveType(),leaveApplication.getEmployee());
                if(leaveApplication.getNoofday() > leaveBalance.getNoOfLeave() )
                {
                    leaveApplication.setStatus(APPLIED);
                    throw new BadRequestAlertException("The Person who is requested for this application is not eligible for this leave(he/she has no enough leave balance) ", ENTITY_NAME, "notEligibleWhenApprove");
                }
                leaveBalance.setNoOfLeave(leaveBalance.getNoOfLeave()-leaveApplication.getNoofday());
                leaveBalanceRepository.save(leaveBalance);
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
                List<String> flowStatusList = new ArrayList<>();
                List<Employee> empList;
                List<Post> postList=new ArrayList<>();
                postList.add(employee.getPost());
                String flowStatus="";
                switch (post)
                {   
                    case "CHANCELLOR":
                        postList.add(Post.VICECHANCELLOR);
                        flowStatusList.add("NEW->HOD->REGISTRAR->VICECHANCELLOR->CHANCELLOR");
                        flowStatusList.add("NEW->SECTIONOFFICER->ASSISTANTREGISTER->DEPUTYREGISTER->REGISTRAR->VICECHANCELLOR->CHANCELLOR");
                        empList = employeeRepository.findAllByPostIn(postList);
                        break;
                    case "VICECHANCELLOR":
                        postList.add(Post.REGISTRAR);
                        flowStatusList.add("NEW->HOD->REGISTRAR->VICECHANCELLOR");
                        flowStatusList.add("NEW->SECTIONOFFICER->ASSISTANTREGISTER->DEPUTYREGISTER->REGISTRAR->VICECHANCELLOR");
                        flowStatus = "NEW->HOD->REGISTRAR->VICECHANCELLOR->CHANCELLOR";
                        empList = employeeRepository.findAllByPostIn(postList);
                        break;
                    case "REGISTRAR":
                        postList.add(Post.HOD);
                        postList.add(Post.DEPUTYREGISTER);
                        flowStatusList.add("NEW->SECTIONOFFICER->ASSISTANTREGISTER->DEPUTYREGISTER->REGISTRAR");
                        flowStatusList.add("NEW->HOD->REGISTRAR");
                        flowStatus = "NEW->HOD->REGISTRAR->VICECHANCELLOR";
                        empList = employeeRepository.findAllByPostIn(postList);   
                        break;
                    case "HOD":
                        flowStatus = "NEW->HOD";
                        empList = employeeRepository.findAllByDepartment(employee.getDepartment());
                        break;
                    case "DEPUTYREGISTER":
                        flowStatusList.add("NEW->SECTIONOFFICER->ASSISTANTREGISTER->DEPUTYREGISTER");
                        flowStatus = "NEW->SECTIONOFFICER->ASSISTANTREGISTER->DEPUTYREGISTER";
                        postList.add(Post.ASSISTANTREGISTER);
                        empList = employeeRepository.findAllByPostIn(postList);
                        break;
                    case "ASSISTANTREGISTER":
                        flowStatusList.add("NEW->SECTIONOFFICER->ASSISTANTREGISTER");
                        flowStatus = "NEW->SECTIONOFFICER->ASSISTANTREGISTER";
                        postList.add(Post.SECTIONOFFICER);
                        empList = employeeRepository.findAllByPostInAndDepartment(postList,employee.getDepartment());
                        break;
                    case "SECTIONOFFICER":
                        postList.add(Post.LDC);
                        postList.add(Post.UDC);
                        flowStatus = "NEW->SECTIONOFFICER";
                        empList = employeeRepository.findAllByPostInAndDepartment(postList,employee.getDepartment());
                        break;
                    default: 
                            empList = null;
                            log.info("can't not find valid employee");
                }
                List<LeaveApplication> leaveAppList = null;
                if(status.equalsIgnoreCase("Forward"))
                {
                    list = leaveApplicationRepository.findAllByFlowStatusLike(flowStatus);
                }
                else{
                 leaveAppList = leaveApplicationRepository.findAllByEmployeeInAndFlowStatusOrFlowStatusIn(empList,"NEW",flowStatusList);
                
                for(LeaveApplication l : leaveAppList ){
                    if(l!=null)
                    {   
                        if(status.equals("PENDDING") && l.getStatus().equals(APPLIED) && !employee.equals(l.getEmployee()))
                            list.add(l);  
                        else if(status.equals(APPROVED) && (l.getStatus().equals(APPROVED) || l.getStatus().equals(REJECTED)) && l.getApprovedBy().equals(employee))
                            list.add(l);
                        else if(status.equals(APPLIED) && employee.equals(l.getEmployee()))
                            list.add(l);
                    }
                }
            }
            }
        }
        return  list;
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
