import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LeaveRuleComponent } from './leave-rule.component';
import { LeaveRuleDetailComponent } from './leave-rule-detail.component';
import { LeaveRulePopupComponent } from './leave-rule-dialog.component';
import { LeaveRuleDeletePopupComponent } from './leave-rule-delete-dialog.component';

export const leaveRuleRoute: Routes = [
    {
        path: 'leave-rule',
        component: LeaveRuleComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRule.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'leave-rule/:id',
        component: LeaveRuleDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRule.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const leaveRulePopupRoute: Routes = [
    {
        path: 'leave-rule-new',
        component: LeaveRulePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRule.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-rule/:id/edit',
        component: LeaveRulePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRule.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-rule/:id/delete',
        component: LeaveRuleDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRule.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
