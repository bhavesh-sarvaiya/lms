import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveApplicationHistory } from './leave-application-history.model';
import { LeaveApplicationHistoryPopupService } from './leave-application-history-popup.service';
import { LeaveApplicationHistoryService } from './leave-application-history.service';
import { Employee, EmployeeService } from '../employee';
import { LeaveType, LeaveTypeService } from '../leave-type';

@Component({
    selector: 'jhi-leave-application-history-dialog',
    templateUrl: './leave-application-history-dialog.component.html'
})
export class LeaveApplicationHistoryDialogComponent implements OnInit {

    leaveApplicationHistory: LeaveApplicationHistory;
    isSaving: boolean;

    employees: Employee[];

    leavetypes: LeaveType[];
    actionDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private leaveApplicationHistoryService: LeaveApplicationHistoryService,
        private employeeService: EmployeeService,
        private leaveTypeService: LeaveTypeService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.employeeService.query()
            .subscribe((res: HttpResponse<Employee[]>) => { this.employees = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.leaveTypeService.query()
            .subscribe((res: HttpResponse<LeaveType[]>) => { this.leavetypes = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.leaveApplicationHistory.id !== undefined) {
            this.subscribeToSaveResponse(
                this.leaveApplicationHistoryService.update(this.leaveApplicationHistory));
        } else {
            this.subscribeToSaveResponse(
                this.leaveApplicationHistoryService.create(this.leaveApplicationHistory));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LeaveApplicationHistory>>) {
        result.subscribe((res: HttpResponse<LeaveApplicationHistory>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LeaveApplicationHistory) {
        this.eventManager.broadcast({ name: 'leaveApplicationHistoryListModification', content: 'OK'});
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
    selector: 'jhi-leave-application-history-popup',
    template: ''
})
export class LeaveApplicationHistoryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveApplicationHistoryPopupService: LeaveApplicationHistoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.leaveApplicationHistoryPopupService
                    .open(LeaveApplicationHistoryDialogComponent as Component, params['id']);
            } else {
                this.leaveApplicationHistoryPopupService
                    .open(LeaveApplicationHistoryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
