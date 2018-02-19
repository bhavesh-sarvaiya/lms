package com.lms.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.lms.domain.LeaveBalance;
import com.lms.repository.EmployeeRepository;
import com.lms.repository.LeaveBalanceRepository;
import com.lms.security.SecurityUtils;
import com.lms.web.rest.errors.BadRequestAlertException;
import com.lms.web.rest.util.HeaderUtil;
import com.lms.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing LeaveBalance.
 */
@RestController
@RequestMapping("/api")
public class LeaveBalanceResource {

    private final Logger log = LoggerFactory.getLogger(LeaveBalanceResource.class);

    private static final String ENTITY_NAME = "leaveBalance";
    private final EmployeeRepository employeeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;

    public LeaveBalanceResource(LeaveBalanceRepository leaveBalanceRepository,EmployeeRepository employeeRepository) {
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.employeeRepository=employeeRepository;
    }

    /**
     * POST  /leave-balances : Create a new leaveBalance.
     *
     * @param leaveBalance the leaveBalance to create
     * @return the ResponseEntity with status 201 (Created) and with body the new leaveBalance, or with status 400 (Bad Request) if the leaveBalance has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/leave-balances")
    @Timed
    public ResponseEntity<LeaveBalance> createLeaveBalance(@Valid @RequestBody LeaveBalance leaveBalance) throws URISyntaxException {
        log.debug("REST request to save LeaveBalance : {}", leaveBalance);
        if (leaveBalance.getId() != null) {
            throw new BadRequestAlertException("A new leaveBalance cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LeaveBalance result = leaveBalanceRepository.save(leaveBalance);
        return ResponseEntity.created(new URI("/api/leave-balances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /leave-balances : Updates an existing leaveBalance.
     *
     * @param leaveBalance the leaveBalance to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated leaveBalance,
     * or with status 400 (Bad Request) if the leaveBalance is not valid,
     * or with status 500 (Internal Server Error) if the leaveBalance couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/leave-balances")
    @Timed
    public ResponseEntity<LeaveBalance> updateLeaveBalance(@Valid @RequestBody LeaveBalance leaveBalance) throws URISyntaxException {
        log.debug("REST request to update LeaveBalance : {}", leaveBalance);
        if (leaveBalance.getId() == null) {
            return createLeaveBalance(leaveBalance);
        }
        LeaveBalance result = leaveBalanceRepository.save(leaveBalance);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, leaveBalance.getId().toString()))
            .body(result);
    }

    /**
     * GET  /leave-balances : get all the leaveBalances.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of leaveBalances in body
     */
    @GetMapping("/leave-balances")
    @Timed
    public ResponseEntity<List<LeaveBalance>> getAllLeaveBalances(Pageable pageable) {
        log.debug("REST request to get a page of LeaveBalances");
        Page<LeaveBalance> page=null;
        if(SecurityUtils.isCurrentUserInRole("ROLE_ADMIN"))
        {
        	page = leaveBalanceRepository.findAll(pageable);
        }
        else
        {
        	Optional<String> user=SecurityUtils.getCurrentUserLogin();
        	page = leaveBalanceRepository.findAllByEmployee(employeeRepository.findOneByEmpEnrollmentNo(user.get()),pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/leave-balances");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /leave-balances/:id : get the "id" leaveBalance.
     *
     * @param id the id of the leaveBalance to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the leaveBalance, or with status 404 (Not Found)
     */
    @GetMapping("/leave-balances/{id}")
    @Timed
    public ResponseEntity<LeaveBalance> getLeaveBalance(@PathVariable Long id) {
        log.debug("REST request to get LeaveBalance : {}", id);
        LeaveBalance leaveBalance = leaveBalanceRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(leaveBalance));
    }

    /**
     * DELETE  /leave-balances/:id : delete the "id" leaveBalance.
     *
     * @param id the id of the leaveBalance to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/leave-balances/{id}")
    @Timed
    public ResponseEntity<Void> deleteLeaveBalance(@PathVariable Long id) {
        log.debug("REST request to delete LeaveBalance : {}", id);
        leaveBalanceRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
