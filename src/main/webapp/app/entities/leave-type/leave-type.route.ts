import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LeaveTypeComponent } from './leave-type.component';
import { LeaveTypeDetailComponent } from './leave-type-detail.component';
import { LeaveTypePopupComponent } from './leave-type-dialog.component';
import { LeaveTypeDeletePopupComponent } from './leave-type-delete-dialog.component';

export const leaveTypeRoute: Routes = [
    {
        path: 'leave-type',
        component: LeaveTypeComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'lmsApp.leaveType.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'leave-type/:id',
        component: LeaveTypeDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveType.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const leaveTypePopupRoute: Routes = [
    {
        path: 'leave-type-new',
        component: LeaveTypePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'lmsApp.leaveType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-type/:id/edit',
        component: LeaveTypePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'lmsApp.leaveType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-type/:id/delete',
        component: LeaveTypeDeletePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'lmsApp.leaveType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
