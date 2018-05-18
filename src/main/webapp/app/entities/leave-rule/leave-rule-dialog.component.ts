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
    leaveRuleAndNoOfDays: LeaveRuleAndNoOfDay[];
    leaveRuleAndMaxMinLeaves: LeaveRuleAndMaxMinLeave[];
    leaveRuleAndValidationTypes: LeaveRuleAndValidationType[];
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

    loadAllLeaveRuleAndNoOfDays(id) {
        this.leaveRuleAndNoOfDayService.query(id).subscribe(
            (res: HttpResponse<LeaveRuleAndNoOfDay[]>) => {
                this.leaveRuleAndNoOfDays = res.body;
                this.leaveRuleAndNoOfDay = this.leaveRuleAndNoOfDays[0];
                if (this.leaveRuleAndNoOfDays.length > 1) {
                    this.leaveRuleAndNoOfDay.noOfDay2 =  this.leaveRuleAndNoOfDays[1].noOfDay;
                    this.leaveRuleAndNoOfDay.employeeType = EmpType1.EDUCATIONAL_WITH_VACATIONER_AND_EDUCATIONAL_WITH_NON_VACATIONER;
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    loadAllLeaveRuleAndMaxMinLeave(leaveRule) {
        this.leaveRuleAndMaxMinLeaveService.query(leaveRule).subscribe(
            (res: HttpResponse<LeaveRuleAndMaxMinLeave[]>) => {
                this.leaveRuleAndMaxMinLeaves = res.body;
                this.leaveRuleAndMaxMinLeave = this.leaveRuleAndMaxMinLeaves[0];
                if (this.leaveRuleAndMaxMinLeaves.length > 1) {
                    this.leaveRuleAndMaxMinLeave.maxLeaveLimit1 = this.leaveRuleAndMaxMinLeaves[1].maxLeaveLimit;
                    this.leaveRuleAndMaxMinLeave.minLeaveLimit1 = this.leaveRuleAndMaxMinLeaves[1].minLeaveLimit;
                    this.leaveRuleAndMaxMinLeave.employeeType = EmpType2.MANAGEMENT_AND_EDUCATIONAL;
                }
                this.leaveRuleAndMaxMinLeaves = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    loadAllLeaveRuleAndValidationType(leaveRule) {
        this.leaveRuleAndValidationTypeService.query(leaveRule).subscribe(
            (res: HttpResponse<LeaveRuleAndValidationType[]>) => {
                this.leaveRuleAndValidationTypes = res.body;
                this.leaveRuleAndValidationType = this.leaveRuleAndValidationTypes[0];
                this.leaveRuleAndValidationType.validationType1 = this.leaveRuleAndValidationTypes[1].validationType;
                this.leaveRuleAndValidationType.level11 = this.leaveRuleAndValidationTypes[1].level1;
                this.leaveRuleAndValidationType.level21 = this.leaveRuleAndValidationTypes[1].level2;
                this.leaveRuleAndValidationType.level31 = this.leaveRuleAndValidationTypes[1].level3;
                this.leaveRuleAndValidationType.level41 = this.leaveRuleAndValidationTypes[1].level4;
                this.leaveRuleAndValidationType.level51 = this.leaveRuleAndValidationTypes[1].level5;
                this.leaveRuleAndValidationType.level61 = this.leaveRuleAndValidationTypes[1].level6;

            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.isSaving = false;
        if (this.leaveRuleAndNoOfDay === undefined) {
            this.leaveRuleAndNoOfDay = new LeaveRuleAndNoOfDay();
            if (this.leaveRule.id !== undefined) {
                this.loadAllLeaveRuleAndNoOfDays(this.leaveRule);
            }
        }
        if (this.leaveRuleAndMaxMinLeave === undefined) {
            this.leaveRuleAndMaxMinLeave = new LeaveRuleAndMaxMinLeave();
            if (this.leaveRule.id !== undefined) {
            this.loadAllLeaveRuleAndMaxMinLeave(this.leaveRule);
            }
        }
        if (this.leaveRuleAndValidationType === undefined) {
            this.leaveRuleAndValidationType = new LeaveRuleAndValidationType();
            if (this.leaveRule.id !== undefined) {
                this.loadAllLeaveRuleAndValidationType(this.leaveRule);
            }
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
        if (this.leaveRuleAndNoOfDay.employeeType + '' !== 'ALL') {
          this.leaveRuleAndNoOfDay.employeeType = EmpType1['EDUCATIONAL_WITH_VACATIONER'];
          this.saveLeaveRuleAndNoOfDay();
          this.leaveRuleAndNoOfDay.noOfDay = this.leaveRuleAndNoOfDay.noOfDay2;
          this.leaveRuleAndNoOfDay.employeeType = EmpType1['EDUCATIONAL_WITH_NON_VACATIONER'];
        }
        this.saveLeaveRuleAndNoOfDay();
        if (this.leaveRuleAndMaxMinLeave.employeeType + '' !== 'ALL') {
            this.leaveRuleAndMaxMinLeave.employeeType = EmpType2['MANAGEMENT'];
            this.saveLeaveRuleAndMaxMinLeave();
            this.leaveRuleAndMaxMinLeave.employeeType = EmpType2['EDUCATIONAL'];
            if (this.leaveRuleAndMaxMinLeaves && this.leaveRuleAndMaxMinLeaves.length > 1) {
                this.leaveRuleAndMaxMinLeave.id = this.leaveRuleAndMaxMinLeaves[1].id;
            } else {
                this.leaveRuleAndMaxMinLeave.id = undefined;
            }
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
          this.isSaving = false;
          this.activeModal.dismiss(result);
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
