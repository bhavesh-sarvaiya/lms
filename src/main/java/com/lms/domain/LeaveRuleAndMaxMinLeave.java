package com.lms.domain;


import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

import com.lms.domain.enumeration.EmpType2;

/**
 * A LeaveRuleAndMaxMinLeave.
 */
@Entity
@Table(name = "leave_rule_and_max_min_leave")
public class LeaveRuleAndMaxMinLeave implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "employee_type", nullable = false)
    private EmpType2 employeeType;

    @NotNull
    @Column(name = "max_leave_limit", nullable = false)
    private Double maxLeaveLimit;

    @NotNull
    @Column(name = "min_leave_limit", nullable = false)
    private Double minLeaveLimit;

    @ManyToOne
    private LeaveRule leaveRule;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EmpType2 getEmployeeType() {
        return employeeType;
    }

    public LeaveRuleAndMaxMinLeave employeeType(EmpType2 employeeType) {
        this.employeeType = employeeType;
        return this;
    }

    public void setEmployeeType(EmpType2 employeeType) {
        this.employeeType = employeeType;
    }

    public Double getMaxLeaveLimit() {
        return maxLeaveLimit;
    }

    public LeaveRuleAndMaxMinLeave maxLeaveLimit(Double maxLeaveLimit) {
        this.maxLeaveLimit = maxLeaveLimit;
        return this;
    }

    public void setMaxLeaveLimit(Double maxLeaveLimit) {
        this.maxLeaveLimit = maxLeaveLimit;
    }

    public Double getMinLeaveLimit() {
        return minLeaveLimit;
    }

    public LeaveRuleAndMaxMinLeave minLeaveLimit(Double minLeaveLimit) {
        this.minLeaveLimit = minLeaveLimit;
        return this;
    }

    public void setMinLeaveLimit(Double minLeaveLimit) {
        this.minLeaveLimit = minLeaveLimit;
    }

    public LeaveRule getLeaveRule() {
        return leaveRule;
    }

    public LeaveRuleAndMaxMinLeave leaveRule(LeaveRule leaveRule) {
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
        LeaveRuleAndMaxMinLeave leaveRuleAndMaxMinLeave = (LeaveRuleAndMaxMinLeave) o;
        if (leaveRuleAndMaxMinLeave.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), leaveRuleAndMaxMinLeave.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "LeaveRuleAndMaxMinLeave{" +
            "id=" + getId() +
            ", employeeType='" + getEmployeeType() + "'" +
            ", maxLeaveLimit=" + getMaxLeaveLimit() +
            ", minLeaveLimit=" + getMinLeaveLimit() +
            "}";
    }
}
