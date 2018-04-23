package com.lms.repository;

import java.util.List;

import com.lms.domain.LeaveRule;
import com.lms.domain.LeaveRuleAndNoOfDay;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LeaveRuleAndNoOfDay entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaveRuleAndNoOfDayRepository extends JpaRepository<LeaveRuleAndNoOfDay, Long> {
    List<LeaveRuleAndNoOfDay> findAllByLeaveRule(LeaveRule LeaveRule);
}
