import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveRuleAndNoOfDay } from './leave-rule-and-no-of-day.model';
import { LeaveRuleAndNoOfDayService } from './leave-rule-and-no-of-day.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-leave-rule-and-no-of-day',
    templateUrl: './leave-rule-and-no-of-day.component.html'
})
export class LeaveRuleAndNoOfDayComponent implements OnInit, OnDestroy {
leaveRuleAndNoOfDays: LeaveRuleAndNoOfDay[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private leaveRuleAndNoOfDayService: LeaveRuleAndNoOfDayService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.leaveRuleAndNoOfDayService.query().subscribe(
            (res: HttpResponse<LeaveRuleAndNoOfDay[]>) => {
                this.leaveRuleAndNoOfDays = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInLeaveRuleAndNoOfDays();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LeaveRuleAndNoOfDay) {
        return item.id;
    }
    registerChangeInLeaveRuleAndNoOfDays() {
        this.eventSubscriber = this.eventManager.subscribe('leaveRuleAndNoOfDayListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
