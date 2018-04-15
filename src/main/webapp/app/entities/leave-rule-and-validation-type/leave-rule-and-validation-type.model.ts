import { BaseEntity } from './../../shared';

export const enum EmpType2 {
    'ALL',
    ' MANAGEMENT_AND_EDUCATIONAL'
}

export const enum ValidationType {
    'LEVEL1',
    ' LEVEL2',
    ' LEVEL3',
    ' LEVEL4',
    ' LEVEL5',
    ' LEVEL6'
}

export class LeaveRuleAndValidationType implements BaseEntity {
    constructor(
        public id?: number,
        public employeeType?: EmpType2,
        public validationType?: ValidationType,
        public level1?: number,
        public level2?: number,
        public level3?: number,
        public level4?: number,
        public level5?: number,
        public level6?: number,
        public leaveRule?: BaseEntity,
    ) {
    }
}
