package com.lms.domain;


import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import com.lms.domain.enumeration.Post;

import com.lms.domain.enumeration.GenderEnum;

import com.lms.domain.enumeration.MaritalStatus;

import com.lms.domain.enumeration.BloodGroup;

/**
 * A Employee.
 */
@Entity
@Table(name = "employee")
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "teachingstaff")
    private Boolean teachingstaff;

    @Column(name = "can_have_vacation")
    private Boolean canHaveVacation;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "post", nullable = false)
    private Post post;
    
    @Column(name = "father_husband_name", nullable = true)
    private String fatherHusbandName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private GenderEnum gender;

    @NotNull
    @Column(name = "dob", nullable = false)
    private LocalDate dob;

    @NotNull
    @Column(name = "address", nullable = false)
    private String address;

    @NotNull
    @Column(name = "state", nullable = false)
    private String state;

    @NotNull
    @Column(name = "city", nullable = false)
    private String city;

    @NotNull
    @Column(name = "pincode", nullable = false)
    private String pincode;

    
    @Enumerated(EnumType.STRING)
    @Column(name = "marital_status", nullable = true)
    private MaritalStatus maritalStatus;

    
    @Column(name = "phone_number", nullable = true)
    private String phoneNumber;

    
    @Column(name = "mobile_number", nullable = true)
    private String mobileNumber;

    
    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = true)
    private BloodGroup bloodGroup;

    
    @Column(name = "physical_fit", nullable = false)
    private Boolean physicalFit;

    @NotNull
    @Column(name = "join_date", nullable = false)
    private LocalDate joinDate;

    
    @Column(name = "retired_date", nullable = true)
    private LocalDate retiredDate;

    
    @Column(name = "qualification", nullable = true)
    private String qualification;

    
    @Column(name = "payband", nullable = true)
    private Double payband;

    @Column(name = "granted")
    private Boolean granted;

    @Column(name = "othe_note")
    private String otheNote;

    @NotNull(message = "Please enter first name")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotNull
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @ManyToOne
    private Department department;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

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

    public Employee teachingstaff(Boolean teachingstaff) {
        this.teachingstaff = teachingstaff;
        return this;
    }

    public void setTeachingstaff(Boolean teachingstaff) {
        this.teachingstaff = teachingstaff;
    }

    public Boolean isCanHaveVacation() {
        return canHaveVacation;
    }

    public Employee canHaveVacation(Boolean canHaveVacation) {
        this.canHaveVacation = canHaveVacation;
        return this;
    }

    public void setCanHaveVacation(Boolean canHaveVacation) {
        this.canHaveVacation = canHaveVacation;
    }

    public Post getPost() {
        return post;
    }

    public Employee post(Post post) {
        this.post = post;
        return this;
    }

    public void setPost(Post post) {
        this.post = post;
    }


    public String getFatherHusbandName() {
        return fatherHusbandName;
    }

    public Employee fatherHusbandName(String fatherHusbandName) {
        this.fatherHusbandName = fatherHusbandName;
        return this;
    }

    public void setFatherHusbandName(String fatherHusbandName) {
        this.fatherHusbandName = fatherHusbandName;
    }

    public GenderEnum getGender() {
        return gender;
    }

    public Employee gender(GenderEnum gender) {
        this.gender = gender;
        return this;
    }

    public void setGender(GenderEnum gender) {
        this.gender = gender;
    }

    public LocalDate getDob() {
        return dob;
    }

    public Employee dob(LocalDate dob) {
        this.dob = dob;
        return this;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getAddress() {
        return address;
    }

    public Employee address(String address) {
        this.address = address;
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getState() {
        return state;
    }

    public Employee state(String state) {
        this.state = state;
        return this;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public Employee city(String city) {
        this.city = city;
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPincode() {
        return pincode;
    }

    public Employee pincode(String pincode) {
        this.pincode = pincode;
        return this;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public MaritalStatus getMaritalStatus() {
        return maritalStatus;
    }

    public Employee maritalStatus(MaritalStatus maritalStatus) {
        this.maritalStatus = maritalStatus;
        return this;
    }

    public void setMaritalStatus(MaritalStatus maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public Employee phoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public Employee mobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
        return this;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public Employee bloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
        return this;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Boolean isPhysicalFit() {
        return physicalFit;
    }

    public Employee physicalFit(Boolean physicalFit) {
        this.physicalFit = physicalFit;
        return this;
    }

    public void setPhysicalFit(Boolean physicalFit) {
        this.physicalFit = physicalFit;
    }

    public LocalDate getJoinDate() {
        return joinDate;
    }

    public Employee joinDate(LocalDate joinDate) {
        this.joinDate = joinDate;
        return this;
    }

    public void setJoinDate(LocalDate joinDate) {
        this.joinDate = joinDate;
    }

    public LocalDate getRetiredDate() {
        return retiredDate;
    }

    public Employee retiredDate(LocalDate retiredDate) {
        this.retiredDate = retiredDate;
        return this;
    }

    public void setRetiredDate(LocalDate retiredDate) {
        this.retiredDate = retiredDate;
    }

    public String getQualification() {
        return qualification;
    }

    public Employee qualification(String qualification) {
        this.qualification = qualification;
        return this;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public Double getPayband() {
        return payband;
    }

    public Employee payband(Double payband) {
        this.payband = payband;
        return this;
    }

    public void setPayband(Double payband) {
        this.payband = payband;
    }

    public Boolean isGranted() {
        return granted;
    }

    public Employee granted(Boolean granted) {
        this.granted = granted;
        return this;
    }

    public void setGranted(Boolean granted) {
        this.granted = granted;
    }

    public String getOtheNote() {
        return otheNote;
    }

    public Employee otheNote(String otheNote) {
        this.otheNote = otheNote;
        return this;
    }

    public void setOtheNote(String otheNote) {
        this.otheNote = otheNote;
    }

    public String getFirstName() {
        return firstName;
    }

    public Employee firstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public Employee lastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Department getDepartment() {
        return department;
    }

    public Employee department(Department department) {
        this.department = department;
        return this;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public User getUser() {
        return user;
    }

    public Employee user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
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
        Employee employee = (Employee) o;
        if (employee.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), employee.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Employee{" +
            "id=" + getId() +
            ", teachingstaff='" + isTeachingstaff() + "'" +
            ", canHaveVacation='" + isCanHaveVacation() + "'" +
            ", post='" + getPost() + "'" +
            ", fatherHusbandName='" + getFatherHusbandName() + "'" +
            ", gender='" + getGender() + "'" +
            ", dob='" + getDob() + "'" +
            ", address='" + getAddress() + "'" +
            ", state='" + getState() + "'" +
            ", city='" + getCity() + "'" +
            ", pincode='" + getPincode() + "'" +
            ", maritalStatus='" + getMaritalStatus() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", mobileNumber='" + getMobileNumber() + "'" +
            ", bloodGroup='" + getBloodGroup() + "'" +
            ", physicalFit='" + isPhysicalFit() + "'" +
            ", joinDate='" + getJoinDate() + "'" +
            ", retiredDate='" + getRetiredDate() + "'" +
            ", qualification='" + getQualification() + "'" +
            ", payband=" + getPayband() +
            ", granted='" + isGranted() + "'" +
            ", otheNote='" + getOtheNote() + "'" +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            "}";
    }
}
