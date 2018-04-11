import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveAllocation } from './leave-allocation.model';
import { LeaveAllocationPopupService } from './leave-allocation-popup.service';
import { LeaveAllocationService } from './leave-allocation.service';
import { LeaveType, LeaveTypeService } from '../leave-type';
import { Employee, EmployeeService } from '../employee';

@Component({
    selector: 'jhi-leave-allocation-dialog',
    templateUrl: './leave-allocation-dialog.component.html',
    styleUrls: ['./leave-allocation-dialog.component.html']
})
export class LeaveAllocationDialogComponent implements OnInit {

    leaveAllocation: LeaveAllocation;
    isSaving: boolean;

    leavetypes: LeaveType[];
    employees: Employee[];
    allocationDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private leaveAllocationService: LeaveAllocationService,
        private leaveTypeService: LeaveTypeService,
        private employeeService: EmployeeService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.loadEmployee();
        this.leaveTypeService.query().subscribe((res: HttpResponse<LeaveType[]>) => { this.leavetypes = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }
    loadEmployee() {
        this.employeeService.query()
            .subscribe((res: HttpResponse<Employee[]>) => { this.employees = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }
    clear() {
        this.activeModal.dismiss('cancel');
    }
    save() {
        this.isSaving = true;
        if (this.leaveAllocation.id !== undefined) {
            this.subscribeToSaveResponse(
                this.leaveAllocationService.update(this.leaveAllocation));
        } else {
            let temp = '';
            if ( this.leaveAllocation.employee !== undefined) {
                for (const entry of this.leaveAllocation.employee) {
                temp = temp + entry + ',';
                }
            }
            this.leaveAllocation.employee = temp.substring(0, temp.length - 1);
            this.subscribeToSaveResponse(
                this.leaveAllocationService.create(this.leaveAllocation));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LeaveAllocation>>) {
        result.subscribe((res: HttpResponse<LeaveAllocation>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LeaveAllocation) {
        this.eventManager.broadcast({ name: 'leaveAllocationListModification', content: 'OK'});
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
    selector: 'jhi-leave-allocation-popup',
    template: ''
})
export class LeaveAllocationPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveAllocationPopupService: LeaveAllocationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.leaveAllocationPopupService
                    .open(LeaveAllocationDialogComponent as Component, params['id']);
            } else {
                this.leaveAllocationPopupService
                    .open(LeaveAllocationDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
