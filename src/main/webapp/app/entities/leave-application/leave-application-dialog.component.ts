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
import { LeaveRule, LeaveRuleService } from '../leave-rule';

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
    checkBox: string[];
    textBox: string[];
    l: LeaveType;
    leaveRule: LeaveRule;
    leavetypes: LeaveType[];
    leaveBalance: LeaveBalance[];
    fromDateDp: any;
    toDateDp: any;
    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private leaveApplicationService: LeaveApplicationService,
        private leaveRuleService: LeaveRuleService,
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
          .subscribe((res: HttpResponse<LeaveBalance[]>) => {
              this.leaveBalance = res.body;
            console.log(JSON.stringify(this.leaveBalance));
            let i = 0;
              for (const item of this.leavetypes) {
                  if (this.leaveBalance.length > i) {
                      for (const b of this.leaveBalance) {
                          this.l = b.leaveType;
                          if (item.code === this.l.code) {
                              item.code = item.code + '(' + b.noOfLeave + ')';
                          }
                      }
                  } else {
                      item.code = item.code + '(0)';
                  }
                  i++;
              }
        }, (res: HttpErrorResponse) => this.onError(res.message));
          this.leaveTypeService.query()
            .subscribe((res: HttpResponse<LeaveType[]>) => {
                this.leavetypes = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }
    loadLeaveRule() {
        this.leaveRuleService.findByLeaveType(this.leaveApplication.leaveType.id)
            .subscribe((leaveRuleResponse: HttpResponse<LeaveRule>) => {
                this.leaveRule = leaveRuleResponse.body;
                if (this.leaveRule.id === undefined) {
                    console.log('ok');
                    this.leaveRule = undefined;
                } else {
                    this.checkBox = [];
                    this.textBox = [];
                    for (const item of this.leaveRule.leaveTypes) {
                        this.checkBox.push('c_' + item.id);
                        this.checkBox.push('t_' + item.id);
                    }
                    console.log('length' + this.checkBox.length);
                }
            });
        }
    clear() {
        this.activeModal.dismiss('cancel');
    }

    dayDiff() {
        const date1 = new Date(this.fromDate1);
        const date2 = new Date(this.toDate1);
        const diff = date2.getTime() - date1.getTime();
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        this.leaveApplication.noofday = diffDays + 1;
        console.log(this.leaveApplication.noofday);
    }

    fromDate(event) {
    this.fromDate1 = event.target.value;
      console.log(this.fromDate1);
      if (this.toDate1 !== undefined && this.fromDate1 !== '') {
        this.dayDiff();
      }
    }

    toDate(event?: any) {
      this.toDate1 = event.target.value;
      console.log( this.toDate1);
     if (this.fromDate1 !== undefined && this.toDate1 !== '') {
        this.dayDiff();
      }
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
