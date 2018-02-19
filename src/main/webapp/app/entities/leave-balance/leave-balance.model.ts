import { BaseEntity } from './../../shared';

export class LeaveBalance implements BaseEntity {
    constructor(
        public id?: number,
        public noOfLeave?: number,
        public leaveType?: BaseEntity,
        public employee?: BaseEntity,
    ) {
    }
}
