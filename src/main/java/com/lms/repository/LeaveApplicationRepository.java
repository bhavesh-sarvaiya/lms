package com.lms.repository;

import java.util.List;

import com.lms.domain.Department;
import com.lms.domain.Employee;
import com.lms.domain.LeaveApplication;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LeaveApplication entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaveApplicationRepository extends JpaRepository<LeaveApplication, Long> {
 
	LeaveApplication findOneByEmployee(Employee employee);
	List<LeaveApplication> findAllByEmployee(Employee employee);
	List<LeaveApplication> findAllByEmployeeAndStatus(Employee employee,String status);
	List<LeaveApplication> findAllByStatus(String status);
	List<LeaveApplication> findAllByStatusAndFlowStatusIn(String status,List<String> flowStatus);
	List<LeaveApplication> findAllByEmployeeInAndFlowStatusOrFlowStatus(List<Employee> employeeList,String flowStatus,String flowStatus1);
	List<LeaveApplication> findAllByEmployeeInAndFlowStatusOrFlowStatusIn(List<Employee> employeeList,String flowStatus,List<String> flowStatusList);
	
}
