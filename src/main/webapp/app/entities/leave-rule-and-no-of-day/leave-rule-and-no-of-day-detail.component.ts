import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveRuleAndNoOfDay } from './leave-rule-and-no-of-day.model';
import { LeaveRuleAndNoOfDayService } from './leave-rule-and-no-of-day.service';

@Component({
    selector: 'jhi-leave-rule-and-no-of-day-detail',
    templateUrl: './leave-rule-and-no-of-day-detail.component.html'
})
export class LeaveRuleAndNoOfDayDetailComponent implements OnInit, OnDestroy {

    leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private leaveRuleAndNoOfDayService: LeaveRuleAndNoOfDayService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLeaveRuleAndNoOfDays();
    }

    load(id) {
        this.leaveRuleAndNoOfDayService.find(id)
            .subscribe((leaveRuleAndNoOfDayResponse: HttpResponse<LeaveRuleAndNoOfDay>) => {
                this.leaveRuleAndNoOfDay = leaveRuleAndNoOfDayResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLeaveRuleAndNoOfDays() {
        this.eventSubscriber = this.eventManager.subscribe(
            'leaveRuleAndNoOfDayListModification',
            (response) => this.load(this.leaveRuleAndNoOfDay.id)
        );
    }
}
