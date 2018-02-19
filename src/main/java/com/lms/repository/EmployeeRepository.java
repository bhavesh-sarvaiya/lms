package com.lms.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lms.domain.Employee;


/**
 * Spring Data JPA repository for the Employee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	Employee findOneByEmail(String email);
	List<Employee> findAllByTeachingstaffAndCanHaveVacationAndGranted(boolean teachingstaff,boolean canHaveVacation,boolean granted);
	Employee findOneByEmpEnrollmentNo(String enrollmentNo);



}
