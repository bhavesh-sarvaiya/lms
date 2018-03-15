import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { LeaveAllocationComponent } from './leave-allocation.component';
import { LeaveAllocationDetailComponent } from './leave-allocation-detail.component';
import { LeaveAllocationPopupComponent } from './leave-allocation-dialog.component';
import { LeaveAllocationDeletePopupComponent } from './leave-allocation-delete-dialog.component';

@Injectable()
export class LeaveAllocationResolvePagingParams implements Resolve<any> {

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

export const leaveAllocationRoute: Routes = [
    {
        path: 'leave-allocation',
        component: LeaveAllocationComponent,
        resolve: {
            'pagingParams': LeaveAllocationResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'lmsApp.leaveAllocation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'leave-allocation/:id',
        component: LeaveAllocationDetailComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'lmsApp.leaveAllocation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const leaveAllocationPopupRoute: Routes = [
    {
        path: 'leave-allocation-new',
        component: LeaveAllocationPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'lmsApp.leaveAllocation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-allocation/:id/edit',
        component: LeaveAllocationPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'lmsApp.leaveAllocation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'leave-allocation/:id/delete',
        component: LeaveAllocationDeletePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'lmsApp.leaveAllocation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
