package com.lms.repository;

import java.util.List;

import com.lms.domain.Department;
import com.lms.domain.Employee;
import com.lms.domain.LeaveApplication;
import com.lms.domain.LeaveType;

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
	List<LeaveApplication> findAllByApprovedByAndStatusIn(Employee employee,List<String> status);
	List<LeaveApplication> findAllByStatus(String status);
	List<LeaveApplication> findAllByStatusAndFlowStatusIn(String status,List<String> flowStatus);
	List<LeaveApplication> findAllByEmployeeInAndFlowStatusOrFlowStatus(List<Employee> employeeList,String flowStatus,String flowStatus1);
	List<LeaveApplication> findAllByEmployeeInAndFlowStatusInAndEmployeeNotAndStatus(List<Employee> employeeList,List<String> flowStatusList,Employee employee,String status);
	@Query("select l from LeaveApplication l where l.flowStatus LIKE %?1%")
	List<LeaveApplication> findAllByFlowStatusLike(String floStatus);
	List<LeaveApplication> findAllByEmployeeInAndFlowStatusAndStatusAndEmployeeNot(List<Employee> employeeList,String floStatus,String status,Employee employee);
	List<LeaveApplication> findAllByEmployeeAndLeaveTypeAndStatus(Employee employee,LeaveType leaveType, String status);

	List<LeaveApplication> findAllByEmployeeInAndFlowStatusInAndStatus(List<Employee> employeeList,List<String> flowStatusList,String status);
	List<LeaveApplication> findAllByEmployeeInAndFlowStatusAndStatus(List<Employee> employeeList,String flowStatus,String status);

	List<LeaveApplication> findAllByEmployeeAndStatusAndJoinLeave(Employee employee,String status,String joinLeave);

}
