package com.lms.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

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

import ch.qos.logback.core.joran.conditional.ElseAction;

import com.codahale.metrics.annotation.Timed;
import com.lms.domain.Employee;
import com.lms.domain.LeaveApplication;
import com.lms.domain.LeaveBalance;
import com.lms.domain.enumeration.Post;
import com.lms.repository.EmployeeRepository;
import com.lms.repository.LeaveApplicationRepository;
import com.lms.repository.LeaveBalanceRepository;
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

    private final LeaveApplicationRepository leaveApplicationRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;

    public LeaveApplicationResource(LeaveApplicationRepository leaveApplicationRepository,EmployeeRepository employeeRepository,LeaveBalanceRepository leaveBalanceRepository, UserRepository userRepository) {
        this.leaveApplicationRepository = leaveApplicationRepository;
        this.employeeRepository=employeeRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.userRepository = userRepository;
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
       
        Long intervalDays = ChronoUnit.DAYS.between(leaveApplication.getFromDate(), leaveApplication.getToDate());
        if(intervalDays < 1 )
        {
            throw new BadRequestAlertException("Please Input valid date", ENTITY_NAME, "invalid.date");
        }
        leaveApplication.setEmployee(getLoggedUser());
        leaveApplication.setNoofday(intervalDays.doubleValue());
        Double leave = leaveBalanceRepository.findOneByEmployeeAndLeaveType(leaveApplication.getEmployee(),leaveApplication.getLeaveType());
      //  LeaveBalance leaveBalance = leaveBalanceRepository.findOneByEmployeeAndLeaveType(leaveApplication.getEmployee(), leaveApplication.getLeaveType());
        if(leave == null)
        {
           throw new BadRequestAlertException("You have not been assigned this type of leave, \nPlease Contact to Authority", ENTITY_NAME, "leaveNotAssign");
       }
        //System.out.println("day: " + leave);
        //System.out.println("employee: "+ leaveApplication.getEmployee());
       // System.out.println("Leave Type: "+ leaveApplication.getLeaveType());
       if(leaveApplication.getNoofday() > leave){
           throw new BadRequestAlertException("You are not eligible for this type of leave \n Because you have only "+leave+ " and you are requested more than that ", ENTITY_NAME, "notEligible");
       }
       
        leaveApplication.setStatus("APPLIED");
        leaveApplication.setFlowStatus("NEW");
        LeaveApplication result = leaveApplicationRepository.save(leaveApplication);
        return ResponseEntity.created(new URI("/api/leave-applications/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
    private Employee getLoggedUser()
    {
        return employeeRepository.findOne(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().get()).get().getId());
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
        if(status.equals("APPROVED") || status.equals("REJECTED"))
        {
            if(leaveApplication.getStatus().equalsIgnoreCase("APPROVED"))
            {
                LeaveBalance leaveBalance = leaveBalanceRepository.findOneByLeaveTypeAndEmployee(leaveApplication.getLeaveType(),leaveApplication.getEmployee());
                if(leaveApplication.getNoofday() > leaveBalance.getNoOfLeave() )
                {
                    leaveApplication.setStatus("APPLIED");
                    throw new BadRequestAlertException("The Person who is requested for this application is not eligible for this leave(he/she has no enough leave balance) ", ENTITY_NAME, "notEligibleWhenApprove");
                }
                leaveBalance.setNoOfLeave(leaveBalance.getNoOfLeave()-leaveApplication.getNoofday());
                leaveBalanceRepository.save(leaveBalance);
            }
            leaveApplication.setApprovedBy(getLoggedUser());
           // System.out.println("balance: "+);
            
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
            }
            leaveApplication.setStatus("APPLIED");
        }
        //leaveApplication.setStatus("APPLIED");
        System.out.println("status: "+leaveApplication.getStatus());
        LeaveApplication result = leaveApplicationRepository.save(leaveApplication);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, leaveApplication.getId().toString()))
            .body(result);
    }

   /*@PutMapping("/leave-applications")
    @Timed
    public ResponseEntity<LeaveApplication> updateLeaveApplicationStatus(@RequestParam String status) throws URISyntaxException {
        log.debug("REST request to update LeaveApplication  Status: {}", status);
        if (leaveApplication.getId() == null) {
            return createLeaveApplication(leaveApplication); 
        }
        LeaveApplication result = leaveApplicationRepository.save(leaveApplication);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, leaveApplication.getId().toString()))
            .body(result);
    }
*/
    /**
     * GET  /leave-applications : get all the leaveApplications.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of leaveApplications in body
     */
    @GetMapping("/leave-applications")
    @Timed
    public List<LeaveApplication> getAllLeaveApplications(@RequestParam String status) {
        log.debug("REST request to get all LeaveApplications");
        List<LeaveApplication> list = new ArrayList<LeaveApplication>();
        //System.out.println(""SecurityUtils.getCurrentUserLogin().get());

        if(status.equalsIgnoreCase("all")) {
            list=leaveApplicationRepository.findAll();// all for admin
        }
        else 
        {
            Employee employee = getLoggedUser();
            String post = employee.getPost().toString();
            log.info(post + " Login");
            System.out.println("status: "+status);
            if(post.equalsIgnoreCase("FACULTY") || post.equalsIgnoreCase("UDC") || post.equalsIgnoreCase("LDC"))
            {
                if(status.equals("APPLIED"))
                    list = leaveApplicationRepository.findAllByEmployee(employee);
            }
            else{
                List<String> flowStatusList = new ArrayList<String>();
                List<Employee> empList;
                List<Post> postList=new ArrayList<Post>();
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
                    System.out.println("Forward status");
                    list = leaveApplicationRepository.findAllByFlowStatusLike(flowStatus);
                }
                else{
                 leaveAppList = leaveApplicationRepository.findAllByEmployeeInAndFlowStatusOrFlowStatusIn(empList,"NEW",flowStatusList);
                
                for(LeaveApplication l : leaveAppList ){
                    System.out.println("\nleave: "+l);
                    if(l!=null)
                    {   
                        if(status.equals("PENDDING") && l.getStatus().equals("APPLIED") && !employee.equals(l.getEmployee()))
                            list.add(l);  
                        else if(status.equals("APPROVED") && (l.getStatus().equals("APPROVED") || l.getStatus().equals("REJECTED")) && l.getApprovedBy().equals(employee))
                            list.add(l);
                        else if(status.equals("APPLIED") && employee.equals(l.getEmployee()))
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
