import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { LeaveBalanceComponent } from './leave-balance.component';
import { LeaveBalanceDetailComponent } from './leave-balance-detail.component';
import { LeaveBalancePopupComponent } from './leave-balance-dialog.component';
import { LeaveBalanceDeletePopupComponent } from './leave-balance-delete-dialog.component';

@Injectable()
export class LeaveBalanceResolvePagingParams implements Resolve<any> {

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

export const leaveBalanceRoute: Routes = [
    {
        path: 'leave-balance',
        component: LeaveBalanceComponent,
        resolve: {
            'pagingParams': LeaveBalanceResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveBalance.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'leave-balance/:id',
        component: LeaveBalanceDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveBalance.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const leaveBalancePopupRoute: Routes = [
    {
        path: 'leave-balance-new',
        component: LeaveBalancePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveBalance.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-balance/:id/edit',
        component: LeaveBalancePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveBalance.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-balance/:id/delete',
        component: LeaveBalanceDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lmsApp.leaveBalance.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
