import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveApplication } from './leave-application.model';
import { LeaveApplicationService } from './leave-application.service';
import { Principal, User } from '../../shared';
import { Employee, EmployeeService, Post } from '../employee';

@Component({
    selector: 'jhi-leave-application',
    templateUrl: './leave-application.component.html'
})

export class LeaveApplicationComponent implements OnInit, OnDestroy {
leaveApplications: LeaveApplication[];
    currentAccount: User;
    eventSubscriber: Subscription;
    employee: Employee;
    post: string;
    constructor(
        private leaveApplicationService: LeaveApplicationService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private employeeService: EmployeeService
    ) {
    }
    loadEmployee(email) {
        this.employeeService.findByEmail(email)
            .subscribe((employeeResponse: HttpResponse<Employee>) => {
                this.employee = employeeResponse.body;
            });
    }
    loadAll(status?) {
    console.log('loadAll');
    if (this.currentAccount.login === 'admin') {
        status = 'all';
    } else if (status === undefined) {
        status = 'APPLIED';
    }
        console.log('status: ' + status);
        this.leaveApplicationService.query(status).subscribe(
            (res: HttpResponse<LeaveApplication[]>) => {
                this.leaveApplications = res.body;
            console.log('application' + this.leaveApplications);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit(status?) {
            this.principal.identity().then((account) => {
                this.currentAccount = account;
                this.loadEmployee(this.currentAccount.login);
            this.loadAll(status);
            });
        this.registerChangeInLeaveApplications();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LeaveApplication) {
        return item.id;
    }
    registerChangeInLeaveApplications() {
        console.log('inside register');
        this.eventSubscriber = this.eventManager.subscribe('leaveApplicationListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
/*
export enum post {
    'LDC',
    'UDC',
    'SECTIONOFFICER',
    'ASSISTANTREGISTER',
    'DEPUTYREGISTER',
    'FACULTY',
    'HOD',
    'REGISTRAR',
    'VICECHANCELLOR',
    'CHANCELLOR'
}*/
