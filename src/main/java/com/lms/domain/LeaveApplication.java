package com.lms.domain;


import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A LeaveApplication.
 */
@Entity
@Table(name = "leave_application")
public class LeaveApplication implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "reason", nullable = false)
    private String reason;

    @NotNull
    @Column(name = "from_date", nullable = false)
    private LocalDate fromDate;

    @NotNull
    @Column(name = "to_date", nullable = false)
    private LocalDate toDate;

    @Column(name = "noofday")
    private Double noofday;

    @Column(name = "status")
    private String status;

    @Column(name = "flow_status")
    private String flowStatus;

    @Column(name = "join_leave")
    private String joinLeave;

    @Size(max = 500)
    @Column(name = "jhi_comment", length = 500)
    private String comment;

    @ManyToOne
    private Employee employee;

    @ManyToOne
    private Employee approvedBy;

    @ManyToOne(optional = false)
    @NotNull
    private LeaveType leaveType;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReason() {
        return reason;
    }

    public LeaveApplication reason(String reason) {
        this.reason = reason;
        return this;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getJoinLeave() {
        return joinLeave;
    }

    public LeaveApplication joinLeave(String joinLeave) {
        this.joinLeave = joinLeave;
        return this;
    }

    public void setJoinLeave(String joinLeave) {
        this.joinLeave = joinLeave;
    }

    public LocalDate getFromDate() {
        return fromDate;
    }

    public LeaveApplication fromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
        return this;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public LeaveApplication toDate(LocalDate toDate) {
        this.toDate = toDate;
        return this;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }

    public Double getNoofday() {
        return noofday;
    }

    public LeaveApplication noofday(Double noofday) {
        this.noofday = noofday;
        return this;
    }

    public void setNoofday(Double noofday) {
        this.noofday = noofday;
    }

    public String getStatus() {
        return status;
    }

    public LeaveApplication status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFlowStatus() {
        return flowStatus;
    }

    public LeaveApplication flowStatus(String flowStatus) {
        this.flowStatus = flowStatus;
        return this;
    }

    public void setFlowStatus(String flowStatus) {
        this.flowStatus = flowStatus;
    }

    public String getComment() {
        return comment;
    }

    public LeaveApplication comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Employee getEmployee() {
        return employee;
    }

    public LeaveApplication employee(Employee employee) {
        this.employee = employee;
        return this;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Employee getApprovedBy() {
        return approvedBy;
    }

    public LeaveApplication approvedBy(Employee employee) {
        this.approvedBy = employee;
        return this;
    }

    public void setApprovedBy(Employee employee) {
        this.approvedBy = employee;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public LeaveApplication leaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
        return this;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
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
        LeaveApplication leaveApplication = (LeaveApplication) o;
        if (leaveApplication.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), leaveApplication.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "LeaveApplication{" +
            "id=" + getId() +
            ", reason='" + getReason() + "'" +
            ", fromDate='" + getFromDate() + "'" +
            ", toDate='" + getToDate() + "'" +
            ", noofday=" + getNoofday() +
            ", status='" + getStatus() + "'" +
            ", flowStatus='" + getFlowStatus() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
