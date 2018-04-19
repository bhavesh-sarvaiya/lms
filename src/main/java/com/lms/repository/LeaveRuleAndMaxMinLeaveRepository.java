package com.lms.repository;

import com.lms.domain.LeaveRuleAndMaxMinLeave;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LeaveRuleAndMaxMinLeave entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaveRuleAndMaxMinLeaveRepository extends JpaRepository<LeaveRuleAndMaxMinLeave, Long> {

}
