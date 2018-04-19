import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveRuleAndValidationType } from './leave-rule-and-validation-type.model';
import { LeaveRuleAndValidationTypeService } from './leave-rule-and-validation-type.service';

@Component({
    selector: 'jhi-leave-rule-and-validation-type-detail',
    templateUrl: './leave-rule-and-validation-type-detail.component.html'
})
export class LeaveRuleAndValidationTypeDetailComponent implements OnInit, OnDestroy {

    leaveRuleAndValidationType: LeaveRuleAndValidationType;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private leaveRuleAndValidationTypeService: LeaveRuleAndValidationTypeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLeaveRuleAndValidationTypes();
    }

    load(id) {
        this.leaveRuleAndValidationTypeService.find(id)
            .subscribe((leaveRuleAndValidationTypeResponse: HttpResponse<LeaveRuleAndValidationType>) => {
                this.leaveRuleAndValidationType = leaveRuleAndValidationTypeResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLeaveRuleAndValidationTypes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'leaveRuleAndValidationTypeListModification',
            (response) => this.load(this.leaveRuleAndValidationType.id)
        );
    }
}
