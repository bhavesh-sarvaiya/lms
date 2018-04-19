import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LmsDepartmentModule } from './department/department.module';
import { LmsEmployeeModule } from './employee/employee.module';
import { LmsLeaveBalanceModule } from './leave-balance/leave-balance.module';
import { LmsLeaveTypeModule } from './leave-type/leave-type.module';
import { LmsLeaveAllocationModule } from './leave-allocation/leave-allocation.module';
import { LmsLeaveApplicationModule } from './leave-application/leave-application.module';
import { LmsLeaveApplicationHistoryModule } from './leave-application-history/leave-application-history.module';
import { LmsLeaveRuleModule } from './leave-rule/leave-rule.module';
import { LmsLeaveRuleAndNoOfDayModule } from './leave-rule-and-no-of-day/leave-rule-and-no-of-day.module';
import { LmsLeaveRuleAndMaxMinLeaveModule } from './leave-rule-and-max-min-leave/leave-rule-and-max-min-leave.module';
import { LmsLeaveRuleAndValidationTypeModule } from './leave-rule-and-validation-type/leave-rule-and-validation-type.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        LmsDepartmentModule,
        LmsEmployeeModule,
        LmsLeaveBalanceModule,
        LmsLeaveTypeModule,
        LmsLeaveAllocationModule,
        LmsLeaveApplicationModule,
        LmsLeaveApplicationHistoryModule,
        LmsLeaveRuleModule,
        LmsLeaveRuleAndNoOfDayModule,
        LmsLeaveRuleAndMaxMinLeaveModule,
        LmsLeaveRuleAndValidationTypeModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LmsEntityModule {}
