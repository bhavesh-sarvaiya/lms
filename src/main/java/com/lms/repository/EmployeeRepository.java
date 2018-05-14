package com.lms.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lms.domain.Department;
import com.lms.domain.Employee;
import com.lms.domain.User;
import com.lms.domain.enumeration.Post;


/**
 * Spring Data JPA repository for the Employee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	List<Employee> findAllByDepartment(Department department);
	List<Employee> findAllByPostInAndDepartment(List<Post> list,Department department);
	List<Employee> findAllByPostIn(List<Post> list);
	List<Employee> findAllByPost(Post post);
	@Query("select e from Employee e where e.firstName LIKE %?1%")
	Page<Employee> findAllByFirstNameLike(String firstName,Pageable pageable);
	Employee findOneByUser(User user);
	List<Employee> findAllByPostNotIn(List<Post> list);


}
