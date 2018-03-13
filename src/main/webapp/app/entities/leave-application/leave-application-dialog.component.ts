import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveApplication } from './leave-application.model';
import { LeaveApplicationPopupService } from './leave-application-popup.service';
import { LeaveApplicationService } from './leave-application.service';
import { Employee, EmployeeService } from '../employee';
import { LeaveType, LeaveTypeService } from '../leave-type';
import { LeaveBalance, LeaveBalanceService } from '../leave-balance';

@Component({
    selector: 'jhi-leave-application-dialog',
    templateUrl: './leave-application-dialog.component.html'
})
export class LeaveApplicationDialogComponent implements OnInit {

    leaveApplication: LeaveApplication;
    isSaving: boolean;

    employees: Employee[];
    fromDate1: string;
    toDate1: string;
    leavetypes: LeaveType[];
    leaveBalance: LeaveBalance[];
    fromDateDp: any;
    toDateDp: any;
    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private leaveApplicationService: LeaveApplicationService,
        private employeeService: EmployeeService,
        private leaveTypeService: LeaveTypeService,
        private eventManager: JhiEventManager,
        private leaveBalanceService: LeaveBalanceService
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
       // this.employeeService.query()
          //  .subscribe((res: HttpResponse<Employee[]>) => { this.employees = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
          this.leaveBalanceService.query()
          .subscribe((res: HttpResponse<LeaveBalance[]>) => { this.leaveBalance = res.body;
            console.log(JSON.stringify(this.leaveBalance));
        }, (res: HttpErrorResponse) => this.onError(res.message));
          this.leaveTypeService.query()
            .subscribe((res: HttpResponse<LeaveType[]>) => { this.leavetypes = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    dayDiff() {
       // console.log(this.leaveApplication.toDate);
       // console.log(this.fromDateDp);
        const date1 = new Date(this.fromDate1);
        const date2 = new Date(this.toDate1);
        const diffDays = date2.getDate() - date1.getDate();
        console.log('date' + this.fromDate1);
    }

    fromDate(event) {
    // this.fromDate1 = event.target.velue;
     // console.log('date' + event);
     /* if (this.toDate1 !== '') {
        this.dayDiff();
      }*/
    }

    toDate(event?: any) {
      // this.toDate1 = event.target.velue;
      // console.log('date' + event);
     /* if (this.fromDate1 !== '') {
        this.dayDiff();
      }*/
    }
    save() {
        this.isSaving = true;
        console.log(this.leaveApplication);
        if (this.leaveApplication.id !== undefined) {
            this.subscribeToSaveResponse(
                this.leaveApplicationService.update(this.leaveApplication));
        } else {
            this.subscribeToSaveResponse(
                this.leaveApplicationService.create(this.leaveApplication));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LeaveApplication>>) {
        result.subscribe((res: HttpResponse<LeaveApplication>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LeaveApplication) {
        this.eventManager.broadcast({ name: 'leaveApplicationListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackEmployeeById(index: number, item: Employee) {
        return item.id;
    }

    trackLeaveTypeById(index: number, item: LeaveType) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-leave-application-popup',
    template: ''
})
export class LeaveApplicationPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveApplicationPopupService: LeaveApplicationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.leaveApplicationPopupService
                    .open(LeaveApplicationDialogComponent as Component, params['id']);
            } else {
                this.leaveApplicationPopupService
                    .open(LeaveApplicationDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
