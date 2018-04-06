import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { LeaveAllocation } from './leave-allocation.model';
import { LeaveAllocationService } from './leave-allocation.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { EmployeeService, Employee } from '../employee';

@Component({
    selector: 'jhi-leave-allocation',
    templateUrl: './leave-allocation.component.html'
})
export class LeaveAllocationComponent implements OnInit, OnDestroy {

currentAccount: any;
    leaveAllocations: LeaveAllocation[];
    employees: Employee[];
    error: any;
    no: number;
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
        private eventManager: JhiEventManager,
        private employeeService: EmployeeService
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
     loadEmployee() {
        console.log('load Employee');
        this.employeeService.query()
            .subscribe((res: HttpResponse<Employee[]>) => { this.employees = res.body;
            console.log('Employee loded');
            this.loadAll();
            }, (res: HttpErrorResponse) => this.onError(res.message));
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
        this.loadEmployee();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInLeaveAllocations();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LeaveAllocation) {
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
         console.log('leave Allocation loded');
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.leaveAllocations = data;
        let employee = '';
        this.leaveAllocations.forEach((item, index) => {
             console.log('setting');
            employee = '';
            for (const e of item.employee.split(',')) {
                for (const e1 of this.employees) {
                    if ( e === e1.id + '' ) {
                            employee += e1.empEnrollmentNo + ',';
                        }
                }
            }
            item.employee = employee.substring(0, employee.length - 1);
            item.employees = employee.split(',');
            console.log(item.employees);
            this.leaveAllocations[index] = item;
        });
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
