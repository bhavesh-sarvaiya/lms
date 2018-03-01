import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveApplication } from './leave-application.model';
import { LeaveApplicationService } from './leave-application.service';
import { Principal, User } from '../../shared';
import * as _ from 'lodash';
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
    loadAll(a?) {
    console.log('loadAll');
        this.leaveApplicationService.query().subscribe(
            (res: HttpResponse<LeaveApplication[]>) => {
                this.leaveApplications = res.body;
                // console.log('application bfore filter' + this.leaveApplications);
                // console.log('a ' + a);
                    if ( a === 'APPROVED') {
                        console.log('inside a ' + a);
                        this.leaveApplications = _.filter(this.leaveApplications, {
                            'status': a,
                            'employee': {
                                'email': this.currentAccount.email
                            }
                        });
                    } else if ( a === 'PENDDING') {
                        // console.log('employee post ' + this.employee.post);
                         this.post = '' + this.employee.post;
                        if (this.post === 'HOD') {
                            console.log('inside PENDDING');
                        this.leaveApplications = _.filter(this.leaveApplications, {
                            'status': 'APPLIED'
                        });
                    } else if (this.post === 'FACULTY') {
                        console.log('inside FACULTY');
                        this.leaveApplications = undefined;
                    }
                    } else {
                        console.log('inside a ' + a);
                        this.leaveApplications = _.filter(this.leaveApplications, {
                            'status': 'APPLIED',
                            'employee': {
                                'email': this.currentAccount.email
                            }
                        });
                    }
            console.log('application' + JSON.stringify( this.leaveApplications));
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit(a?) {
        this.loadAll(a);
        this.principal.identity().then((account) => {
            this.currentAccount = account;
            this.loadEmployee(this.currentAccount.login);
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
        this.eventSubscriber = this.eventManager.subscribe('leaveApplicationListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
/*
export enum post {
    'LDC',
    'UDP',
    'SECTIONOFFICER',
    'ASSISTANTREGISTER',
    'DEPUTYREGISTER',
    'FACULTY',
    'HOD',
    'REGISTRAR',
    'VICECHANCELLOR',
    'CHANCELLOR'
}*/
