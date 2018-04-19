import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LeaveRuleAndNoOfDayComponent } from './leave-rule-and-no-of-day.component';
import { LeaveRuleAndNoOfDayDetailComponent } from './leave-rule-and-no-of-day-detail.component';
import { LeaveRuleAndNoOfDayPopupComponent } from './leave-rule-and-no-of-day-dialog.component';
import { LeaveRuleAndNoOfDayDeletePopupComponent } from './leave-rule-and-no-of-day-delete-dialog.component';

export const leaveRuleAndNoOfDayRoute: Routes = [
    {
        path: 'leave-rule-and-no-of-day',
        component: LeaveRuleAndNoOfDayComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndNoOfDay.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'leave-rule-and-no-of-day/:id',
        component: LeaveRuleAndNoOfDayDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndNoOfDay.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const leaveRuleAndNoOfDayPopupRoute: Routes = [
    {
        path: 'leave-rule-and-no-of-day-new',
        component: LeaveRuleAndNoOfDayPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndNoOfDay.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-rule-and-no-of-day/:id/edit',
        component: LeaveRuleAndNoOfDayPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndNoOfDay.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-rule-and-no-of-day/:id/delete',
        component: LeaveRuleAndNoOfDayDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndNoOfDay.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
