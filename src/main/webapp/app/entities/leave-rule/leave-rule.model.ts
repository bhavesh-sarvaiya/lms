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
        public commulative?: boolean,
        public commulativeLimit?: number,
        public allocationTimePeriod?: Period,
        public leaveTypes?: BaseEntity[],
        public leave?: BaseEntity,
    ) {
        this.commulative = false;
    }
}
