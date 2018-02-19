package com.lms.repository;

import com.lms.domain.LeaveAllocation;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LeaveAllocation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaveAllocationRepository extends JpaRepository<LeaveAllocation, Long> {

}
