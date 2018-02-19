import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveBalance } from './leave-balance.model';
import { LeaveBalancePopupService } from './leave-balance-popup.service';
import { LeaveBalanceService } from './leave-balance.service';
import { LeaveType, LeaveTypeService } from '../leave-type';
import { Employee, EmployeeService } from '../employee';

@Component({
    selector: 'jhi-leave-balance-dialog',
    templateUrl: './leave-balance-dialog.component.html'
})
export class LeaveBalanceDialogComponent implements OnInit {

    leaveBalance: LeaveBalance;
    isSaving: boolean;

    leavetypes: LeaveType[];

    employees: Employee[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private leaveBalanceService: LeaveBalanceService,
        private leaveTypeService: LeaveTypeService,
        private employeeService: EmployeeService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.leaveTypeService.query()
            .subscribe((res: HttpResponse<LeaveType[]>) => { this.leavetypes = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.employeeService.query()
            .subscribe((res: HttpResponse<Employee[]>) => { this.employees = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.leaveBalance.id !== undefined) {
            this.subscribeToSaveResponse(
                this.leaveBalanceService.update(this.leaveBalance));
        } else {
            this.subscribeToSaveResponse(
                this.leaveBalanceService.create(this.leaveBalance));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LeaveBalance>>) {
        result.subscribe((res: HttpResponse<LeaveBalance>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LeaveBalance) {
        this.eventManager.broadcast({ name: 'leaveBalanceListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackLeaveTypeById(index: number, item: LeaveType) {
        return item.id;
    }

    trackEmployeeById(index: number, item: Employee) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-leave-balance-popup',
    template: ''
})
export class LeaveBalancePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveBalancePopupService: LeaveBalancePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.leaveBalancePopupService
                    .open(LeaveBalanceDialogComponent as Component, params['id']);
            } else {
                this.leaveBalancePopupService
                    .open(LeaveBalanceDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
