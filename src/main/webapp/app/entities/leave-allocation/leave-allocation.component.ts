import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { LeaveAllocation } from './leave-allocation.model';
import { LeaveAllocationService } from './leave-allocation.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { Employee, EmployeeService } from '../employee';
@Component({
    selector: 'jhi-leave-allocation',
    templateUrl: './leave-allocation.component.html'
})
export class LeaveAllocationComponent implements OnInit, OnDestroy {

currentAccount: any;
    leaveAllocations: LeaveAllocation[];
      employees: Employee[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;

    constructor(
        private leaveAllocationService: LeaveAllocationService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService,
        private eventManager: JhiEventManager
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
    }

    loadAll() {
        this.leaveAllocationService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
                (res: HttpResponse<LeaveAllocation[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/leave-allocation'], {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate(['/leave-allocation', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        console.log(this.employeeService);
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInLeaveAllocations();
    }
    loadEmployee(leaveAllocation: LeaveAllocation) {
        this.employeeService.query1(leaveAllocation.teachingstaff, leaveAllocation.canHaveVacation, leaveAllocation.granted)
        .subscribe((res: HttpResponse<Employee[]>) => { this.employees = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
     }
    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackBy(index: number, item: LeaveAllocation) {
        // console.log(item);
        // this.loadEmployee(item);
       /* this.employeeService.query1(item.teachingstaff, item.canHaveVacation, item.granted)
        .subscribe((res: HttpResponse<Employee[]>) => { this.employees = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        console.log(this.employees);*/
        return item.id;
    }
    registerChangeInLeaveAllocations() {
        this.eventSubscriber = this.eventManager.subscribe('leaveAllocationListModification', (response) => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.leaveAllocations = data;
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
