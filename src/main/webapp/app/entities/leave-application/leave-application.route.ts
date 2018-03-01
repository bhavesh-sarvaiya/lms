import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LeaveApplicationComponent } from './leave-application.component';
import { LeaveApplicationDetailComponent } from './leave-application-detail.component';
import { LeaveApplicationPopupComponent } from './leave-application-dialog.component';
import { LeaveApplicationDeletePopupComponent } from './leave-application-delete-dialog.component';

export const leaveApplicationRoute: Routes = [
    {
        path: 'leave-application',
        component: LeaveApplicationComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveApplication.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'leave-application/:id',
        component: LeaveApplicationDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveApplication.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const leaveApplicationPopupRoute: Routes = [
    {
        path: 'leave-application-new',
        component: LeaveApplicationPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveApplication.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-application/:id/edit',
        component: LeaveApplicationPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveApplication.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-application/:id/delete',
        component: LeaveApplicationDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveApplication.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
