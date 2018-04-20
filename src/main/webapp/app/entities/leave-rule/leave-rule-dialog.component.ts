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
import { LeaveRuleAndNoOfDay, LeaveRuleAndNoOfDayService, EmpType1} from '../leave-rule-and-no-of-day';
import { LeaveRuleAndMaxMinLeave, LeaveRuleAndMaxMinLeaveService, EmpType2 } from '../leave-rule-and-max-min-leave';
import { LeaveRuleAndValidationTypeService, LeaveRuleAndValidationType, EmpType3 } from '../leave-rule-and-validation-type';

@Component({
    selector: 'jhi-leave-rule-dialog',
    templateUrl: './leave-rule-dialog.component.html'
})
export class LeaveRuleDialogComponent implements OnInit {

    leaveRule: LeaveRule;
    leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay;
    leaveRuleAndMaxMinLeave: LeaveRuleAndMaxMinLeave;
    leaveRuleAndValidationType: LeaveRuleAndValidationType;
    noOfDay: number;
    isSaving: boolean;

    leavetypes: LeaveType[];

    leaves: LeaveType[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private leaveRuleService: LeaveRuleService,
        private leaveTypeService: LeaveTypeService,
        private leaveRuleAndMaxMinLeaveService: LeaveRuleAndMaxMinLeaveService,
        private leaveRuleAndValidationTypeService: LeaveRuleAndValidationTypeService,
        private leaveRuleAndNoOfDayService: LeaveRuleAndNoOfDayService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        if (this.leaveRuleAndNoOfDay === undefined) {
            this.leaveRuleAndNoOfDay = new LeaveRuleAndNoOfDay();
        }
        if (this.leaveRuleAndMaxMinLeave === undefined) {
            this.leaveRuleAndMaxMinLeave = new LeaveRuleAndMaxMinLeave();
        }
        if (this.leaveRuleAndValidationType === undefined) {
            this.leaveRuleAndValidationType = new LeaveRuleAndValidationType();
        }
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

    private onSaveSuccess(result: LeaveRule) {
        this.eventManager.broadcast({ name: 'leaveRuleListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
        if (this.leaveRuleAndNoOfDay.employeeType + '' !== 'ALL') {
          this.leaveRuleAndNoOfDay.employeeType = EmpType1['EDUCATIONAL WITH VACATIONER'];
          this.saveLeaveRuleAndNoOfDay();
          this.leaveRuleAndNoOfDay.noOfDay = this.leaveRuleAndNoOfDay.noOfDay2;
          this.leaveRuleAndNoOfDay.employeeType = EmpType1['EDUCATIONAL WITH NON VACATIONER'];
        }
        this.saveLeaveRuleAndNoOfDay();
        if (this.leaveRuleAndMaxMinLeave.employeeType + '' !== 'ALL') {
            this.leaveRuleAndMaxMinLeave.employeeType = EmpType2['MANAGEMENT'];
            this.saveLeaveRuleAndMaxMinLeave();
            this.leaveRuleAndMaxMinLeave.employeeType = EmpType2['EDUCATIONAL'];
            this.leaveRuleAndMaxMinLeave.maxLeaveLimit = this.leaveRuleAndMaxMinLeave.maxLeaveLimit1;
            this.leaveRuleAndMaxMinLeave.minLeaveLimit = this.leaveRuleAndMaxMinLeave.minLeaveLimit1;
          }
          this.saveLeaveRuleAndMaxMinLeave();
          this.leaveRuleAndValidationType.employeeType = EmpType3['EDUCATIONAL'];
          this.saveleaveRuleAndValidationType();
          this.leaveRuleAndValidationType.employeeType = EmpType3['MANAGEMENT'];
          this.leaveRuleAndValidationType.validationType = this.leaveRuleAndValidationType.validationType1;
          this.leaveRuleAndValidationType.level1 = this.leaveRuleAndValidationType.level11;
          this.leaveRuleAndValidationType.level2 = this.leaveRuleAndValidationType.level21;
          this.leaveRuleAndValidationType.level3 = this.leaveRuleAndValidationType.level31;
          this.leaveRuleAndValidationType.level4 = this.leaveRuleAndValidationType.level41;
          this.leaveRuleAndValidationType.level5 = this.leaveRuleAndValidationType.level51;
          this.leaveRuleAndValidationType.level6 = this.leaveRuleAndValidationType.level61;
          this.saveleaveRuleAndValidationType();
    }
    saveleaveRuleAndValidationType() {
        this.isSaving = true;
        if (this.leaveRuleAndValidationType.id !== undefined) {
            this.subscribeToSaveResponse3(
                this.leaveRuleAndValidationTypeService.update(this.leaveRuleAndValidationType));
        } else {
            this.leaveRuleAndValidationType.leaveRule = this.leaveRule;
            this.subscribeToSaveResponse3(
                this.leaveRuleAndValidationTypeService.create(this.leaveRuleAndValidationType));
        }
    }
    saveLeaveRuleAndNoOfDay() {
        this.isSaving = true;
        if (this.leaveRuleAndNoOfDay.id !== undefined) {
            this.subscribeToSaveResponse1(
                this.leaveRuleAndNoOfDayService.update(this.leaveRuleAndNoOfDay));
        } else {
            this.leaveRuleAndNoOfDay.leaveRule = this.leaveRule;
            this.subscribeToSaveResponse1(
                this.leaveRuleAndNoOfDayService.create(this.leaveRuleAndNoOfDay));
        }
    }
    saveLeaveRuleAndMaxMinLeave() {
        this.isSaving = true;
        if (this.leaveRuleAndMaxMinLeave.id !== undefined) {
            this.subscribeToSaveResponse2(
                this.leaveRuleAndMaxMinLeaveService.update(this.leaveRuleAndMaxMinLeave));
        } else {
            this.leaveRuleAndMaxMinLeave.leaveRule = this.leaveRule;
            this.subscribeToSaveResponse2(
                this.leaveRuleAndMaxMinLeaveService.create(this.leaveRuleAndMaxMinLeave));
        }
    }
    private subscribeToSaveResponse1(result: Observable<HttpResponse<LeaveRuleAndNoOfDay>>) {
        result.subscribe((res: HttpResponse<LeaveRuleAndNoOfDay>) =>
            this.onSaveSuccess1(res.body), (res: HttpErrorResponse) => this.onSaveError1());
    }

    private onSaveSuccess1(result: LeaveRuleAndNoOfDay) {
        this.eventManager.broadcast({ name: 'leaveRuleAndNoOfDayListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError1() {
        this.isSaving = false;
    }
    private subscribeToSaveResponse2(result: Observable<HttpResponse<LeaveRuleAndMaxMinLeave>>) {
        result.subscribe((res: HttpResponse<LeaveRuleAndMaxMinLeave>) =>
            this.onSaveSuccess2(res.body), (res: HttpErrorResponse) => this.onSaveError2());
    }

    private onSaveSuccess2(result: LeaveRuleAndMaxMinLeave) {
        this.eventManager.broadcast({ name: 'leaveRuleAndMaxMinLeaveListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError2() {
        this.isSaving = false;
    }
    private subscribeToSaveResponse3(result: Observable<HttpResponse<LeaveRuleAndValidationType>>) {
        result.subscribe((res: HttpResponse<LeaveRuleAndValidationType>) =>
            this.onSaveSuccess3(res.body), (res: HttpErrorResponse) => this.onSaveError3());
    }

    private onSaveSuccess3(result: LeaveRuleAndValidationType) {
        this.eventManager.broadcast({ name: 'leaveRuleAndValidationTypeListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError3() {
        this.isSaving = false;
    }
    private subscribeToSaveResponse(result: Observable<HttpResponse<LeaveRule>>) {
        result.subscribe((res: HttpResponse<LeaveRule>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
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
