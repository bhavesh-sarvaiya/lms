package com.lms.repository;

import com.lms.domain.Employee;
import com.lms.domain.LeaveApplicationHistory;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LeaveApplicationHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaveApplicationHistoryRepository extends JpaRepository<LeaveApplicationHistory, Long> {

	Page<LeaveApplicationHistory> findAllByEmployee(Employee employee, Pageable pageable);

	Page<LeaveApplicationHistory> findAllByEmployeeOrActor(Employee employee, Employee employee2, Pageable pageable);

}
