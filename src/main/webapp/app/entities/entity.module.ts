import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LmsDepartmentModule } from './department/department.module';
import { LmsEmployeeModule } from './employee/employee.module';
import { LmsLeaveBalanceModule } from './leave-balance/leave-balance.module';
import { LmsLeaveTypeModule } from './leave-type/leave-type.module';
import { LmsLeaveAllocationModule } from './leave-allocation/leave-allocation.module';
import { LmsLeaveApplicationModule } from './leave-application/leave-application.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        LmsDepartmentModule,
        LmsEmployeeModule,
        LmsLeaveBalanceModule,
        LmsLeaveTypeModule,
        LmsLeaveAllocationModule,
        LmsLeaveApplicationModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LmsEntityModule {}
