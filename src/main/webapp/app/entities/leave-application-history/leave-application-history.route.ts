import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { LeaveApplicationHistoryComponent } from './leave-application-history.component';
import { LeaveApplicationHistoryDetailComponent } from './leave-application-history-detail.component';
import { LeaveApplicationHistoryPopupComponent } from './leave-application-history-dialog.component';
import { LeaveApplicationHistoryDeletePopupComponent } from './leave-application-history-delete-dialog.component';

@Injectable()
export class LeaveApplicationHistoryResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const leaveApplicationHistoryRoute: Routes = [
    {
        path: 'leave-application-history',
        component: LeaveApplicationHistoryComponent,
        resolve: {
            'pagingParams': LeaveApplicationHistoryResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveApplicationHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'leave-application-history/:id',
        component: LeaveApplicationHistoryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveApplicationHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const leaveApplicationHistoryPopupRoute: Routes = [
    {
        path: 'leave-application-history-new',
        component: LeaveApplicationHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveApplicationHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-application-history/:id/edit',
        component: LeaveApplicationHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveApplicationHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-application-history/:id/delete',
        component: LeaveApplicationHistoryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveApplicationHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
