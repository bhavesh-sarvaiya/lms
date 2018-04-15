import { BaseEntity } from './../../shared';

export const enum EmpType1 {
    'ALL',
    ' EDUCATIONAL_WITH_VACATIONER_AND_EDUCATIONAL_WITH_NON_VACATIONER '
}

export class LeaveRuleAndNoOfDay implements BaseEntity {
    constructor(
        public id?: number,
        public employeeType?: EmpType1,
        public noOfday?: number,
        public leaveRule?: BaseEntity,
    ) {
    }
}
