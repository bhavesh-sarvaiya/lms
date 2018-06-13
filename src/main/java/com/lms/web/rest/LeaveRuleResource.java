package com.lms.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.lms.domain.LeaveRule;
import com.lms.domain.LeaveRuleAndMaxMinLeave;
import com.lms.domain.LeaveRuleAndNoOfDay;
import com.lms.domain.LeaveRuleAndValidationType;
import com.lms.domain.LeaveType;
import com.lms.domain.RequestWrapperLeaveRule;
import com.lms.repository.LeaveRuleAndMaxMinLeaveRepository;
import com.lms.repository.LeaveRuleAndNoOfDayRepository;
import com.lms.repository.LeaveRuleAndValidationTypeRepository;
import com.lms.repository.LeaveRuleRepository;
import com.lms.repository.LeaveTypeRepository;
import com.lms.web.rest.errors.BadRequestAlertException;
import com.lms.web.rest.errors.CustomParameterizedException;
import com.lms.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * REST controller for managing LeaveRule.
 */
@RestController
@RequestMapping("/api")
public class LeaveRuleResource {

    private final Logger log = LoggerFactory.getLogger(LeaveRuleResource.class);

    private static final String ENTITY_NAME = "leaveRule";

    private final LeaveRuleRepository leaveRuleRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveRuleAndMaxMinLeaveRepository leaveRuleAndMaxMinLeaveRepository;
    private final LeaveRuleAndNoOfDayRepository leaveRuleAndNoOfDayRepository;
    private final LeaveRuleAndValidationTypeRepository leaveRuleAndValidationTypeRepository;

    public LeaveRuleResource(LeaveRuleRepository leaveRuleRepository,LeaveRuleAndMaxMinLeaveRepository leaveRuleAndMaxMinLeaveResource,LeaveRuleAndNoOfDayRepository leaveRuleAndNoOfDayResource,LeaveRuleAndValidationTypeRepository leaveRuleAndValidationTypeResource, LeaveTypeRepository leaveTypeRepository) {
        this.leaveRuleRepository = leaveRuleRepository;
        this.leaveRuleAndMaxMinLeaveRepository = leaveRuleAndMaxMinLeaveResource;
        this.leaveRuleAndNoOfDayRepository = leaveRuleAndNoOfDayResource;
        this.leaveRuleAndValidationTypeRepository = leaveRuleAndValidationTypeResource;
        this.leaveTypeRepository = leaveTypeRepository;
    }

    /**
     * POST  /leave-rules : Create a new leaveRule.
     *
     * @param leaveRule the leaveRule to create
     * @return the ResponseEntity with status 201 (Created) and with body the new leaveRule, or with status 400 (Bad Request) if the leaveRule has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/leave-rules")
    @Timed
    public ResponseEntity<LeaveRule> createLeaveRule(@RequestBody RequestWrapperLeaveRule requestWrapperLeaveRule) throws URISyntaxException {
        LeaveRule leaveRule = requestWrapperLeaveRule.getLeaveRule();
        LeaveRuleAndNoOfDay leaveRuleAndNoOfDay[]=requestWrapperLeaveRule.getLeaveRuleAndNoOfDay();
        LeaveRuleAndMaxMinLeave leaveRuleAndMaxMinLeave[]=requestWrapperLeaveRule.getLeaveRuleAndMaxMinLeave();
        LeaveRuleAndValidationType leaveRuleAndValidationType[]=requestWrapperLeaveRule.getLeaveRuleAndValidationType();
        
        log.debug("REST request to save LeaveRule : {}", leaveRule); 
        if (leaveRule.getId() != null) {
            throw new BadRequestAlertException("A new leaveRule cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LeaveRule l = leaveRuleRepository.findOneByLeave(leaveRule.getLeave());
        if(l != null){
            throw new CustomParameterizedException("This leave type already have leave rule\nSo please select other leave type", "custom.error");
        }

        checkValidation(leaveRule,leaveRuleAndNoOfDay,leaveRuleAndMaxMinLeave, leaveRuleAndValidationType);
        LeaveRule result = leaveRuleRepository.save(leaveRule);
        if(result != null){
            for (int i = 0; i < leaveRuleAndNoOfDay.length;i++) {
            	leaveRuleAndNoOfDay[i].setLeaveRule(leaveRule);
                leaveRuleAndNoOfDayRepository.save(leaveRuleAndNoOfDay[i]);     
            }

            for (int i = 0; i < leaveRuleAndMaxMinLeave.length;i++) {
                leaveRuleAndMaxMinLeave[i].setLeaveRule(leaveRule);
                leaveRuleAndMaxMinLeaveRepository.save(leaveRuleAndMaxMinLeave[i]);     
            }

            for (int i = 0; i < leaveRuleAndValidationType.length;i++) {
                leaveRuleAndValidationType[i].setLeaveRule(leaveRule);
                leaveRuleAndValidationTypeRepository.save(leaveRuleAndValidationType[i]);     
            }
        }
        return ResponseEntity.created(new URI("/api/leave-rules/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getLeave().getCode()))
            .body(result);
    }

    /**
     * PUT  /leave-rules : Updates an existing leaveRule.
     *
     * @param leaveRule the leaveRule to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated leaveRule,
     * or with status 400 (Bad Request) if the leaveRule is not valid,
     * or with status 500 (Internal Server Error) if the leaveRule couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/leave-rules")
    @Timed
    public ResponseEntity<LeaveRule> updateLeaveRule(@RequestBody RequestWrapperLeaveRule requestWrapperLeaveRule) throws URISyntaxException {
    	 LeaveRule leaveRule = requestWrapperLeaveRule.getLeaveRule();
         LeaveRuleAndNoOfDay leaveRuleAndNoOfDay[]=requestWrapperLeaveRule.getLeaveRuleAndNoOfDay();
         LeaveRuleAndMaxMinLeave leaveRuleAndMaxMinLeave[]=requestWrapperLeaveRule.getLeaveRuleAndMaxMinLeave();
         LeaveRuleAndValidationType leaveRuleAndValidationType[]=requestWrapperLeaveRule.getLeaveRuleAndValidationType();
         
    	log.debug("REST request to update LeaveRule : {}", leaveRule);
        if (leaveRule.getId() == null) {
            return createLeaveRule(requestWrapperLeaveRule);
        }
        checkValidation(leaveRule,leaveRuleAndNoOfDay,leaveRuleAndMaxMinLeave, leaveRuleAndValidationType);
        LeaveRule result = leaveRuleRepository.save(leaveRule);
        for (int i = 0; i < leaveRuleAndNoOfDay.length;i++) {
        	leaveRuleAndNoOfDay[i].setLeaveRule(leaveRule);
            leaveRuleAndNoOfDayRepository.save(leaveRuleAndNoOfDay[i]);     
        }

        for (int i = 0; i < leaveRuleAndMaxMinLeave.length;i++) {
        	leaveRuleAndMaxMinLeave[i].setLeaveRule(leaveRule);
            leaveRuleAndMaxMinLeaveRepository.save(leaveRuleAndMaxMinLeave[i]);     
        }

        for (int i = 0; i < leaveRuleAndValidationType.length;i++) {
        	leaveRuleAndValidationType[i].setLeaveRule(leaveRule);
            leaveRuleAndValidationTypeRepository.save(leaveRuleAndValidationType[i]);     
        }

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, leaveRule.getLeave().getCode()))
            .body(result);
    }

    public void checkValidation(LeaveRule leaveRule, LeaveRuleAndNoOfDay[] leaveRuleAndNoOfDay, LeaveRuleAndMaxMinLeave leaveRuleAndMaxMinLeave[],  LeaveRuleAndValidationType leaveRuleAndValidationType[]){
        if(leaveRule.getLeave() == null){
            throw new CustomParameterizedException("Please select leave type", "custom.error");
        }
        if(leaveRule.getLeaveFor() == null){
            throw new CustomParameterizedException("Please select leave for", "custom.error");
        }
        if(leaveRule.getAllocationTimePeriod() == null){
            throw new CustomParameterizedException("Please select allocation time period", "custom.error");
        }
        LeaveType leaveType = leaveRule.getLeave();
        Set<LeaveType> s= leaveRule.getLeaveTypes();

        for (LeaveType t : s) {
            if(t.getCode().equals(leaveType.getCode())) {
                throw new CustomParameterizedException("Leave type and join leave should be different","custom.error");
            }
        }
        if(leaveRule.isCommulative()){
            if(leaveRule.getCommulativeLimit() == null)
                throw new CustomParameterizedException("Please enter commulative leave", "custom.error");
            if(leaveRule.getCommulativeLimit() < 1)
             throw new CustomParameterizedException("Commulative leave shlould be greater than 0", "custom.error");
        }
        if(leaveRuleAndNoOfDay.length == 2){
            if(leaveRuleAndNoOfDay[0].getNoOfDay() == null){
                throw new CustomParameterizedException("Please Enter allocation day for vacationar","custom.error");
            }
            if(leaveRuleAndNoOfDay[1].getNoOfDay() == null){
                throw new CustomParameterizedException("Please Enter allocation day for non-vacationar","custom.error");
            }

            if(leaveRuleAndNoOfDay[0].getNoOfDay() < 1){
                throw new CustomParameterizedException("Allocation day shlould be greater than 0 for vacationar","custom.error");
            }

            if(leaveRuleAndNoOfDay[1].getNoOfDay() < 1){
                throw new CustomParameterizedException("Please Enter valid allocation day for non-vacationar","custom.error");
            }

            if(leaveRuleAndNoOfDay[0].getNoOfDay().toString().matches("^\\d+$")){
                throw new CustomParameterizedException("Please Enter valid allocation day for vacationar", "custom.error");
            }

            if(leaveRuleAndNoOfDay[1].getNoOfDay().toString().matches("^\\d+$")){
                throw new CustomParameterizedException("Please Enter valid allocation day for non-vacationar", "custom.error");
            }
        }
        else if(leaveRuleAndNoOfDay.length == 1){
            if(leaveRuleAndNoOfDay[0].getEmployeeType() == null){
                throw new CustomParameterizedException("Please select employee type for allocation day","custom.error");
            }
            if(leaveRuleAndNoOfDay[0].getNoOfDay() == null){
                throw new CustomParameterizedException("Please Enter allocation day","custom.error");
            }
            if(leaveRuleAndNoOfDay[0].getNoOfDay() < 1){
                throw new CustomParameterizedException("Allocation day shlould be greater than 0","custom.error");
            }
            if(leaveRuleAndNoOfDay[0].getNoOfDay().toString().matches("^\\d+$")){
                throw new CustomParameterizedException("Please Enter valid allocation day", "custom.error");
            }
        } else{
                throw new CustomParameterizedException("Something went wrong in allocation day", "custom.error");
        }

        if(leaveRuleAndMaxMinLeave.length == 2){
            if(leaveRuleAndMaxMinLeave[0].getMaxLeaveLimit() == null){
                throw new CustomParameterizedException("Please Enter max leave limit for management","custom.error");
            }
            if(leaveRuleAndMaxMinLeave[0].getMinLeaveLimit() == null){
                throw new CustomParameterizedException("Please Enter min leave limit for management","custom.error");
            }

            if(leaveRuleAndMaxMinLeave[0].getMinLeaveLimit() < 1){
                throw new CustomParameterizedException("Minimum leave limit should be more than 0 for management","custom.error");
            }

            if(leaveRuleAndMaxMinLeave[0].getMinLeaveLimit() >= leaveRuleAndMaxMinLeave[0].getMaxLeaveLimit()){
                throw new CustomParameterizedException("Maximum leave limit should be more than Minimum leave limit for management","custom.error");
            }

            if(leaveRuleAndMaxMinLeave[1].getMaxLeaveLimit() == null){
                throw new CustomParameterizedException("Please Enter max leave limit for educational","custom.error");
            }
            if(leaveRuleAndMaxMinLeave[1].getMinLeaveLimit() == null){
                throw new CustomParameterizedException("Please Enter min leave limit for educational","custom.error");
            }

            if(leaveRuleAndMaxMinLeave[1].getMinLeaveLimit() < 1){
                throw new CustomParameterizedException("Minimum leave limit should be more than 0 for educational","custom.error");
            }

            if(leaveRuleAndMaxMinLeave[1].getMinLeaveLimit() >= leaveRuleAndMaxMinLeave[1].getMaxLeaveLimit()){
                throw new CustomParameterizedException("Maximum leave limit should be more than Minimum leave limit for educational","custom.error");
            }
           
           
        }
        else if(leaveRuleAndMaxMinLeave.length == 1){
            if(leaveRuleAndMaxMinLeave[0].getEmployeeType() == null){
                throw new CustomParameterizedException("Please select employee type for leave can take at a time","custom.error");
            }

            if(leaveRuleAndMaxMinLeave[0].getMaxLeaveLimit() == null){
                throw new CustomParameterizedException("Please Enter max leave limit","custom.error");
            }
            if(leaveRuleAndMaxMinLeave[0].getMinLeaveLimit() == null){
                throw new CustomParameterizedException("Please Enter min leave limit","custom.error");
            }

            if(leaveRuleAndMaxMinLeave[0].getMinLeaveLimit() < 1){
                throw new CustomParameterizedException("Minimum leave limit should be more than 0","custom.error");
            }

            if(leaveRuleAndMaxMinLeave[0].getMinLeaveLimit() >= leaveRuleAndMaxMinLeave[0].getMaxLeaveLimit()){
                throw new CustomParameterizedException("Maximum leave limit should be more than Minimum leave limit","custom.error");
            }

           
        } else{
                throw new CustomParameterizedException("Something went wrong in leave can take at a time", "custom.error");
        }

        if(leaveRuleAndValidationType.length == 2){
            if(leaveRuleAndValidationType[0].getValidationType() == null){
                throw new CustomParameterizedException("Please select validation type in educational","custom.error");
            }
            if(leaveRuleAndValidationType[0].getLevel1() == null){
                throw new CustomParameterizedException("Please enter level1 value in educational","custom.error");
            }

            if(leaveRuleAndValidationType[1].getValidationType() == null){
                throw new CustomParameterizedException("Please select validation type in management","custom.error");
            }
            if(leaveRuleAndValidationType[1].getLevel1() == null){
                throw new CustomParameterizedException("Please enter level1 value in management","custom.error");
            }
           
        }else{
            throw new CustomParameterizedException("Something went wrong in Validation type", "custom.error");
    }

        if(leaveRule.getId() != null){
            List<LeaveRuleAndNoOfDay> leaveRuleAndNoOfDays = leaveRuleAndNoOfDayRepository
                    .findAllByLeaveRule(leaveRule);
            for (LeaveRuleAndNoOfDay entity : leaveRuleAndNoOfDays) {
                leaveRuleAndNoOfDayRepository.delete(entity);
            }

            List<LeaveRuleAndMaxMinLeave> leaveRuleAndMaxMinLeaves = leaveRuleAndMaxMinLeaveRepository
                    .findAllByLeaveRule(leaveRule);
            for (LeaveRuleAndMaxMinLeave entity : leaveRuleAndMaxMinLeaves) {
                leaveRuleAndMaxMinLeaveRepository.delete(entity);
            }

            List<LeaveRuleAndValidationType> leaveRuleAndValidationTypes = leaveRuleAndValidationTypeRepository
                    .findAllByLeaveRule(leaveRule);
            for (LeaveRuleAndValidationType entity : leaveRuleAndValidationTypes) {
                leaveRuleAndValidationTypeRepository.delete(entity);
            }
        }

    }


    /**
     * GET  /leave-rules : get all the leaveRules.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of leaveRules in body
     */
    @GetMapping("/leave-rules")
    @Timed
    public List<LeaveRule> getAllLeaveRules() {
        log.debug("REST request to get all LeaveRules");
        return leaveRuleRepository.findAllWithEagerRelationships();
        }

    /**
     * GET  /leave-rules/:id : get the "id" leaveRule.
     *
     * @param id the id of the leaveRule to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the leaveRule, or with status 404 (Not Found)
     */
    @GetMapping("/leave-rules/{id}")
    @Timed
    public ResponseEntity<LeaveRule> getLeaveRule(@PathVariable Long id) {
        log.debug("REST request to get LeaveRule : {}", id);
        LeaveRule leaveRule = leaveRuleRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(leaveRule));
    }

    @GetMapping("/leave-rules-leave-type/{id}")
    @Timed
    public LeaveRule getLeaveRuleByLeaveType(@PathVariable Long id) {
        log.debug("REST request to get LeaveType : {}", id);
        LeaveRule leaveRule = leaveRuleRepository.findOneWithEagerRelationships(leaveTypeRepository.findOne(id));
        System.out.println("leaveRule: " + leaveRule);
        return leaveRule;
    }

    /**
     * DELETE  /leave-rules/:id : delete the "id" leaveRule.
     *
     * @param id the id of the leaveRule to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/leave-rules/{id}")
    @Timed
    public ResponseEntity<Void> deleteLeaveRule(@PathVariable Long id) {
        log.debug("REST request to delete LeaveRule : {}", id);
        LeaveRule leaveRule;
        try{
        leaveRule = leaveRuleRepository.findOne(id);

        List<LeaveRuleAndNoOfDay> leaveRuleAndNoOfDays = leaveRuleAndNoOfDayRepository.findAllByLeaveRule(leaveRule);
       for (LeaveRuleAndNoOfDay entity : leaveRuleAndNoOfDays) {
           leaveRuleAndNoOfDayRepository.delete(entity);
       }
        List<LeaveRuleAndMaxMinLeave> leaveRuleAndMaxMinLeaves = leaveRuleAndMaxMinLeaveRepository.findAllByLeaveRule(leaveRule);
        for (LeaveRuleAndMaxMinLeave entity : leaveRuleAndMaxMinLeaves) {
            leaveRuleAndMaxMinLeaveRepository.delete(entity);
        }
        List<LeaveRuleAndValidationType> leaveRuleAndValidationTypes = leaveRuleAndValidationTypeRepository.findAllByLeaveRule(leaveRule);
        for (LeaveRuleAndValidationType entity : leaveRuleAndValidationTypes) {
            leaveRuleAndValidationTypeRepository.delete(entity);
        }
        
        leaveRuleRepository.delete(id);
    }
    catch (DataIntegrityViolationException e) {
        e.printStackTrace();
        throw new BadRequestAlertException("A new employee cannot already have an ID", ENTITY_NAME,
                "constrainViolation");
    }
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, leaveRule.getLeave().getCode())).build();
    }
}
