package com.lms.domain;


import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

import com.lms.domain.enumeration.EmpType2;

import com.lms.domain.enumeration.ValidationType;

/**
 * A LeaveRuleAndValidationType.
 */
@Entity
@Table(name = "leave_rule_and_validation_type")
public class LeaveRuleAndValidationType implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "employee_type", nullable = false)
    private EmpType2 employeeType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "validation_type", nullable = false)
    private ValidationType validationType;

    @NotNull
    @Column(name = "level_1", nullable = false)
    private Double level1;

    @Column(name = "level_2")
    private Double level2;

    @Column(name = "level_3")
    private Double level3;

    @Column(name = "level_4")
    private Double level4;

    @Column(name = "level_5")
    private Double level5;

    @Column(name = "level_6")
    private Double level6;

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

    public EmpType2 getEmployeeType() {
        return employeeType;
    }

    public LeaveRuleAndValidationType employeeType(EmpType2 employeeType) {
        this.employeeType = employeeType;
        return this;
    }

    public void setEmployeeType(EmpType2 employeeType) {
        this.employeeType = employeeType;
    }

    public ValidationType getValidationType() {
        return validationType;
    }

    public LeaveRuleAndValidationType validationType(ValidationType validationType) {
        this.validationType = validationType;
        return this;
    }

    public void setValidationType(ValidationType validationType) {
        this.validationType = validationType;
    }

    public Double getLevel1() {
        return level1;
    }

    public LeaveRuleAndValidationType level1(Double level1) {
        this.level1 = level1;
        return this;
    }

    public void setLevel1(Double level1) {
        this.level1 = level1;
    }

    public Double getLevel2() {
        return level2;
    }

    public LeaveRuleAndValidationType level2(Double level2) {
        this.level2 = level2;
        return this;
    }

    public void setLevel2(Double level2) {
        this.level2 = level2;
    }

    public Double getLevel3() {
        return level3;
    }

    public LeaveRuleAndValidationType level3(Double level3) {
        this.level3 = level3;
        return this;
    }

    public void setLevel3(Double level3) {
        this.level3 = level3;
    }

    public Double getLevel4() {
        return level4;
    }

    public LeaveRuleAndValidationType level4(Double level4) {
        this.level4 = level4;
        return this;
    }

    public void setLevel4(Double level4) {
        this.level4 = level4;
    }

    public Double getLevel5() {
        return level5;
    }

    public LeaveRuleAndValidationType level5(Double level5) {
        this.level5 = level5;
        return this;
    }

    public void setLevel5(Double level5) {
        this.level5 = level5;
    }

    public Double getLevel6() {
        return level6;
    }

    public LeaveRuleAndValidationType level6(Double level6) {
        this.level6 = level6;
        return this;
    }

    public void setLevel6(Double level6) {
        this.level6 = level6;
    }

    public LeaveRule getLeaveRule() {
        return leaveRule;
    }

    public LeaveRuleAndValidationType leaveRule(LeaveRule leaveRule) {
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
        LeaveRuleAndValidationType leaveRuleAndValidationType = (LeaveRuleAndValidationType) o;
        if (leaveRuleAndValidationType.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), leaveRuleAndValidationType.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "LeaveRuleAndValidationType{" +
            "id=" + getId() +
            ", employeeType='" + getEmployeeType() + "'" +
            ", validationType='" + getValidationType() + "'" +
            ", level1=" + getLevel1() +
            ", level2=" + getLevel2() +
            ", level3=" + getLevel3() +
            ", level4=" + getLevel4() +
            ", level5=" + getLevel5() +
            ", level6=" + getLevel6() +
            "}";
    }
}
