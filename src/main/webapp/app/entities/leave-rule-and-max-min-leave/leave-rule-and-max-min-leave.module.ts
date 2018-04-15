import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LmsSharedModule } from '../../shared';
import {
    LeaveRuleAndMaxMinLeaveService,
    LeaveRuleAndMaxMinLeavePopupService,
    LeaveRuleAndMaxMinLeaveComponent,
    LeaveRuleAndMaxMinLeaveDetailComponent,
    LeaveRuleAndMaxMinLeaveDialogComponent,
    LeaveRuleAndMaxMinLeavePopupComponent,
    LeaveRuleAndMaxMinLeaveDeletePopupComponent,
    LeaveRuleAndMaxMinLeaveDeleteDialogComponent,
    leaveRuleAndMaxMinLeaveRoute,
    leaveRuleAndMaxMinLeavePopupRoute,
} from './';

const ENTITY_STATES = [
    ...leaveRuleAndMaxMinLeaveRoute,
    ...leaveRuleAndMaxMinLeavePopupRoute,
];

@NgModule({
    imports: [
        LmsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LeaveRuleAndMaxMinLeaveComponent,
        LeaveRuleAndMaxMinLeaveDetailComponent,
        LeaveRuleAndMaxMinLeaveDialogComponent,
        LeaveRuleAndMaxMinLeaveDeleteDialogComponent,
        LeaveRuleAndMaxMinLeavePopupComponent,
        LeaveRuleAndMaxMinLeaveDeletePopupComponent,
    ],
    entryComponents: [
        LeaveRuleAndMaxMinLeaveComponent,
        LeaveRuleAndMaxMinLeaveDialogComponent,
        LeaveRuleAndMaxMinLeavePopupComponent,
        LeaveRuleAndMaxMinLeaveDeleteDialogComponent,
        LeaveRuleAndMaxMinLeaveDeletePopupComponent,
    ],
    providers: [
        LeaveRuleAndMaxMinLeaveService,
        LeaveRuleAndMaxMinLeavePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LmsLeaveRuleAndMaxMinLeaveModule {}
