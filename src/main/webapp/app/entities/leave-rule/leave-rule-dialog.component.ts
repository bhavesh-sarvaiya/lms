import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveRule } from './leave-rule.model';
import { LeaveRulePopupService } from './leave-rule-popup.service';
import { LeaveRuleService } from './leave-rule.service';
import { LeaveType, LeaveTypeService } from '../leave-type';
import { LeaveRuleAndNoOfDay } from '../leave-rule-and-no-of-day';

@Component({
    selector: 'jhi-leave-rule-dialog',
    templateUrl: './leave-rule-dialog.component.html'
})
export class LeaveRuleDialogComponent implements OnInit {

    leaveRule: LeaveRule;
    leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay;
    isSaving: boolean;

    leavetypes: LeaveType[];

    leaves: LeaveType[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private leaveRuleService: LeaveRuleService,
        private leaveTypeService: LeaveTypeService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.leaveTypeService.query()
            .subscribe((res: HttpResponse<LeaveType[]>) => { this.leavetypes = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.leaveTypeService
            .query({filter: 'leaver-is-null'})
            .subscribe((res: HttpResponse<LeaveType[]>) => {
                if (!this.leaveRule.leave || !this.leaveRule.leave.id) {
                    this.leaves = res.body;
                } else {
                    this.leaveTypeService
                        .find(this.leaveRule.leave.id)
                        .subscribe((subRes: HttpResponse<LeaveType>) => {
                            this.leaves = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.leaveRule.id !== undefined) {
            this.subscribeToSaveResponse(
                this.leaveRuleService.update(this.leaveRule));
        } else {
            this.subscribeToSaveResponse(
                this.leaveRuleService.create(this.leaveRule));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<LeaveRule>>) {
        result.subscribe((res: HttpResponse<LeaveRule>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LeaveRule) {
        this.eventManager.broadcast({ name: 'leaveRuleListModification', content: 'OK'});
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

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-leave-rule-popup',
    template: ''
})
export class LeaveRulePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveRulePopupService: LeaveRulePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.leaveRulePopupService
                    .open(LeaveRuleDialogComponent as Component, params['id']);
            } else {
                this.leaveRulePopupService
                    .open(LeaveRuleDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
