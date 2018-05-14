package com.lms.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.lms.domain.LeaveRule;
import com.lms.domain.LeaveRuleAndMaxMinLeave;
import com.lms.domain.LeaveRuleAndNoOfDay;
import com.lms.domain.LeaveRuleAndValidationType;
import com.lms.domain.LeaveType;
import com.lms.repository.LeaveRuleAndMaxMinLeaveRepository;
import com.lms.repository.LeaveRuleAndNoOfDayRepository;
import com.lms.repository.LeaveRuleAndValidationTypeRepository;
import com.lms.repository.LeaveRuleRepository;
import com.lms.repository.LeaveTypeRepository;
import com.lms.web.rest.errors.BadRequestAlertException;
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
    public ResponseEntity<LeaveRule> createLeaveRule(@Valid @RequestBody LeaveRule leaveRule) throws URISyntaxException {
        log.debug("REST request to save LeaveRule : {}", leaveRule);
        if (leaveRule.getId() != null) {
            throw new BadRequestAlertException("A new leaveRule cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LeaveRule result = leaveRuleRepository.save(leaveRule);
        return ResponseEntity.created(new URI("/api/leave-rules/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
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
    public ResponseEntity<LeaveRule> updateLeaveRule(@Valid @RequestBody LeaveRule leaveRule) throws URISyntaxException {
        log.debug("REST request to update LeaveRule : {}", leaveRule);
        if (leaveRule.getId() == null) {
            return createLeaveRule(leaveRule);
        }

        LeaveType leaveType = leaveRule.getLeave();
        Set<LeaveType> s= leaveRule.getLeaveTypes();

        for (LeaveType t : s) {
            if(t.getCode().equals(leaveType.getCode())) {
                throw new BadRequestAlertException("Leave type and join leave should be different", ENTITY_NAME,
                "joinLeaveSame");
            }
        }

        LeaveRule result = leaveRuleRepository.save(leaveRule);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, leaveRule.getId().toString()))
            .body(result);
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
        try{
        LeaveRule leaveRule = leaveRuleRepository.findOne(id);

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
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
