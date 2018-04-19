import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveRuleAndValidationType } from './leave-rule-and-validation-type.model';
import { LeaveRuleAndValidationTypeService } from './leave-rule-and-validation-type.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-leave-rule-and-validation-type',
    templateUrl: './leave-rule-and-validation-type.component.html'
})
export class LeaveRuleAndValidationTypeComponent implements OnInit, OnDestroy {
leaveRuleAndValidationTypes: LeaveRuleAndValidationType[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private leaveRuleAndValidationTypeService: LeaveRuleAndValidationTypeService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.leaveRuleAndValidationTypeService.query().subscribe(
            (res: HttpResponse<LeaveRuleAndValidationType[]>) => {
                this.leaveRuleAndValidationTypes = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInLeaveRuleAndValidationTypes();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LeaveRuleAndValidationType) {
        return item.id;
    }
    registerChangeInLeaveRuleAndValidationTypes() {
        this.eventSubscriber = this.eventManager.subscribe('leaveRuleAndValidationTypeListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
