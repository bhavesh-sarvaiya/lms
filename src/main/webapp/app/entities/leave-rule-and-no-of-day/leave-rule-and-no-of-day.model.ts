import { BaseEntity } from './../../shared';

export const enum EmpType1 {
    'ALL',
    ' EDUCATIONAL_WITH_VACATIONER_AND_EDUCATIONAL_WITH_NON_VACATIONER ',
    'EDUCATIONAL WITH VACATIONER',
    'EDUCATIONAL WITH NON VACATIONER'
}

export class LeaveRuleAndNoOfDay implements BaseEntity {
    constructor(
        public id?: number,
        public employeeType?: EmpType1,
        public noOfDay?: number,
        public noOfDay2?: number,
        public leaveRule?: BaseEntity,
    ) {
    }
}
