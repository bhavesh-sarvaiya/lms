package com.lms.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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

import com.codahale.metrics.annotation.Timed;
import com.lms.domain.Employee;
import com.lms.domain.User;
import com.lms.repository.EmployeeRepository;
import com.lms.repository.UserRepository;
import com.lms.security.SecurityUtils;
import com.lms.service.MailService;
import com.lms.service.UserService;
import com.lms.service.dto.UserDTO;
import com.lms.web.rest.errors.BadRequestAlertException;
import com.lms.web.rest.errors.EmailAlreadyUsedException;
import com.lms.web.rest.errors.LoginAlreadyUsedException;
import com.lms.web.rest.util.HeaderUtil;
import com.lms.web.rest.util.PaginationUtil;

import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing Employee.
 */
@RestController
@RequestMapping("/api")
public class EmployeeResource {

	private final Logger log = LoggerFactory.getLogger(EmployeeResource.class);

	private static final String ENTITY_NAME = "employee";

	private final EmployeeRepository employeeRepository;
	private final UserRepository userRepository;

	private final UserService userService;

	private final MailService mailService;

	public EmployeeResource(EmployeeRepository employeeRepository, UserRepository userRepository,
			UserService userService, MailService mailService) {
		this.employeeRepository = employeeRepository;
		this.userRepository = userRepository;
		this.userService = userService;
		this.mailService = mailService;
	}

	/**
	 * POST /employees : Create a new employee.
	 *
	 * @param employee
	 *            the employee to create
	 * @return the ResponseEntity with status 201 (Created) and with body the
	 *         new employee, or with status 400 (Bad Request) if the employee
	 *         has already an ID
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PostMapping("/employees")
	@Timed
	public ResponseEntity<Employee> createEmployee(@Valid @RequestBody Employee employee) throws URISyntaxException {
		log.debug("REST request to save Employee : {}", employee);
		if (employee.getId() != null) {
			throw new BadRequestAlertException("A new employee cannot already have an ID", ENTITY_NAME, "idexists");
		}
		Set<String> roles = new HashSet<>();
		roles.add("ROLE_USER");
		UserDTO userDTO = new UserDTO();
		userDTO.setLogin(employee.getUser().getLogin());
		userDTO.setEmail(employee.getUser().getEmail());
		userDTO.setAuthorities(roles);
		userDTO.setCreatedBy(SecurityUtils.getCurrentUserLogin().get());
		Employee result = null;
		if (userRepository.findOneByLogin(userDTO.getLogin().toLowerCase()).isPresent()) {
			throw new LoginAlreadyUsedException();
		} else if (userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).isPresent()) {
			throw new EmailAlreadyUsedException();
		} else {
			User newUser = userService.createUser(userDTO);
			employee.setUser(newUser);
			result = employeeRepository.save(employee);
			mailService.sendCreationEmail(newUser);
		}
		return ResponseEntity.created(new URI("/api/employees/" + result.getId()))
				.headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString())).body(result);
	}

	/**
	 * PUT /employees : Updates an existing employee.
	 *
	 * @param employee
	 *            the employee to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         employee, or with status 400 (Bad Request) if the employee is not
	 *         valid, or with status 500 (Internal Server Error) if the employee
	 *         couldn't be updated
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PutMapping("/employees")
	@Timed
	public ResponseEntity<Employee> updateEmployee(@Valid @RequestBody Employee employee) throws URISyntaxException {
		log.debug("REST request to update Employee : {}", employee);
		if (employee.getId() == null) {
			return createEmployee(employee);
		}
		User user = userRepository.findOneById(employee.getUser().getId());
		user.setEmail(employee.getUser().getEmail());
		user.setLogin(employee.getUser().getLogin());
		Employee result = employeeRepository.save(employee);
		userRepository.save(user);
		return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, employee.getId().toString()))
				.body(result);
	}

	/**
	 * GET /employees : get all the employees.
	 *
	 * @param pageable
	 *            the pagination information
	 * @return the ResponseEntity with status 200 (OK) and the list of employees
	 *         in body
	 */
	@GetMapping("/employees")
	@Timed
	public ResponseEntity<List<Employee>> getAllEmployees(Pageable pageable) {
		log.debug("REST request to get a page of Employees:{}","page of Employees");
		Page<Employee> page = employeeRepository.findAllByFirstNameLike("aja",pageable);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/employees");
		return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
	}

	@GetMapping("/employees-search/{value}")
	@Timed
	public ResponseEntity<List<Employee>> getAllEmployeesSearch(@PathVariable String value, Pageable pageable) {
		log.debug("REST request to get a page of Employees:{}","page of Employees");
		Page<Employee> page = employeeRepository.findAllByFirstNameLike(value,pageable);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/employees");
		return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
	}

	/**
	 * GET /employees/:id : get the "id" employee.
	 *
	 * @param id
	 *            the id of the employee to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the
	 *         employee, or with status 404 (Not Found)
	 */
	@GetMapping("/employees/{id}")
	@Timed
	public ResponseEntity<Employee> getEmployee(@PathVariable Long id) {
		log.debug("REST request to get Employee : {}", id);
		Employee employee = employeeRepository.findOne(id);
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(employee));
	}
	
    @GetMapping("/employee/id/{id}")
    @Timed
    public ResponseEntity<Employee> getEmployeeByUser(@PathVariable Long id) {
        log.debug("REST request to get  Employees by User id: {}",id);
        Employee employee = employeeRepository.findOneByUser(userRepository.findOneById(id));
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(employee));
    }
    
	/**
	 * DELETE /employees/:id : delete the "id" employee.
	 *
	 * @param id
	 *            the id of the employee to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/employees/{id}")
	@Timed
	public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
		try{
		log.debug("REST request to delete Employee : {}", id);
		
		log.debug("Deleted User: Empoyee: {}", id);
		User user = employeeRepository.findOne(id).getUser();
		employeeRepository.delete(id);
		userRepository.delete(user);
		}
		catch(DataIntegrityViolationException e){
			e.printStackTrace();
			throw new BadRequestAlertException("A new employee cannot already have an ID", ENTITY_NAME, "constrainViolation");
		}
		return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
	}
}
