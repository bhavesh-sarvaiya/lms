package com.lms.domain;


import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

import com.lms.domain.enumeration.EmpType1;

/**
 * A LeaveRuleAndNoOfDay.
 */
@Entity
@Table(name = "leave_rule_and_no_of_day")
public class LeaveRuleAndNoOfDay implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "employee_type", nullable = false)
    private EmpType1 employeeType;

    @NotNull
    @Column(name = "no_of_day", nullable = false)
    private Double noOfDay;

    @ManyToOne(optional = false)
    @NotNull
    private LeaveRule leaveRule;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EmpType1 getEmployeeType() {
        return employeeType;
    }

    public LeaveRuleAndNoOfDay employeeType(EmpType1 employeeType) {
        this.employeeType = employeeType;
        return this;
    }

    public void setEmployeeType(EmpType1 employeeType) {
        this.employeeType = employeeType;
    }

    public Double getNoOfDay() {
        return noOfDay;
    }

    public LeaveRuleAndNoOfDay noOfDay(Double noOfDay) {
        this.noOfDay = noOfDay;
        return this;
    }

    public void setNoOfDay(Double noOfDay) {
        this.noOfDay = noOfDay;
    }

    public LeaveRule getLeaveRule() {
        return leaveRule;
    }

    public LeaveRuleAndNoOfDay leaveRule(LeaveRule leaveRule) {
        this.leaveRule = leaveRule;
        return this;
    }

    public void setLeaveRule(LeaveRule leaveRule) {
        this.leaveRule = leaveRule;
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
        LeaveRuleAndNoOfDay leaveRuleAndNoOfDay = (LeaveRuleAndNoOfDay) o;
        if (leaveRuleAndNoOfDay.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), leaveRuleAndNoOfDay.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "LeaveRuleAndNoOfDay{" +
            "id=" + getId() +
            ", employeeType='" + getEmployeeType() + "'" +
            ", noOfDay=" + getNoOfDay() +
            ", leaveRule=" + getLeaveRule() +
            "}";
    }
}
