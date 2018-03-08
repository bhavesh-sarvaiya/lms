import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveApplication } from './leave-application.model';
import { LeaveApplicationService } from './leave-application.service';
import { Observable } from 'rxjs/Observable';
import { Employee, EmployeeService } from '../employee';
import {LeaveApplicationComponent } from './leave-application.component';
import { Principal, User } from '../../shared';
@Component({
    selector: 'jhi-leave-application-detail',
    templateUrl: './leave-application-detail.component.html'
})
export class LeaveApplicationDetailComponent implements OnInit, OnDestroy {

    fromDate: any;
    toDate: any;
    employee: Employee;
    leaveApplication: LeaveApplication;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    currentAccount: User;
    constructor(
        private eventManager: JhiEventManager,
        private leaveApplicationService: LeaveApplicationService,
        private route: ActivatedRoute,
       // private leaveComponent: LeaveApplicationComponent
        private principal: Principal,
         private employeeService: EmployeeService
    ) {
    }

    save(status) {
        let d: Date = new Date(this.leaveApplication.toDate);
        console.log('id :' + JSON.stringify(this.leaveApplication));
        this.leaveApplication.toDate = { 'day': d.getDate() , 'month': d.getMonth() + 1, 'year': d.getFullYear() } ;
        d = new Date(this.leaveApplication.fromDate);
        this.leaveApplication.fromDate = { 'day': d.getDate() , 'month': d.getMonth() + 1, 'year': d.getFullYear() } ;
        console.log(status);
       if (this.leaveApplication.id !== undefined) {
            console.log(this.leaveApplication);
            this.leaveApplication.status = status;
             this.subscribeToSaveResponse(
            this.leaveApplicationService.update(this.leaveApplication));
        }
    }
    private subscribeToSaveResponse(result: Observable<HttpResponse<LeaveApplication>>) {
         result.subscribe((res: HttpResponse<LeaveApplication>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LeaveApplication) {
        this.eventManager.broadcast({ name: 'leaveApplicationListModification', content: 'OK'});
       // this.isSaving = false;
      //  this.activeModal.dismiss(result);
    }

    private onSaveError() {
       // this.isSaving = false;
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.currentAccount = account;
           this.loadEmployee(this.currentAccount.login);
           console.log(this.currentAccount);
        });
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLeaveApplications();
    }
    loadEmployee(email) {
        this.employeeService.findByEmail(email)
            .subscribe((employeeResponse: HttpResponse<Employee>) => {
                this.employee = employeeResponse.body;
                console.log(this.employee);
            });
    }
    load(id) {
        this.leaveApplicationService.find(id)
            .subscribe((leaveApplicationResponse: HttpResponse<LeaveApplication>) => {
                this.leaveApplication = leaveApplicationResponse.body;
                this.fromDate = this.leaveApplication.fromDate;
                this.toDate = this.leaveApplication.toDate;
            });
           // this.employee = this.leaveComponent.getEmployee();
           // console.log('employee' + this.employee);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLeaveApplications() {
        this.eventSubscriber = this.eventManager.subscribe(
            'leaveApplicationListModification',
            (response) => this.load(this.leaveApplication.id)
        );
    }
}
