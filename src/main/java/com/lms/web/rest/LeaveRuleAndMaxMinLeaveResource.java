package com.lms.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.lms.domain.LeaveRule;
import com.lms.domain.LeaveRuleAndMaxMinLeave;
import com.lms.domain.LeaveType;
import com.lms.repository.LeaveRuleAndMaxMinLeaveRepository;
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
 * REST controller for managing LeaveRuleAndMaxMinLeave.
 */
@RestController
@RequestMapping("/api")
public class LeaveRuleAndMaxMinLeaveResource {

    private final Logger log = LoggerFactory.getLogger(LeaveRuleAndMaxMinLeaveResource.class);

    private static final String ENTITY_NAME = "leaveRuleAndMaxMinLeave";

    private final LeaveRuleAndMaxMinLeaveRepository leaveRuleAndMaxMinLeaveRepository;
    private final LeaveRuleRepository leaveRuleRepository;

    public LeaveRuleAndMaxMinLeaveResource(LeaveRuleAndMaxMinLeaveRepository leaveRuleAndMaxMinLeaveRepository,LeaveRuleRepository leaveRuleRepository) {
        this.leaveRuleAndMaxMinLeaveRepository = leaveRuleAndMaxMinLeaveRepository;
        this.leaveRuleRepository = leaveRuleRepository;
    }

    /**
     * POST  /leave-rule-and-max-min-leaves : Create a new leaveRuleAndMaxMinLeave.
     *
     * @param leaveRuleAndMaxMinLeave the leaveRuleAndMaxMinLeave to create
     * @return the ResponseEntity with status 201 (Created) and with body the new leaveRuleAndMaxMinLeave, or with status 400 (Bad Request) if the leaveRuleAndMaxMinLeave has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/leave-rule-and-max-min-leaves")
    @Timed
    public ResponseEntity<LeaveRuleAndMaxMinLeave> createLeaveRuleAndMaxMinLeave(@Valid @RequestBody LeaveRuleAndMaxMinLeave leaveRuleAndMaxMinLeave) throws URISyntaxException {
        log.debug("REST request to save LeaveRuleAndMaxMinLeave : {}", leaveRuleAndMaxMinLeave);
        if (leaveRuleAndMaxMinLeave.getId() != null) {
            throw new BadRequestAlertException("A new leaveRuleAndMaxMinLeave cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LeaveType leaveType = leaveRuleAndMaxMinLeave.getLeaveRule().getLeave();
        LeaveRule leaveRule = leaveRuleRepository.findOneByLeave(leaveType);
        leaveRuleAndMaxMinLeave.setLeaveRule(leaveRule);
        LeaveRuleAndMaxMinLeave result = leaveRuleAndMaxMinLeaveRepository.save(leaveRuleAndMaxMinLeave);
        return ResponseEntity.created(new URI("/api/leave-rule-and-max-min-leaves/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /leave-rule-and-max-min-leaves : Updates an existing leaveRuleAndMaxMinLeave.
     *
     * @param leaveRuleAndMaxMinLeave the leaveRuleAndMaxMinLeave to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated leaveRuleAndMaxMinLeave,
     * or with status 400 (Bad Request) if the leaveRuleAndMaxMinLeave is not valid,
     * or with status 500 (Internal Server Error) if the leaveRuleAndMaxMinLeave couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/leave-rule-and-max-min-leaves")
    @Timed
    public ResponseEntity<LeaveRuleAndMaxMinLeave> updateLeaveRuleAndMaxMinLeave(@Valid @RequestBody LeaveRuleAndMaxMinLeave leaveRuleAndMaxMinLeave) throws URISyntaxException {
        log.debug("REST request to update LeaveRuleAndMaxMinLeave : {}", leaveRuleAndMaxMinLeave);
        if (leaveRuleAndMaxMinLeave.getId() == null) {
            return createLeaveRuleAndMaxMinLeave(leaveRuleAndMaxMinLeave);
        }
        LeaveRuleAndMaxMinLeave result = leaveRuleAndMaxMinLeaveRepository.save(leaveRuleAndMaxMinLeave);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, leaveRuleAndMaxMinLeave.getId().toString()))
            .body(result);
    }

    /**
     * GET  /leave-rule-and-max-min-leaves : get all the leaveRuleAndMaxMinLeaves.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of leaveRuleAndMaxMinLeaves in body
     */
    @GetMapping("/leave-rule-and-max-min-leaves")
    @Timed
    public List<LeaveRuleAndMaxMinLeave> getAllLeaveRuleAndMaxMinLeaves(@RequestParam LeaveRule id) {
        log.debug("REST request to get all LeaveRuleAndMaxMinLeaves");
        return leaveRuleAndMaxMinLeaveRepository.findAllByLeaveRule(id);
        }

    /**
     * GET  /leave-rule-and-max-min-leaves/:id : get the "id" leaveRuleAndMaxMinLeave.
     *
     * @param id the id of the leaveRuleAndMaxMinLeave to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the leaveRuleAndMaxMinLeave, or with status 404 (Not Found)
     */
    @GetMapping("/leave-rule-and-max-min-leaves/{id}")
    @Timed
    public ResponseEntity<LeaveRuleAndMaxMinLeave> getLeaveRuleAndMaxMinLeave(@PathVariable Long id) {
        log.debug("REST request to get LeaveRuleAndMaxMinLeave : {}", id);
        LeaveRuleAndMaxMinLeave leaveRuleAndMaxMinLeave = leaveRuleAndMaxMinLeaveRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(leaveRuleAndMaxMinLeave));
    }

    /**
     * DELETE  /leave-rule-and-max-min-leaves/:id : delete the "id" leaveRuleAndMaxMinLeave.
     *
     * @param id the id of the leaveRuleAndMaxMinLeave to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/leave-rule-and-max-min-leaves/{id}")
    @Timed
    public ResponseEntity<Void> deleteLeaveRuleAndMaxMinLeave(@PathVariable Long id) {
        log.debug("REST request to delete LeaveRuleAndMaxMinLeave : {}", id);
        leaveRuleAndMaxMinLeaveRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
