import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LmsSharedModule } from '../../shared';
import {
    LeaveApplicationService,
    LeaveApplicationPopupService,
    LeaveApplicationComponent,
    LeaveApplicationDetailComponent,
    LeaveApplicationDialogComponent,
    LeaveApplicationPopupComponent,
    LeaveApplicationDeletePopupComponent,
    LeaveApplicationDeleteDialogComponent,
    leaveApplicationRoute,
    leaveApplicationPopupRoute,
} from './';

const ENTITY_STATES = [
    ...leaveApplicationRoute,
    ...leaveApplicationPopupRoute,
];

@NgModule({
    imports: [
        LmsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LeaveApplicationComponent,
        LeaveApplicationDetailComponent,
        LeaveApplicationDialogComponent,
        LeaveApplicationDeleteDialogComponent,
        LeaveApplicationPopupComponent,
        LeaveApplicationDeletePopupComponent,
    ],
    entryComponents: [
        LeaveApplicationComponent,
        LeaveApplicationDialogComponent,
        LeaveApplicationPopupComponent,
        LeaveApplicationDeleteDialogComponent,
        LeaveApplicationDeletePopupComponent,
    ],
    providers: [
        LeaveApplicationService,
        LeaveApplicationPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LmsLeaveApplicationModule {}
