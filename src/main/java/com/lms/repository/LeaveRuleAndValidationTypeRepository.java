package com.lms.repository;

import java.util.List;

import com.lms.domain.LeaveRule;
import com.lms.domain.LeaveRuleAndValidationType;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LeaveRuleAndValidationType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaveRuleAndValidationTypeRepository extends JpaRepository<LeaveRuleAndValidationType, Long> {

    List<LeaveRuleAndValidationType> findAllByLeaveRule(LeaveRule leaveRule);

}
