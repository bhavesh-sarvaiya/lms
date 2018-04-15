import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LeaveRuleAndMaxMinLeaveComponent } from './leave-rule-and-max-min-leave.component';
import { LeaveRuleAndMaxMinLeaveDetailComponent } from './leave-rule-and-max-min-leave-detail.component';
import { LeaveRuleAndMaxMinLeavePopupComponent } from './leave-rule-and-max-min-leave-dialog.component';
import { LeaveRuleAndMaxMinLeaveDeletePopupComponent } from './leave-rule-and-max-min-leave-delete-dialog.component';

export const leaveRuleAndMaxMinLeaveRoute: Routes = [
    {
        path: 'leave-rule-and-max-min-leave',
        component: LeaveRuleAndMaxMinLeaveComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndMaxMinLeave.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'leave-rule-and-max-min-leave/:id',
        component: LeaveRuleAndMaxMinLeaveDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndMaxMinLeave.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const leaveRuleAndMaxMinLeavePopupRoute: Routes = [
    {
        path: 'leave-rule-and-max-min-leave-new',
        component: LeaveRuleAndMaxMinLeavePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndMaxMinLeave.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-rule-and-max-min-leave/:id/edit',
        component: LeaveRuleAndMaxMinLeavePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndMaxMinLeave.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-rule-and-max-min-leave/:id/delete',
        component: LeaveRuleAndMaxMinLeaveDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndMaxMinLeave.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
