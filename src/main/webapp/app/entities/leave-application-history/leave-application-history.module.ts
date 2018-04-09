import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LmsSharedModule } from '../../shared';
import {
    LeaveApplicationHistoryService,
    LeaveApplicationHistoryPopupService,
    LeaveApplicationHistoryComponent,
    LeaveApplicationHistoryDetailComponent,
    LeaveApplicationHistoryDialogComponent,
    LeaveApplicationHistoryPopupComponent,
    LeaveApplicationHistoryDeletePopupComponent,
    LeaveApplicationHistoryDeleteDialogComponent,
    leaveApplicationHistoryRoute,
    leaveApplicationHistoryPopupRoute,
    LeaveApplicationHistoryResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...leaveApplicationHistoryRoute,
    ...leaveApplicationHistoryPopupRoute,
];

@NgModule({
    imports: [
        LmsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LeaveApplicationHistoryComponent,
        LeaveApplicationHistoryDetailComponent,
        LeaveApplicationHistoryDialogComponent,
        LeaveApplicationHistoryDeleteDialogComponent,
        LeaveApplicationHistoryPopupComponent,
        LeaveApplicationHistoryDeletePopupComponent,
    ],
    entryComponents: [
        LeaveApplicationHistoryComponent,
        LeaveApplicationHistoryDialogComponent,
        LeaveApplicationHistoryPopupComponent,
        LeaveApplicationHistoryDeleteDialogComponent,
        LeaveApplicationHistoryDeletePopupComponent,
    ],
    providers: [
        LeaveApplicationHistoryService,
        LeaveApplicationHistoryPopupService,
        LeaveApplicationHistoryResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LmsLeaveApplicationHistoryModule {}
