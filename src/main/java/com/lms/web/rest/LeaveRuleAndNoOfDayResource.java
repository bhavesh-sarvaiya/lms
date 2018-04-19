package com.lms.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.lms.domain.LeaveRule;
import com.lms.domain.LeaveRuleAndNoOfDay;
import com.lms.domain.LeaveType;
import com.lms.repository.LeaveRuleAndNoOfDayRepository;
import com.lms.repository.LeaveRuleRepository;
import com.lms.web.rest.errors.BadRequestAlertException;
import com.lms.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing LeaveRuleAndNoOfDay.
 */
@RestController
@RequestMapping("/api")
public class LeaveRuleAndNoOfDayResource {

    private final Logger log = LoggerFactory.getLogger(LeaveRuleAndNoOfDayResource.class);

    private static final String ENTITY_NAME = "leaveRuleAndNoOfDay";

    private final LeaveRuleAndNoOfDayRepository leaveRuleAndNoOfDayRepository;
    private final LeaveRuleRepository leaveRuleRepository;

    public LeaveRuleAndNoOfDayResource(LeaveRuleAndNoOfDayRepository leaveRuleAndNoOfDayRepository,LeaveRuleRepository leaveRuleRepository) {
        this.leaveRuleAndNoOfDayRepository = leaveRuleAndNoOfDayRepository;
        this.leaveRuleRepository = leaveRuleRepository;
    }

    /**
     * POST  /leave-rule-and-no-of-days : Create a new leaveRuleAndNoOfDay.
     *
     * @param leaveRuleAndNoOfDay the leaveRuleAndNoOfDay to create
     * @return the ResponseEntity with status 201 (Created) and with body the new leaveRuleAndNoOfDay, or with status 400 (Bad Request) if the leaveRuleAndNoOfDay has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/leave-rule-and-no-of-days")
    @Timed
    public ResponseEntity<LeaveRuleAndNoOfDay> createLeaveRuleAndNoOfDay(@Valid @RequestBody LeaveRuleAndNoOfDay leaveRuleAndNoOfDay) throws URISyntaxException {
        log.debug("REST request to save LeaveRuleAndNoOfDay : {}", leaveRuleAndNoOfDay);
        if (leaveRuleAndNoOfDay.getId() != null) {
            throw new BadRequestAlertException("A new leaveRuleAndNoOfDay cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LeaveType leaveType = leaveRuleAndNoOfDay.getLeaveRule().getLeave();
        LeaveRule leaveRule = leaveRuleRepository.findOneByLeave(leaveType);
        leaveRuleAndNoOfDay.setLeaveRule(leaveRule);
        LeaveRuleAndNoOfDay result = leaveRuleAndNoOfDayRepository.save(leaveRuleAndNoOfDay);
        return ResponseEntity.created(new URI("/api/leave-rule-and-no-of-days/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /leave-rule-and-no-of-days : Updates an existing leaveRuleAndNoOfDay.
     *
     * @param leaveRuleAndNoOfDay the leaveRuleAndNoOfDay to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated leaveRuleAndNoOfDay,
     * or with status 400 (Bad Request) if the leaveRuleAndNoOfDay is not valid,
     * or with status 500 (Internal Server Error) if the leaveRuleAndNoOfDay couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/leave-rule-and-no-of-days")
    @Timed
    public ResponseEntity<LeaveRuleAndNoOfDay> updateLeaveRuleAndNoOfDay(@Valid @RequestBody LeaveRuleAndNoOfDay leaveRuleAndNoOfDay) throws URISyntaxException {
        log.debug("REST request to update LeaveRuleAndNoOfDay : {}", leaveRuleAndNoOfDay);
        if (leaveRuleAndNoOfDay.getId() == null) {
            return createLeaveRuleAndNoOfDay(leaveRuleAndNoOfDay);
        }
        LeaveRuleAndNoOfDay result = leaveRuleAndNoOfDayRepository.save(leaveRuleAndNoOfDay);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, leaveRuleAndNoOfDay.getId().toString()))
            .body(result);
    }

    /**
     * GET  /leave-rule-and-no-of-days : get all the leaveRuleAndNoOfDays.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of leaveRuleAndNoOfDays in body
     */
    @GetMapping("/leave-rule-and-no-of-days")
    @Timed
    public List<LeaveRuleAndNoOfDay> getAllLeaveRuleAndNoOfDays() {
        log.debug("REST request to get all LeaveRuleAndNoOfDays");
        return leaveRuleAndNoOfDayRepository.findAll();
        }

    /**
     * GET  /leave-rule-and-no-of-days/:id : get the "id" leaveRuleAndNoOfDay.
     *
     * @param id the id of the leaveRuleAndNoOfDay to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the leaveRuleAndNoOfDay, or with status 404 (Not Found)
     */
    @GetMapping("/leave-rule-and-no-of-days/{id}")
    @Timed
    public ResponseEntity<LeaveRuleAndNoOfDay> getLeaveRuleAndNoOfDay(@PathVariable Long id) {
        log.debug("REST request to get LeaveRuleAndNoOfDay : {}", id);
        LeaveRuleAndNoOfDay leaveRuleAndNoOfDay = leaveRuleAndNoOfDayRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(leaveRuleAndNoOfDay));
    }

    /**
     * DELETE  /leave-rule-and-no-of-days/:id : delete the "id" leaveRuleAndNoOfDay.
     *
     * @param id the id of the leaveRuleAndNoOfDay to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/leave-rule-and-no-of-days/{id}")
    @Timed
    public ResponseEntity<Void> deleteLeaveRuleAndNoOfDay(@PathVariable Long id) {
        log.debug("REST request to delete LeaveRuleAndNoOfDay : {}", id);
        leaveRuleAndNoOfDayRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
