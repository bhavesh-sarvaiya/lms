import { BaseEntity } from './../../shared';

export const enum EmpType2 {
    'ALL',
    MANAGEMENT_AND_EDUCATIONAL = 'MANAGEMENT_AND_EDUCATIONAL',
    MANAGEMENT = 'MANAGEMENT',
    EDUCATIONAL = 'EDUCATIONAL'
}

export class LeaveRuleAndMaxMinLeave implements BaseEntity {
    constructor(
        public id?: number,
        public employeeType?: EmpType2,
        public maxLeaveLimit?: number,
        public minLeaveLimit?: number,
        public maxLeaveLimit1?: number,
        public minLeaveLimit1?: number,
        public leaveRule?: BaseEntity,
    ) {
    }
}
