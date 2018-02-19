import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LmsSharedModule } from '../../shared';
import {
    LeaveBalanceService,
    LeaveBalancePopupService,
    LeaveBalanceComponent,
    LeaveBalanceDetailComponent,
    LeaveBalanceDialogComponent,
    LeaveBalancePopupComponent,
    LeaveBalanceDeletePopupComponent,
    LeaveBalanceDeleteDialogComponent,
    leaveBalanceRoute,
    leaveBalancePopupRoute,
    LeaveBalanceResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...leaveBalanceRoute,
    ...leaveBalancePopupRoute,
];

@NgModule({
    imports: [
        LmsSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LeaveBalanceComponent,
        LeaveBalanceDetailComponent,
        LeaveBalanceDialogComponent,
        LeaveBalanceDeleteDialogComponent,
        LeaveBalancePopupComponent,
        LeaveBalanceDeletePopupComponent,
    ],
    entryComponents: [
        LeaveBalanceComponent,
        LeaveBalanceDialogComponent,
        LeaveBalancePopupComponent,
        LeaveBalanceDeleteDialogComponent,
        LeaveBalanceDeletePopupComponent,
    ],
    providers: [
        LeaveBalanceService,
        LeaveBalancePopupService,
        LeaveBalanceResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LmsLeaveBalanceModule {}
