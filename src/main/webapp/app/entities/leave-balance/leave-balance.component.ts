import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import { LeaveBalance } from './leave-balance.model';
import { LeaveBalanceService } from './leave-balance.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { Employee, EmployeeService } from '../employee';
import { Department, DepartmentService } from '../department';
import * as _ from 'lodash';
import { LeaveType } from '../leave-type';

@Component({
    selector: 'jhi-leave-balance',
    templateUrl: './leave-balance.component.html'
})
export class LeaveBalanceComponent implements OnInit, OnDestroy {

currentAccount: any;
    leaveBalances: LeaveBalance[];
    leaveBalances1: LeaveBalance[];
    leaveBalances2: LeaveBalance[];
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
    employee: Employee;
    searchValue: any;
    l: LeaveType;
    e: Employee;
    departments: Department[];

    constructor(
        private leaveBalanceService: LeaveBalanceService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private departmentService: DepartmentService,
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
    loadEmployee(id) {
        this.employeeService.loadEmployeeByUser(id)
            .subscribe((employeeResponse: HttpResponse<Employee>) => {
                this.employee = employeeResponse.body;
                console.log('emp id: ' + this.employee.id);
            });
    }
    searchResult() {
        const searchValue1 = this.searchValue.toLowerCase();
        if (this.searchValue.trim() !== '') {
            this.leaveBalances = this.leaveBalances1;
            this.leaveBalances = _.filter(this.leaveBalances, function(o) { return o.leaveType.code.toLowerCase().match(searchValue1) || o.employee.user.login.match(searchValue1) || o.noOfLeave.toString().match(searchValue1); });
        } else {
            this.leaveBalances = this.leaveBalances1;
        }
        console.log(searchValue1);
    }
    loadAll() {
        this.leaveBalanceService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
                (res: HttpResponse<LeaveBalance[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    loadAllByDepartment() {
        let id = this.employee.department.id;
        if (id === undefined) {
            id = 0;
        }
        this.leaveBalanceService.findAllByDepartment(id, {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
                (res: HttpResponse<LeaveBalance[]>) => this.onSuccess(res.body, res.headers),
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
        this.router.navigate(['/leave-balance'], {queryParams:
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
        this.router.navigate(['/leave-balance', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.departmentService.query()
        .subscribe((res: HttpResponse<Department[]>) => { this.departments = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.principal.identity().then((account) => {
            this.currentAccount = account;
            this.loadEmployee(this.currentAccount.id);
        });
        this.registerChangeInLeaveBalances();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LeaveBalance) {
        return item.id;
    }
    registerChangeInLeaveBalances() {
        this.eventSubscriber = this.eventManager.subscribe('leaveBalanceListModification', (response) => this.loadAll());
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
        this.leaveBalances = data;
        this.leaveBalances1 = this.leaveBalances;
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
