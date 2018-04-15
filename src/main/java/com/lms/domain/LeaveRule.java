package com.lms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.lms.domain.enumeration.LeaveFor;

import com.lms.domain.enumeration.Period;

/**
 * A LeaveRule.
 */
@Entity
@Table(name = "leave_rule")
public class LeaveRule implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "leave_for", nullable = false)
    private LeaveFor leaveFor;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "allocation_time_period", nullable = false)
    private Period allocationTimePeriod;

    @Column(name = "commulative")
    private Boolean commulative;

    @Column(name = "commulative_limit")
    private Double commulativeLimit;

    @OneToOne(mappedBy = "leaveRule")
    @JsonIgnore
    private LeaveType leaveType;

    @ManyToMany(mappedBy = "leaveRules")
    @JsonIgnore
    private Set<LeaveType> leaveTypeJoins = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LeaveFor getLeaveFor() {
        return leaveFor;
    }

    public LeaveRule leaveFor(LeaveFor leaveFor) {
        this.leaveFor = leaveFor;
        return this;
    }

    public void setLeaveFor(LeaveFor leaveFor) {
        this.leaveFor = leaveFor;
    }

    public Period getAllocationTimePeriod() {
        return allocationTimePeriod;
    }

    public LeaveRule allocationTimePeriod(Period allocationTimePeriod) {
        this.allocationTimePeriod = allocationTimePeriod;
        return this;
    }

    public void setAllocationTimePeriod(Period allocationTimePeriod) {
        this.allocationTimePeriod = allocationTimePeriod;
    }

    public Boolean isCommulative() {
        return commulative;
    }

    public LeaveRule commulative(Boolean commulative) {
        this.commulative = commulative;
        return this;
    }

    public void setCommulative(Boolean commulative) {
        this.commulative = commulative;
    }

    public Double getCommulativeLimit() {
        return commulativeLimit;
    }

    public LeaveRule commulativeLimit(Double commulativeLimit) {
        this.commulativeLimit = commulativeLimit;
        return this;
    }

    public void setCommulativeLimit(Double commulativeLimit) {
        this.commulativeLimit = commulativeLimit;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public LeaveRule leaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
        return this;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }

    public Set<LeaveType> getLeaveTypeJoins() {
        return leaveTypeJoins;
    }

    public LeaveRule leaveTypeJoins(Set<LeaveType> leaveTypes) {
        this.leaveTypeJoins = leaveTypes;
        return this;
    }

    public LeaveRule addLeaveTypeJoin(LeaveType leaveType) {
        this.leaveTypeJoins.add(leaveType);
        leaveType.getLeaveRules().add(this);
        return this;
    }

    public LeaveRule removeLeaveTypeJoin(LeaveType leaveType) {
        this.leaveTypeJoins.remove(leaveType);
        leaveType.getLeaveRules().remove(this);
        return this;
    }

    public void setLeaveTypeJoins(Set<LeaveType> leaveTypes) {
        this.leaveTypeJoins = leaveTypes;
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
        LeaveRule leaveRule = (LeaveRule) o;
        if (leaveRule.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), leaveRule.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "LeaveRule{" +
            "id=" + getId() +
            ", leaveFor='" + getLeaveFor() + "'" +
            ", allocationTimePeriod='" + getAllocationTimePeriod() + "'" +
            ", commulative='" + isCommulative() + "'" +
            ", commulativeLimit=" + getCommulativeLimit() +
            "}";
    }
}
