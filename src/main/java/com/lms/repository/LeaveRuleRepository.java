package com.lms.repository;

import com.lms.domain.LeaveRule;
import com.lms.domain.LeaveType;

import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the LeaveRule entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaveRuleRepository extends JpaRepository<LeaveRule, Long> {
    @Query("select distinct leave_rule from LeaveRule leave_rule left join fetch leave_rule.leaveTypes")
    List<LeaveRule> findAllWithEagerRelationships();

    @Query("select leave_rule from LeaveRule leave_rule left join fetch leave_rule.leaveTypes where leave_rule.id =:id")
    LeaveRule findOneWithEagerRelationships(@Param("id") Long id);
    
    LeaveRule findOneByLeave(LeaveType leaveType);

}
