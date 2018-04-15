import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LmsSharedModule } from '../../shared';
import {
    LeaveRuleService,
    LeaveRulePopupService,
    LeaveRuleComponent,
    LeaveRuleDetailComponent,
    LeaveRuleDialogComponent,
    LeaveRulePopupComponent,
    LeaveRuleDeletePopupComponent,
    LeaveRuleDeleteDialogComponent,
    leaveRuleRoute,
    leaveRulePopupRoute,
} from './';

const ENTITY_STATES = [
    ...leaveRuleRoute,
    ...leaveRulePopupRoute,
];

@NgModule({
    imports: [
        LmsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LeaveRuleComponent,
        LeaveRuleDetailComponent,
        LeaveRuleDialogComponent,
        LeaveRuleDeleteDialogComponent,
        LeaveRulePopupComponent,
        LeaveRuleDeletePopupComponent,
    ],
    entryComponents: [
        LeaveRuleComponent,
        LeaveRuleDialogComponent,
        LeaveRulePopupComponent,
        LeaveRuleDeleteDialogComponent,
        LeaveRuleDeletePopupComponent,
    ],
    providers: [
        LeaveRuleService,
        LeaveRulePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LmsLeaveRuleModule {}
