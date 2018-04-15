import { BaseEntity } from './../../shared';

export const enum LeaveFor {
    'BOTH',
    ' MALE',
    ' FEMALE'
}

export const enum Period {
    'YEALRY',
    ' QUARTERLY'
}

export class LeaveRule implements BaseEntity {
    constructor(
        public id?: number,
        public leaveFor?: LeaveFor,
        public allocationTimePeriod?: Period,
        public commulative?: boolean,
        public commulativeLimit?: number,
        public leaveType?: BaseEntity,
        public leaveTypeJoins?: BaseEntity[],
    ) {
        this.commulative = false;
    }
}
