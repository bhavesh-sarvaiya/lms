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
    private final LeaveBalanceRepository leaveBalanceRepository;

    public LeaveApplicationResource(LeaveApplicationRepository leaveApplicationRepository,EmployeeRepository employeeRepository,LeaveBalanceRepository leaveBalanceRepository) {
        this.leaveApplicationRepository = leaveApplicationRepository;
        this.employeeRepository=employeeRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
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
        LeaveBalance leaveBalance = leaveBalanceRepository.findOneByEmployeeAndLeaveType(leaveApplication.getEmployee(), leaveApplication.getLeaveType());
        if(leaveBalance == null)
        {
            throw new BadRequestAlertException("You have not been assigned this type of leave, \nPlease Contact to Authority", ENTITY_NAME, "leaveNotAssign");
        }
        System.out.println("day: " + leaveBalance.getNoOfLeave());
        System.out.println("employee: "+ leaveApplication.getEmployee());
        System.out.println("Leave Type: "+ leaveApplication.getLeaveType());
        if(leaveApplication.getNoofday() > leaveBalance.getNoOfLeave()){
            throw new BadRequestAlertException("You are not eligible for this type of leave \n Because you have only "+leaveBalance.getNoOfLeave() + " and you are requested more than that ", ENTITY_NAME, "notEligible");
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
        return employeeRepository.findOneByEmpEnrollmentNo(SecurityUtils.getCurrentUserLogin().get());
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
        if(leaveApplication.getStatus().equals("APPROVED") || leaveApplication.getStatus().equals("REJECTED"))
        {
            leaveApplication.setApprovedBy(getLoggedUser());
        }
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
        System.out.println(SecurityUtils.getCurrentUserLogin().get());

        if(status.equalsIgnoreCase("all")) {
            list=leaveApplicationRepository.findAll();
        }else{
        Employee employee = getLoggedUser();
       System.out.println("status: "+status);
            if(employee.getPost().toString() == "HOD")
            {
                //list = leaveApplicationRepository.findAllByALLEmployee(employeeRepository.findAllByDepartment(employee.getDepartment()));
                for (Employee employee2 : employeeRepository.findAllByDepartment(employee.getDepartment())) 
                {
                    for(LeaveApplication l : leaveApplicationRepository.findAllByEmployee(employee2))
                    {
                        if(status.equals("PENDDING") && l.getStatus().equals("APPLIED") && !employee.equals(l.getEmployee()))
                        {
                                list.add(l);
                        } 
                        else if(status.equals("APPROVED") && l.getStatus().equals("APPROVED") && l.getApprovedBy().equals(employee))
                        {
                            list.add(l);
                        }
                        else if(status.equals("APPLIED") && l.getStatus().equals("APPLIED") && employee.equals(l.getEmployee()))
                        {
                            list.add(l);
                        }
                     }	
                }
            }
            else if(employee.getPost().toString().equals("REGISTRAR") || employee.getPost().toString().equals("CHANCELLOR") || employee.getPost().toString().equals("VICECHANCELLOR") || employee.getPost().toString().equals("DEPUTYREGISTER") || employee.getPost().toString().equals("ASSISTANTREGISTER"))
            {
                List<Employee> empList;
                if(employee.getPost().toString().equals("CHANCELLOR"))
                    empList = employeeRepository.findAllByPostOrPost(employee.getPost(),Post.VICECHANCELLOR);
                else if(employee.getPost().toString().equals("VICECHANCELLOR"))
                    empList = employeeRepository.findAllByPostOrPost(employee.getPost(),Post.REGISTRAR);
                else if(employee.getPost().toString().equals("REGISTRAR"))
                    empList = employeeRepository.findAllByPostOrPostOrPost(employee.getPost(),Post.HOD,Post.DEPUTYREGISTER);
                else if(employee.getPost().toString().equals("DEPUTYREGISTER"))
                    empList = employeeRepository.findAllByPostOrPost(employee.getPost(),Post.ASSISTANTREGISTER);
                else if(employee.getPost().toString().equals("ASSISTANTREGISTER"))
                    empList = employeeRepository.findAllByPostOrPost(employee.getPost(),Post.SECTIONOFFICER);
                else
                    empList = employeeRepository.findAllByPostOrPostOrPost(employee.getPost(),Post.LDC,Post.UDC);
              
                 for (Employee employee2 : empList) 
                {
                    for(LeaveApplication l : leaveApplicationRepository.findAllByEmployee(employee2))
                    if(l!=null)
                    {
                        if(status.equals("PENDDING") && l.getStatus().equals("APPLIED") && !employee.equals(l.getEmployee()))
                                list.add(l);
                        else if(status.equals("APPROVED") && l.getStatus().equals("APPROVED") && l.getApprovedBy().equals(employee))
                            list.add(l);
                        else if(status.equals("APPLIED") && l.getStatus().equals("APPLIED") && employee.equals(l.getEmployee()))
                            list.add(l);
                    }
                }
                //System.err.println("post "+Post.HOD);
            }
            else if(employee.getPost().toString().equals("FACULTY") || employee.getPost().toString().equals("UDC") || employee.getPost().toString().equals("LDP"))
            {
                if(status.equals("APPLIED"))
                    list = leaveApplicationRepository.findAllByEmployee(employee);
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
