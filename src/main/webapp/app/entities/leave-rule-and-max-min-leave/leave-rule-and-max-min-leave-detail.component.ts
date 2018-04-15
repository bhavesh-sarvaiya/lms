import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveRuleAndMaxMinLeave } from './leave-rule-and-max-min-leave.model';
import { LeaveRuleAndMaxMinLeaveService } from './leave-rule-and-max-min-leave.service';

@Component({
    selector: 'jhi-leave-rule-and-max-min-leave-detail',
    templateUrl: './leave-rule-and-max-min-leave-detail.component.html'
})
export class LeaveRuleAndMaxMinLeaveDetailComponent implements OnInit, OnDestroy {

    leaveRuleAndMaxMinLeave: LeaveRuleAndMaxMinLeave;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private leaveRuleAndMaxMinLeaveService: LeaveRuleAndMaxMinLeaveService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLeaveRuleAndMaxMinLeaves();
    }

    load(id) {
        this.leaveRuleAndMaxMinLeaveService.find(id)
            .subscribe((leaveRuleAndMaxMinLeaveResponse: HttpResponse<LeaveRuleAndMaxMinLeave>) => {
                this.leaveRuleAndMaxMinLeave = leaveRuleAndMaxMinLeaveResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLeaveRuleAndMaxMinLeaves() {
        this.eventSubscriber = this.eventManager.subscribe(
            'leaveRuleAndMaxMinLeaveListModification',
            (response) => this.load(this.leaveRuleAndMaxMinLeave.id)
        );
    }
}
