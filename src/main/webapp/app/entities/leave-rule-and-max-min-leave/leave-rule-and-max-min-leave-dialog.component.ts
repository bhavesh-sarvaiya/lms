import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveRuleAndMaxMinLeave } from './leave-rule-and-max-min-leave.model';
import { LeaveRuleAndMaxMinLeavePopupService } from './leave-rule-and-max-min-leave-popup.service';
import { LeaveRuleAndMaxMinLeaveService } from './leave-rule-and-max-min-leave.service';
import { LeaveRule, LeaveRuleService } from '../leave-rule';

@Component({
    selector: 'jhi-leave-rule-and-max-min-leave-dialog',
    templateUrl: './leave-rule-and-max-min-leave-dialog.component.html'
})
export class LeaveRuleAndMaxMinLeaveDialogComponent implements OnInit {

    leaveRuleAndMaxMinLeave: LeaveRuleAndMaxMinLeave;
    isSaving: boolean;

    leaverules: LeaveRule[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private leaveRuleAndMaxMinLeaveService: LeaveRuleAndMaxMinLeaveService,
        private leaveRuleService: LeaveRuleService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.leaveRuleService.query()
            .subscribe((res: HttpResponse<LeaveRule[]>) => { this.leaverules = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.leaveRuleAndMaxMinLeave.id !== undefined) {
            this.subscribeToSaveResponse(
                this.leaveRuleAndMaxMinLeaveService.update(this.leaveRuleAndMaxMinLeave));
        } else {
            this.subscribeToSaveResponse(
                this.leaveRuleAndMaxMinLeaveService.create(this.leaveRuleAndMaxMinLeave));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LeaveRuleAndMaxMinLeave>>) {
        result.subscribe((res: HttpResponse<LeaveRuleAndMaxMinLeave>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LeaveRuleAndMaxMinLeave) {
        this.eventManager.broadcast({ name: 'leaveRuleAndMaxMinLeaveListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackLeaveRuleById(index: number, item: LeaveRule) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-leave-rule-and-max-min-leave-popup',
    template: ''
})
export class LeaveRuleAndMaxMinLeavePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveRuleAndMaxMinLeavePopupService: LeaveRuleAndMaxMinLeavePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.leaveRuleAndMaxMinLeavePopupService
                    .open(LeaveRuleAndMaxMinLeaveDialogComponent as Component, params['id']);
            } else {
                this.leaveRuleAndMaxMinLeavePopupService
                    .open(LeaveRuleAndMaxMinLeaveDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
