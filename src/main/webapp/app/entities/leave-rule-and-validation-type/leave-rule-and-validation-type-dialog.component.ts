import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveRuleAndValidationType } from './leave-rule-and-validation-type.model';
import { LeaveRuleAndValidationTypePopupService } from './leave-rule-and-validation-type-popup.service';
import { LeaveRuleAndValidationTypeService } from './leave-rule-and-validation-type.service';
import { LeaveRule, LeaveRuleService } from '../leave-rule';

@Component({
    selector: 'jhi-leave-rule-and-validation-type-dialog',
    templateUrl: './leave-rule-and-validation-type-dialog.component.html'
})
export class LeaveRuleAndValidationTypeDialogComponent implements OnInit {

    leaveRuleAndValidationType: LeaveRuleAndValidationType;
    isSaving: boolean;

    leaverules: LeaveRule[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private leaveRuleAndValidationTypeService: LeaveRuleAndValidationTypeService,
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
        if (this.leaveRuleAndValidationType.id !== undefined) {
            this.subscribeToSaveResponse(
                this.leaveRuleAndValidationTypeService.update(this.leaveRuleAndValidationType));
        } else {
            this.subscribeToSaveResponse(
                this.leaveRuleAndValidationTypeService.create(this.leaveRuleAndValidationType));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LeaveRuleAndValidationType>>) {
        result.subscribe((res: HttpResponse<LeaveRuleAndValidationType>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LeaveRuleAndValidationType) {
        this.eventManager.broadcast({ name: 'leaveRuleAndValidationTypeListModification', content: 'OK'});
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
    selector: 'jhi-leave-rule-and-validation-type-popup',
    template: ''
})
export class LeaveRuleAndValidationTypePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveRuleAndValidationTypePopupService: LeaveRuleAndValidationTypePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.leaveRuleAndValidationTypePopupService
                    .open(LeaveRuleAndValidationTypeDialogComponent as Component, params['id']);
            } else {
                this.leaveRuleAndValidationTypePopupService
                    .open(LeaveRuleAndValidationTypeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
