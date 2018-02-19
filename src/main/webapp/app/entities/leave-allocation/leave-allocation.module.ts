import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LmsSharedModule } from '../../shared';
import {
    LeaveAllocationService,
    LeaveAllocationPopupService,
    LeaveAllocationComponent,
    LeaveAllocationDetailComponent,
    LeaveAllocationDialogComponent,
    LeaveAllocationPopupComponent,
    LeaveAllocationDeletePopupComponent,
    LeaveAllocationDeleteDialogComponent,
    leaveAllocationRoute,
    leaveAllocationPopupRoute,
    LeaveAllocationResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...leaveAllocationRoute,
    ...leaveAllocationPopupRoute,
];

@NgModule({
    imports: [
        LmsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LeaveAllocationComponent,
        LeaveAllocationDetailComponent,
        LeaveAllocationDialogComponent,
        LeaveAllocationDeleteDialogComponent,
        LeaveAllocationPopupComponent,
        LeaveAllocationDeletePopupComponent,
    ],
    entryComponents: [
        LeaveAllocationComponent,
        LeaveAllocationDialogComponent,
        LeaveAllocationPopupComponent,
        LeaveAllocationDeleteDialogComponent,
        LeaveAllocationDeletePopupComponent,
    ],
    providers: [
        LeaveAllocationService,
        LeaveAllocationPopupService,
        LeaveAllocationResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LmsLeaveAllocationModule {}
