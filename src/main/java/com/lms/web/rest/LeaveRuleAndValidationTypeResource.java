package com.lms.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.lms.domain.LeaveRuleAndValidationType;

import com.lms.repository.LeaveRuleAndValidationTypeRepository;
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
 * REST controller for managing LeaveRuleAndValidationType.
 */
@RestController
@RequestMapping("/api")
public class LeaveRuleAndValidationTypeResource {

    private final Logger log = LoggerFactory.getLogger(LeaveRuleAndValidationTypeResource.class);

    private static final String ENTITY_NAME = "leaveRuleAndValidationType";

    private final LeaveRuleAndValidationTypeRepository leaveRuleAndValidationTypeRepository;

    public LeaveRuleAndValidationTypeResource(LeaveRuleAndValidationTypeRepository leaveRuleAndValidationTypeRepository) {
        this.leaveRuleAndValidationTypeRepository = leaveRuleAndValidationTypeRepository;
    }

    /**
     * POST  /leave-rule-and-validation-types : Create a new leaveRuleAndValidationType.
     *
     * @param leaveRuleAndValidationType the leaveRuleAndValidationType to create
     * @return the ResponseEntity with status 201 (Created) and with body the new leaveRuleAndValidationType, or with status 400 (Bad Request) if the leaveRuleAndValidationType has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/leave-rule-and-validation-types")
    @Timed
    public ResponseEntity<LeaveRuleAndValidationType> createLeaveRuleAndValidationType(@Valid @RequestBody LeaveRuleAndValidationType leaveRuleAndValidationType) throws URISyntaxException {
        log.debug("REST request to save LeaveRuleAndValidationType : {}", leaveRuleAndValidationType);
        if (leaveRuleAndValidationType.getId() != null) {
            throw new BadRequestAlertException("A new leaveRuleAndValidationType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LeaveRuleAndValidationType result = leaveRuleAndValidationTypeRepository.save(leaveRuleAndValidationType);
        return ResponseEntity.created(new URI("/api/leave-rule-and-validation-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /leave-rule-and-validation-types : Updates an existing leaveRuleAndValidationType.
     *
     * @param leaveRuleAndValidationType the leaveRuleAndValidationType to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated leaveRuleAndValidationType,
     * or with status 400 (Bad Request) if the leaveRuleAndValidationType is not valid,
     * or with status 500 (Internal Server Error) if the leaveRuleAndValidationType couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/leave-rule-and-validation-types")
    @Timed
    public ResponseEntity<LeaveRuleAndValidationType> updateLeaveRuleAndValidationType(@Valid @RequestBody LeaveRuleAndValidationType leaveRuleAndValidationType) throws URISyntaxException {
        log.debug("REST request to update LeaveRuleAndValidationType : {}", leaveRuleAndValidationType);
        if (leaveRuleAndValidationType.getId() == null) {
            return createLeaveRuleAndValidationType(leaveRuleAndValidationType);
        }
        LeaveRuleAndValidationType result = leaveRuleAndValidationTypeRepository.save(leaveRuleAndValidationType);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, leaveRuleAndValidationType.getId().toString()))
            .body(result);
    }

    /**
     * GET  /leave-rule-and-validation-types : get all the leaveRuleAndValidationTypes.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of leaveRuleAndValidationTypes in body
     */
    @GetMapping("/leave-rule-and-validation-types")
    @Timed
    public List<LeaveRuleAndValidationType> getAllLeaveRuleAndValidationTypes() {
        log.debug("REST request to get all LeaveRuleAndValidationTypes");
        return leaveRuleAndValidationTypeRepository.findAll();
        }

    /**
     * GET  /leave-rule-and-validation-types/:id : get the "id" leaveRuleAndValidationType.
     *
     * @param id the id of the leaveRuleAndValidationType to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the leaveRuleAndValidationType, or with status 404 (Not Found)
     */
    @GetMapping("/leave-rule-and-validation-types/{id}")
    @Timed
    public ResponseEntity<LeaveRuleAndValidationType> getLeaveRuleAndValidationType(@PathVariable Long id) {
        log.debug("REST request to get LeaveRuleAndValidationType : {}", id);
        LeaveRuleAndValidationType leaveRuleAndValidationType = leaveRuleAndValidationTypeRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(leaveRuleAndValidationType));
    }

    /**
     * DELETE  /leave-rule-and-validation-types/:id : delete the "id" leaveRuleAndValidationType.
     *
     * @param id the id of the leaveRuleAndValidationType to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/leave-rule-and-validation-types/{id}")
    @Timed
    public ResponseEntity<Void> deleteLeaveRuleAndValidationType(@PathVariable Long id) {
        log.debug("REST request to delete LeaveRuleAndValidationType : {}", id);
        leaveRuleAndValidationTypeRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
