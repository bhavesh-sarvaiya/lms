package com.lms.repository;

import java.util.List;
import com.lms.domain.LeaveRule;
import com.lms.domain.LeaveRuleAndMaxMinLeave;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LeaveRuleAndMaxMinLeave entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaveRuleAndMaxMinLeaveRepository extends JpaRepository<LeaveRuleAndMaxMinLeave, Long> {
    List<LeaveRuleAndMaxMinLeave> findAllByLeaveRule(LeaveRule leaveRule);
}
