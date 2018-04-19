import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveRuleAndNoOfDay } from './leave-rule-and-no-of-day.model';
import { LeaveRuleAndNoOfDayPopupService } from './leave-rule-and-no-of-day-popup.service';
import { LeaveRuleAndNoOfDayService } from './leave-rule-and-no-of-day.service';
import { LeaveRule, LeaveRuleService } from '../leave-rule';

@Component({
    selector: 'jhi-leave-rule-and-no-of-day-dialog',
    templateUrl: './leave-rule-and-no-of-day-dialog.component.html'
})
export class LeaveRuleAndNoOfDayDialogComponent implements OnInit {

    leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay;
    isSaving: boolean;

    leaverules: LeaveRule[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private leaveRuleAndNoOfDayService: LeaveRuleAndNoOfDayService,
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
        if (this.leaveRuleAndNoOfDay.id !== undefined) {
            this.subscribeToSaveResponse(
                this.leaveRuleAndNoOfDayService.update(this.leaveRuleAndNoOfDay));
        } else {
            this.subscribeToSaveResponse(
                this.leaveRuleAndNoOfDayService.create(this.leaveRuleAndNoOfDay));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LeaveRuleAndNoOfDay>>) {
        result.subscribe((res: HttpResponse<LeaveRuleAndNoOfDay>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LeaveRuleAndNoOfDay) {
        this.eventManager.broadcast({ name: 'leaveRuleAndNoOfDayListModification', content: 'OK'});
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
    selector: 'jhi-leave-rule-and-no-of-day-popup',
    template: ''
})
export class LeaveRuleAndNoOfDayPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveRuleAndNoOfDayPopupService: LeaveRuleAndNoOfDayPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.leaveRuleAndNoOfDayPopupService
                    .open(LeaveRuleAndNoOfDayDialogComponent as Component, params['id']);
            } else {
                this.leaveRuleAndNoOfDayPopupService
                    .open(LeaveRuleAndNoOfDayDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
