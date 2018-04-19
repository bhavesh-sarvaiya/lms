import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LmsSharedModule } from '../../shared';
import {
    LeaveRuleAndValidationTypeService,
    LeaveRuleAndValidationTypePopupService,
    LeaveRuleAndValidationTypeComponent,
    LeaveRuleAndValidationTypeDetailComponent,
    LeaveRuleAndValidationTypeDialogComponent,
    LeaveRuleAndValidationTypePopupComponent,
    LeaveRuleAndValidationTypeDeletePopupComponent,
    LeaveRuleAndValidationTypeDeleteDialogComponent,
    leaveRuleAndValidationTypeRoute,
    leaveRuleAndValidationTypePopupRoute,
} from './';

const ENTITY_STATES = [
    ...leaveRuleAndValidationTypeRoute,
    ...leaveRuleAndValidationTypePopupRoute,
];

@NgModule({
    imports: [
        LmsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LeaveRuleAndValidationTypeComponent,
        LeaveRuleAndValidationTypeDetailComponent,
        LeaveRuleAndValidationTypeDialogComponent,
        LeaveRuleAndValidationTypeDeleteDialogComponent,
        LeaveRuleAndValidationTypePopupComponent,
        LeaveRuleAndValidationTypeDeletePopupComponent,
    ],
    entryComponents: [
        LeaveRuleAndValidationTypeComponent,
        LeaveRuleAndValidationTypeDialogComponent,
        LeaveRuleAndValidationTypePopupComponent,
        LeaveRuleAndValidationTypeDeleteDialogComponent,
        LeaveRuleAndValidationTypeDeletePopupComponent,
    ],
    providers: [
        LeaveRuleAndValidationTypeService,
        LeaveRuleAndValidationTypePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LmsLeaveRuleAndValidationTypeModule {}
