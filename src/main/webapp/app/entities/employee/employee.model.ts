import { BaseEntity } from './../../shared';

export const enum Post {
    'LDC',
    'UDP',
    'SECTIONOFFICER',
    'ASSISTANTREGISTER',
    'DEPUTYREGISTER',
    'FACULTY',
    'HOD',
    'REGISTRAR',
    'VICECHANCELLOR',
    'CHANCELLOR'
}

export const enum GenderEnum {
    'MALE',
    'FEMALE'
}

export const enum MaritalStatus {
    'MARRIED',
    'UNMMARIED',
    'DIVORCED'
}

export const enum BloodGroup {
    'APOSITIVE',
    'OPOSITIVE',
    'BPOSITIVE',
    'ABPOSITIVE',
    'ANEGATIVE',
    'ONEGATIVE',
    'BNEGATIVE',
    'ABNEGATIVE'
}

export class Employee implements BaseEntity {
    constructor(
        public id?: number,
        public teachingstaff?: boolean,
        public canHaveVacation?: boolean,
        public post?: Post,
        public middleName?: string,
        public fatherHusbandName?: string,
        public gender?: GenderEnum,
        public dob?: any,
        public address?: string,
        public state?: string,
        public city?: string,
        public pincode?: string,
        public maritalStatus?: MaritalStatus,
        public phoneNumber?: string,
        public mobileNumber?: string,
        public bloodGroup?: BloodGroup,
        public physicalFit?: boolean,
        public joinDate?: any,
        public retiredDate?: any,
        public qualification?: string,
        public payband?: number,
        public granted?: boolean,
        public otheNote?: string,
        public email?: string,
        public firstName?: string,
        public lastName?: string,
        public empEnrollmentNo?: string,
        public department?: BaseEntity,
    ) {
        this.teachingstaff = false;
        this.canHaveVacation = false;
        this.physicalFit = false;
        this.granted = false;
    }
}
