package com.lms.domain;


import javax.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A LeaveApplicationHistory.
 */
@Entity
@Table(name = "leave_application_history")
public class LeaveApplicationHistory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "action_date")
    private LocalDate actionDate;

    @Column(name = "status")
    private String status;

    @Column(name = "action_info")
    private String actionInfo;

    @ManyToOne
    private Employee employee;

    @ManyToOne
    private Employee actor;

    @ManyToOne
    private LeaveType leaveType;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getActionDate() {
        return actionDate;
    }

    public LeaveApplicationHistory actionDate(LocalDate actionDate) {
        this.actionDate = actionDate;
        return this;
    }

    public void setActionDate(LocalDate actionDate) {
        this.actionDate = actionDate;
    }

    public String getStatus() {
        return status;
    }

    public LeaveApplicationHistory status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getActionInfo() {
        return actionInfo;
    }

    public LeaveApplicationHistory actionInfo(String actionInfo) {
        this.actionInfo = actionInfo;
        return this;
    }

    public void setActionInfo(String actionInfo) {
        this.actionInfo = actionInfo;
    }

    public Employee getEmployee() {
        return employee;
    }

    public LeaveApplicationHistory employee(Employee employee) {
        this.employee = employee;
        return this;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Employee getActor() {
        return actor;
    }

    public LeaveApplicationHistory actor(Employee employee) {
        this.actor = employee;
        return this;
    }

    public void setActor(Employee employee) {
        this.actor = employee;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public LeaveApplicationHistory leaveType(LeaveType leaveType) {
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
        LeaveApplicationHistory leaveApplicationHistory = (LeaveApplicationHistory) o;
        if (leaveApplicationHistory.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), leaveApplicationHistory.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "LeaveApplicationHistory{" +
            "id=" + getId() +
            ", actionDate='" + getActionDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", actionInfo='" + getActionInfo() + "'" +
            "}";
    }
}
