import { BaseEntity } from './../../shared';

export const enum EmpType3 {
    'ALL',
    ' MANAGEMENT_AND_EDUCATIONAL',
    'MANAGEMENT',
    'EDUCATIONAL'
}

export const enum ValidationType {
    'LEVEL1',
    ' LEVEL2',
    ' LEVEL3',
    ' LEVEL4',
    ' LEVEL5',
    ' LEVEL6 '
}

export class LeaveRuleAndValidationType implements BaseEntity {
    constructor(
        public id?: number,
        public employeeType?: EmpType3,
        public validationType?: ValidationType,
        public level1?: number,
        public level2?: number,
        public level3?: number,
        public level4?: number,
        public level5?: number,
        public level6?: number,
        public validationType1?: ValidationType,
        public level11?: number,
        public level21?: number,
        public level31?: number,
        public level41?: number,
        public level51?: number,
        public level61?: number,
        public leaveRule?: BaseEntity,
    ) {
    }
}
