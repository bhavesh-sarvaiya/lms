package com.lms.domain;


import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A LeaveAllocation.
 */
@Entity
@Table(name = "leave_allocation")
public class LeaveAllocation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "teachingstaff")
    private Boolean teachingstaff;
    
    @Column(name = "jhi_all")
    private Boolean all;

   
	@Column(name = "can_have_vacation")
    private Boolean canHaveVacation;

    @Column(name = "granted")
    private Boolean granted;

    @NotNull
    @Column(name = "no_of_leave", nullable = false)
    private Double noOfLeave;

    @NotNull
    @Column(name = "allocation_date", nullable = false)
    private LocalDate allocationDate;

    @ManyToOne
    private LeaveType leaveType;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isTeachingstaff() {
        return teachingstaff;
    }

    public LeaveAllocation teachingstaff(Boolean teachingstaff) {
        this.teachingstaff = teachingstaff;
        return this;
    }

    public void setTeachingstaff(Boolean teachingstaff) {
        this.teachingstaff = teachingstaff;
    }
    
    public Boolean isAll() {
		return all;
	}

	public void setAll(Boolean all) {
		this.all = all;
	}
	public LeaveAllocation all(Boolean all) {
        this.all = all;
        return this;
    }

    public Boolean isCanHaveVacation() {
        return canHaveVacation;
    }

    public LeaveAllocation canHaveVacation(Boolean canHaveVacation) {
        this.canHaveVacation = canHaveVacation;
        return this;
    }

    public void setCanHaveVacation(Boolean canHaveVacation) {
        this.canHaveVacation = canHaveVacation;
    }

    public Boolean isGranted() {
        return granted;
    }

    public LeaveAllocation granted(Boolean granted) {
        this.granted = granted;
        return this;
    }

    public void setGranted(Boolean granted) {
        this.granted = granted;
    }

    public Double getNoOfLeave() {
        return noOfLeave;
    }

    public LeaveAllocation noOfLeave(Double noOfLeave) {
        this.noOfLeave = noOfLeave;
        return this;
    }

    public void setNoOfLeave(Double noOfLeave) {
        this.noOfLeave = noOfLeave;
    }

    public LocalDate getAllocationDate() {
        return allocationDate;
    }

    public LeaveAllocation allocationDate(LocalDate allocationDate) {
        this.allocationDate = allocationDate;
        return this;
    }

    public void setAllocationDate(LocalDate allocationDate) {
        this.allocationDate = allocationDate;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public LeaveAllocation leaveType(LeaveType leaveType) {
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
        LeaveAllocation leaveAllocation = (LeaveAllocation) o;
        if (leaveAllocation.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), leaveAllocation.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "LeaveAllocation{" +
            "id=" + getId() +
            ", all='" + isAll() + "'" +
            ", teachingstaff='" + isTeachingstaff() + "'" +
            ", canHaveVacation='" + isCanHaveVacation() + "'" +
            ", granted='" + isGranted() + "'" +
            ", noOfLeave=" + getNoOfLeave() +
            ", allocationDate='" + getAllocationDate() + "'" +
            "}";
    }
}
