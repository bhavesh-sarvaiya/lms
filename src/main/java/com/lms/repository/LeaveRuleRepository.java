package com.lms.repository;

import com.lms.domain.LeaveRule;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LeaveRule entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaveRuleRepository extends JpaRepository<LeaveRule, Long> {

}
