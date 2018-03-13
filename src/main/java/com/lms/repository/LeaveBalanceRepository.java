package com.lms.repository;

import java.util.List;

import com.lms.domain.Employee;
import com.lms.domain.LeaveBalance;
import com.lms.domain.LeaveType;

import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LeaveBalance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

	LeaveBalance findOneByLeaveTypeAndEmployee(LeaveType leaveType, Employee employee);

	Page<LeaveBalance> findAllByEmployee(Employee empoyee, Pageable pageable);
	LeaveBalance findOneByEmployeeAndLeaveType(Employee empoyee,LeaveType leaveType);


}
