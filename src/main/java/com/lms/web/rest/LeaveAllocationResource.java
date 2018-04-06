package com.lms.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.codahale.metrics.annotation.Timed;
import com.lms.domain.Employee;
import com.lms.domain.LeaveAllocation;
import com.lms.domain.LeaveBalance;
import com.lms.repository.*;
import com.lms.web.rest.errors.BadRequestAlertException;
import com.lms.web.rest.util.HeaderUtil;
import com.lms.web.rest.util.PaginationUtil;

import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing LeaveAllocation.
 */
@RestController
@RequestMapping("/api")
public class LeaveAllocationResource {

	private final Logger log = LoggerFactory.getLogger(LeaveAllocationResource.class);

	private static final String ENTITY_NAME = "leaveAllocation";

	private final EmployeeRepository employeeRepository;
	private final LeaveAllocationRepository leaveAllocationRepository;
	private final LeaveBalanceRepository leaveBalanceRepository;

	public LeaveAllocationResource(LeaveAllocationRepository leaveAllocationRepository,
			EmployeeRepository employeeRepository, LeaveBalanceRepository leaveBalanceRepository) {
		this.leaveAllocationRepository = leaveAllocationRepository;
		this.employeeRepository = employeeRepository;
		this.leaveBalanceRepository = leaveBalanceRepository;
	}

	/**
	 * POST /leave-allocations : Create a new leaveAllocation.
	 *
	 * @param leaveAllocation
	 *            the leaveAllocation to create
	 * @return the ResponseEntity with status 201 (Created) and with body the
	 *         new leaveAllocation, or with status 400 (Bad Request) if the
	 *         leaveAllocation has already an ID
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PostMapping("/leave-allocations")
	@Timed
	public ResponseEntity<LeaveAllocation> createLeaveAllocation(@Valid @RequestBody LeaveAllocation leaveAllocation)
			throws URISyntaxException {
		log.debug("REST request to save LeaveAllocation : {}", leaveAllocation);
		if (leaveAllocation.getId() != null) {
			throw new BadRequestAlertException("A new leaveAllocation cannot already have an ID", ENTITY_NAME,
					"idexists");
		}

		//List<Employee> employeeList = findEmployee(leaveAllocation);
		LeaveAllocation result = null;
		//System.out.println("\n\nsize:" + employeeList.size() + "\n\n");
		System.out.println("\n:"+leaveAllocation.getEmployee());
		if (leaveAllocation.getEmployee() == null) {
			throw new BadRequestAlertException("No Employee are selected!...", ENTITY_NAME, "emptyEmp");
		} else {
			saveLeaveBalance(leaveAllocation.getEmployee(), leaveAllocation);
			
		}
		result = leaveAllocationRepository.save(leaveAllocation);
		return ResponseEntity.created(new URI("/api/leave-allocations/" + result.getId()))
				.headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
		}

	private void saveLeaveBalance(String emp, LeaveAllocation leaveAllocation) {
		// Save LeaveBalance 
		LeaveBalance leaveBalance;
		log.debug("method: saveLeaveBalance: Starting");
		String[] employeeList = emp.split(",");
		for(String e : employeeList){
			Employee employee = employeeRepository.getOne(Long.parseLong(e));
			if(employee != null) {
					leaveBalance = leaveBalanceRepository.findOneByLeaveTypeAndEmployee(leaveAllocation.getLeaveType(),
							employee);
					if (leaveBalance == null) {
						log.debug("leaveBalance: null, Creating new LeaveBalance");
						leaveBalance = new LeaveBalance();
						leaveBalance.setNoOfLeave(leaveAllocation.getNoOfLeave());
						leaveBalance.setEmployee(employee);
						leaveBalance.setLeaveType(leaveAllocation.getLeaveType());
					} else {
						leaveBalance.setNoOfLeave((leaveBalance.getNoOfLeave() + leaveAllocation.getNoOfLeave()));
					}
			}
			else{
				throw new BadRequestAlertException("No Employee are selected!...", ENTITY_NAME, "emptyEmp");
			}
			log.debug("REST request to save LeaveBalance : {}", leaveBalance);
			leaveBalanceRepository.save(leaveBalance);
		}
		log.debug("method: saveLeaveBalance: Completed");
	}

	/**
	 * PUT /leave-allocations : Updates an existing leaveAllocation.
	 *
	 * @param leaveAllocation
	 *            the leaveAllocation to upda te
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         leaveAllocation, or with status 400 (Bad Request) if the
	 *         leaveAllocation is not valid, or with status 500 (Internal Server
	 *         Error) if the leaveAllocation couldn't be updated
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PutMapping("/leave-allocations")
	@Timed
	public ResponseEntity<LeaveAllocation> updateLeaveAllocation(@Valid @RequestBody LeaveAllocation leaveAllocation)
			throws URISyntaxException {
		log.debug("REST request to update LeaveAllocation : {}", leaveAllocation);
		if (leaveAllocation.getId() == null) {
			return createLeaveAllocation(leaveAllocation);
		}
		LeaveAllocation l=leaveAllocationRepository.findOne(leaveAllocation.getId());
		double noOfLeave =leaveAllocation.getNoOfLeave();
		leaveAllocation.setNoOfLeave((noOfLeave-l.getNoOfLeave()));
		LeaveAllocation result = null;
		if (leaveAllocation.getEmployee() == null) {
			throw new BadRequestAlertException("No Employee are selected!...", ENTITY_NAME, "idexists");
		} else {
			saveLeaveBalance(leaveAllocation.getEmployee(), leaveAllocation);
			leaveAllocation.setNoOfLeave(noOfLeave);
			result = leaveAllocationRepository.save(leaveAllocation);
		}
		return ResponseEntity.ok()
				.headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, leaveAllocation.getId().toString()))
				.body(result);
	}

	/**
	 * GET /leave-allocations : get all the leaveAllocations.
	 *
	 * @param pageable
	 *            the pagination information
	 * @return the ResponseEntity with status 200 (OK) and the list of
	 *         leaveAllocations in body
	 */
	@GetMapping("/leave-allocations")
	@Timed
	public ResponseEntity<List<LeaveAllocation>> getAllLeaveAllocations(Pageable pageable) {
		log.debug("REST request to get a page of LeaveAllocations");
		Page<LeaveAllocation> page = leaveAllocationRepository.findAll(pageable);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/leave-allocations");
		return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
	}

	/**
	 * GET /leave-allocations/:id : get the "id" leaveAllocation.
	 *
	 * @param id
	 *            the id of the leaveAllocation to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the
	 *         leaveAllocation, or with status 404 (Not Found)
	 */
	@GetMapping("/leave-allocations/{id}")
	@Timed
	public ResponseEntity<LeaveAllocation> getLeaveAllocation(@PathVariable Long id) {
		log.debug("REST request to get LeaveAllocation : {}", id);
		LeaveAllocation leaveAllocation = leaveAllocationRepository.findOne(id);
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(leaveAllocation));
	}

	/**
	 * DELETE /leave-allocations/:id : delete the "id" leaveAllocation.
	 *
	 * @param id
	 *            the id of the leaveAllocation to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/leave-allocations/{id}")
	@Timed
	public ResponseEntity<Void> deleteLeaveAllocation(@PathVariable Long id) {
		log.debug("REST request to delete LeaveAllocation : {}", id);
		leaveAllocationRepository.delete(id);
		return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
	}
}
