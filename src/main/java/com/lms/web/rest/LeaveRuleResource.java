package com.lms.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.lms.domain.LeaveRule;

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
 * REST controller for managing LeaveRule.
 */
@RestController
@RequestMapping("/api")
public class LeaveRuleResource {

    private final Logger log = LoggerFactory.getLogger(LeaveRuleResource.class);

    private static final String ENTITY_NAME = "leaveRule";

    private final LeaveRuleRepository leaveRuleRepository;

    public LeaveRuleResource(LeaveRuleRepository leaveRuleRepository) {
        this.leaveRuleRepository = leaveRuleRepository;
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
        leaveRuleRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
