import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveRule } from './leave-rule.model';
import { LeaveRuleService } from './leave-rule.service';

@Component({
    selector: 'jhi-leave-rule-detail',
    templateUrl: './leave-rule-detail.component.html'
})
export class LeaveRuleDetailComponent implements OnInit, OnDestroy {

    leaveRule: LeaveRule;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private leaveRuleService: LeaveRuleService,
        private route: ActivatedRoute
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
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLeaveRules() {
        this.eventSubscriber = this.eventManager.subscribe(
            'leaveRuleListModification',
            (response) => this.load(this.leaveRule.id)
        );
    }
}
