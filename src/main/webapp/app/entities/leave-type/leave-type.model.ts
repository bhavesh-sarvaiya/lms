import { BaseEntity } from './../../shared';

export class LeaveType implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public code?: string,
        public description?: string,
    ) {
    }
}
