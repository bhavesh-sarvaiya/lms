package com.lms.repository;

import java.util.List;
import java.util.concurrent.Future;

import com.lms.domain.LeaveType;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.scheduling.annotation.Async;


/**
 * Spring Data JPA repository for the LeaveType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaveTypeRepository extends JpaRepository<LeaveType, Long> {
    @Query(value = "select l from LeaveType l group by l.code")
    List<LeaveType> findAll();
  
     
    
    //Future<List<Employee>> findDistinctByFirstName(String firstName);
}
