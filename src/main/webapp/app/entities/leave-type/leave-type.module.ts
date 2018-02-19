import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LmsSharedModule } from '../../shared';
import {
    LeaveTypeService,
    LeaveTypePopupService,
    LeaveTypeComponent,
    LeaveTypeDetailComponent,
    LeaveTypeDialogComponent,
    LeaveTypePopupComponent,
    LeaveTypeDeletePopupComponent,
    LeaveTypeDeleteDialogComponent,
    leaveTypeRoute,
    leaveTypePopupRoute,
} from './';

const ENTITY_STATES = [
    ...leaveTypeRoute,
    ...leaveTypePopupRoute,
];

@NgModule({
    imports: [
        LmsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LeaveTypeComponent,
        LeaveTypeDetailComponent,
        LeaveTypeDialogComponent,
        LeaveTypeDeleteDialogComponent,
        LeaveTypePopupComponent,
        LeaveTypeDeletePopupComponent,
    ],
    entryComponents: [
        LeaveTypeComponent,
        LeaveTypeDialogComponent,
        LeaveTypePopupComponent,
        LeaveTypeDeleteDialogComponent,
        LeaveTypeDeletePopupComponent,
    ],
    providers: [
        LeaveTypeService,
        LeaveTypePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LmsLeaveTypeModule {}
