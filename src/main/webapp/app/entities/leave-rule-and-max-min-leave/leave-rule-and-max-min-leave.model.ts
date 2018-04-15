import { BaseEntity } from './../../shared';

export const enum EmpType2 {
    'ALL',
    ' MANAGEMENT_AND_EDUCATIONAL'
}

export class LeaveRuleAndMaxMinLeave implements BaseEntity {
    constructor(
        public id?: number,
        public employeeType?: EmpType2,
        public maxLeaveLimit?: number,
        public minLeaveLimit?: number,
        public leaveRule?: BaseEntity,
    ) {
    }
}
