package com.lms.repository;

import com.lms.domain.LeaveApplicationHistory;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the LeaveApplicationHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaveApplicationHistoryRepository extends JpaRepository<LeaveApplicationHistory, Long> {

}
