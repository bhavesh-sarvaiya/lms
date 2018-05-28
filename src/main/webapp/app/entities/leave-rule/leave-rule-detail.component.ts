import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveRule } from './leave-rule.model';
import { LeaveRuleService } from './leave-rule.service';
import { LeaveRuleAndNoOfDay, LeaveRuleAndNoOfDayService, EmpType1 } from '../leave-rule-and-no-of-day';
import { LeaveRuleAndMaxMinLeave, LeaveRuleAndMaxMinLeaveService, EmpType2 } from '../leave-rule-and-max-min-leave';
import { LeaveRuleAndValidationType, LeaveRuleAndValidationTypeService } from '../leave-rule-and-validation-type';
import { LeaveType, LeaveTypeService } from '../leave-type';

@Component({
    selector: 'jhi-leave-rule-detail',
    templateUrl: './leave-rule-detail.component.html'
})
export class LeaveRuleDetailComponent implements OnInit, OnDestroy {

    leaveRule: LeaveRule;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay;
    leaveRuleAndNoOfDays: LeaveRuleAndNoOfDay[];
    leaveRuleAndMaxMinLeaves: LeaveRuleAndMaxMinLeave[];
    leaveRuleAndValidationTypes: LeaveRuleAndValidationType[];
    leaveRuleAndMaxMinLeave: LeaveRuleAndMaxMinLeave;
    leaveRuleAndValidationType: LeaveRuleAndValidationType;
    leavetypes: LeaveType[];
    leaves: LeaveType[];

    constructor(
        private eventManager: JhiEventManager,
        private leaveRuleService: LeaveRuleService,
        private jhiAlertService: JhiAlertService,
        private route: ActivatedRoute,
        private leaveTypeService: LeaveTypeService,
        private leaveRuleAndMaxMinLeaveService: LeaveRuleAndMaxMinLeaveService,
        private leaveRuleAndValidationTypeService: LeaveRuleAndValidationTypeService,
        private leaveRuleAndNoOfDayService: LeaveRuleAndNoOfDayService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLeaveRules();
    }

    load(id) {
        this.leaveRuleService.find(id)
            .subscribe((leaveRuleResponse: HttpResponse<LeaveRule>) => {
                this.leaveRule = leaveRuleResponse.body;
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
            });

            this.leaveTypeService.query()
            .subscribe((res: HttpResponse<LeaveType[]>) => { this.leavetypes = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    registerChangeInLeaveRules() {
        this.eventSubscriber = this.eventManager.subscribe(
            'leaveRuleListModification',
            (response) => this.load(this.leaveRule.id)
        );
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
}
