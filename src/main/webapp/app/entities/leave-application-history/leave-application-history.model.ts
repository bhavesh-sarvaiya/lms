import { BaseEntity } from './../../shared';

export class LeaveApplicationHistory implements BaseEntity {
    constructor(
        public id?: number,
        public actionDate?: any,
        public status?: string,
        public actionInfo?: string,
        public employee?: BaseEntity,
        public actor?: BaseEntity,
        public leaveType?: BaseEntity,
    ) {
    }
}
