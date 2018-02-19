import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveType } from './leave-type.model';
import { LeaveTypePopupService } from './leave-type-popup.service';
import { LeaveTypeService } from './leave-type.service';

@Component({
    selector: 'jhi-leave-type-dialog',
    templateUrl: './leave-type-dialog.component.html'
})
export class LeaveTypeDialogComponent implements OnInit {

    leaveType: LeaveType;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private leaveTypeService: LeaveTypeService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.leaveType.id !== undefined) {
            this.subscribeToSaveResponse(
                this.leaveTypeService.update(this.leaveType));
        } else {
            this.subscribeToSaveResponse(
                this.leaveTypeService.create(this.leaveType));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LeaveType>>) {
        result.subscribe((res: HttpResponse<LeaveType>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LeaveType) {
        this.eventManager.broadcast({ name: 'leaveTypeListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-leave-type-popup',
    template: ''
})
export class LeaveTypePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveTypePopupService: LeaveTypePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.leaveTypePopupService
                    .open(LeaveTypeDialogComponent as Component, params['id']);
            } else {
                this.leaveTypePopupService
                    .open(LeaveTypeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
