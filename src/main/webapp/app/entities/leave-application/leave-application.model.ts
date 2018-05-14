import { BaseEntity } from './../../shared';

export class LeaveApplication implements BaseEntity {
    constructor(
        public id?: number,
        public reason?: string,
        public fromDate?: any,
        public toDate?: any,
        public noofday?: number,
        public joinLeaveDay?: number,
        public status?: string,
        public flowStatus?: string,
        public joinLeave?: string,
        public comment?: string,
        public employee?: BaseEntity,
        public approvedBy?: BaseEntity,
        public leaveType?: BaseEntity,
    ) {
    }
}
