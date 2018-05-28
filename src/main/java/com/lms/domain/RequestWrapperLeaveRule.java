
package com.lms.domain;

import java.io.Serializable;
import java.util.Arrays;

public class RequestWrapperLeaveRule implements Serializable {

	private static final long serialVersionUID = 1L;
    private LeaveRule leaveRule;
    private LeaveRuleAndNoOfDay leaveRuleAndNoOfDay[];
    private LeaveRuleAndMaxMinLeave leaveRuleAndMaxMinLeave[];
    private LeaveRuleAndValidationType leaveRuleAndValidationType[];

    public void setLeaveRule(LeaveRule leaveRule){
        this.leaveRule = leaveRule;
    }
    public LeaveRule getLeaveRule(){
        return leaveRule;
    }
	public LeaveRuleAndNoOfDay[] getLeaveRuleAndNoOfDay() {
		return leaveRuleAndNoOfDay;
	}
	public void setLeaveRuleAndNoOfDay(LeaveRuleAndNoOfDay[] leaveRuleAndNoOfDay) {
		this.leaveRuleAndNoOfDay = leaveRuleAndNoOfDay;
	}
	public LeaveRuleAndMaxMinLeave[] getLeaveRuleAndMaxMinLeave() {
		return leaveRuleAndMaxMinLeave;
	}
	public void setLeaveRuleAndMaxMinLeave(LeaveRuleAndMaxMinLeave[] leaveRuleAndMaxMinLeave) {
		this.leaveRuleAndMaxMinLeave = leaveRuleAndMaxMinLeave;
	}
	public LeaveRuleAndValidationType[] getLeaveRuleAndValidationType() {
		return leaveRuleAndValidationType;
	}
	public void setLeaveRuleAndValidationType(LeaveRuleAndValidationType[] leaveRuleAndValidationType) {
		this.leaveRuleAndValidationType = leaveRuleAndValidationType;
	}
	@Override
	public String toString() {
		return "RequestWrapperLeaveRule [leaveRule=" + leaveRule + ", leaveRuleAndNoOfDay="
				+ Arrays.toString(leaveRuleAndNoOfDay) + ", leaveRuleAndMaxMinLeave="
				+ Arrays.toString(leaveRuleAndMaxMinLeave) + ", leaveRuleAndValidationType="
				+ Arrays.toString(leaveRuleAndValidationType) + "]";
	}

    
}