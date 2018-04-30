package com.lms.repository;

import java.util.List;
import com.lms.domain.LeaveRule;
import com.lms.domain.LeaveRuleAndMaxMinLeave;
import com.lms.domain.enumeration.EmpType2;

import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LeaveRuleAndMaxMinLeave entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaveRuleAndMaxMinLeaveRepository extends JpaRepository<LeaveRuleAndMaxMinLeave, Long> {
    List<LeaveRuleAndMaxMinLeave> findAllByLeaveRule(LeaveRule leaveRule);
    @Query("select l.maxLeaveLimit from LeaveRuleAndMaxMinLeave l where l.leaveRule = ?1 and l.employeeType=?2")
    Double findMaxLeaveLimitByLeaveRuleAndEmployeeType(LeaveRule leaveRule, EmpType2 employeeType); 
    @Query("select l.minLeaveLimit from LeaveRuleAndMaxMinLeave l where l.leaveRule = ?1 and l.employeeType=?2")
	Double findMinLeaveLimitByLeaveRuleAndEmployeeType(LeaveRule leaveRule, EmpType2 employeeType); 
}
