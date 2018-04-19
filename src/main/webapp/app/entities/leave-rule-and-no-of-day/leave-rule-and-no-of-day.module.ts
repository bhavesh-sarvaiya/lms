import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LmsSharedModule } from '../../shared';
import {
    LeaveRuleAndNoOfDayService,
    LeaveRuleAndNoOfDayPopupService,
    LeaveRuleAndNoOfDayComponent,
    LeaveRuleAndNoOfDayDetailComponent,
    LeaveRuleAndNoOfDayDialogComponent,
    LeaveRuleAndNoOfDayPopupComponent,
    LeaveRuleAndNoOfDayDeletePopupComponent,
    LeaveRuleAndNoOfDayDeleteDialogComponent,
    leaveRuleAndNoOfDayRoute,
    leaveRuleAndNoOfDayPopupRoute,
} from './';

const ENTITY_STATES = [
    ...leaveRuleAndNoOfDayRoute,
    ...leaveRuleAndNoOfDayPopupRoute,
];

@NgModule({
    imports: [
        LmsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LeaveRuleAndNoOfDayComponent,
        LeaveRuleAndNoOfDayDetailComponent,
        LeaveRuleAndNoOfDayDialogComponent,
        LeaveRuleAndNoOfDayDeleteDialogComponent,
        LeaveRuleAndNoOfDayPopupComponent,
        LeaveRuleAndNoOfDayDeletePopupComponent,
    ],
    entryComponents: [
        LeaveRuleAndNoOfDayComponent,
        LeaveRuleAndNoOfDayDialogComponent,
        LeaveRuleAndNoOfDayPopupComponent,
        LeaveRuleAndNoOfDayDeleteDialogComponent,
        LeaveRuleAndNoOfDayDeletePopupComponent,
    ],
    providers: [
        LeaveRuleAndNoOfDayService,
        LeaveRuleAndNoOfDayPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LmsLeaveRuleAndNoOfDayModule {}
