package com.lms.domain;


import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A LeaveBalance.
 */
@Entity
@Table(name = "leave_balance")
public class LeaveBalance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "no_of_leave", nullable = false)
    private Double noOfLeave;
    
    

    @ManyToOne
    private LeaveType leaveType;

    @ManyToOne(optional = false)
    @NotNull
    private Employee employee;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getNoOfLeave() {
        return noOfLeave;
    }

    public LeaveBalance noOfLeave(Double noOfLeave) {
        this.noOfLeave = noOfLeave;
        return this;
    }

    public void setNoOfLeave(Double noOfLeave) {
        this.noOfLeave = noOfLeave;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public LeaveBalance leaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
        return this;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }

    public Employee getEmployee() {
        return employee;
    }

    public LeaveBalance employee(Employee employee) {
        this.employee = employee;
        return this;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        LeaveBalance leaveBalance = (LeaveBalance) o;
        if (leaveBalance.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), leaveBalance.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "LeaveBalance{" +
            "id=" + getId() +
            ", noOfLeave=" + getNoOfLeave() +
            "}";
    }
}
