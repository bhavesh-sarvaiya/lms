import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LeaveRuleAndValidationTypeComponent } from './leave-rule-and-validation-type.component';
import { LeaveRuleAndValidationTypeDetailComponent } from './leave-rule-and-validation-type-detail.component';
import { LeaveRuleAndValidationTypePopupComponent } from './leave-rule-and-validation-type-dialog.component';
import { LeaveRuleAndValidationTypeDeletePopupComponent } from './leave-rule-and-validation-type-delete-dialog.component';

export const leaveRuleAndValidationTypeRoute: Routes = [
    {
        path: 'leave-rule-and-validation-type',
        component: LeaveRuleAndValidationTypeComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndValidationType.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'leave-rule-and-validation-type/:id',
        component: LeaveRuleAndValidationTypeDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndValidationType.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const leaveRuleAndValidationTypePopupRoute: Routes = [
    {
        path: 'leave-rule-and-validation-type-new',
        component: LeaveRuleAndValidationTypePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndValidationType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-rule-and-validation-type/:id/edit',
        component: LeaveRuleAndValidationTypePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndValidationType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-rule-and-validation-type/:id/delete',
        component: LeaveRuleAndValidationTypeDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveRuleAndValidationType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
