import { BaseEntity } from './../../shared';

export class LeaveAllocation implements BaseEntity {
    constructor(
        public id?: number,
        public teachingstaff?: boolean,
        public all?: boolean,
        public canHaveVacation?: boolean,
        public granted?: boolean,
        public noOfLeave?: number,
        public allocationDate?: any,
        public employee?: string,
        public leaveType?: BaseEntity,
    ) {
        this.teachingstaff = false;
        this.canHaveVacation = false;
        this.granted = false;
    }
}
