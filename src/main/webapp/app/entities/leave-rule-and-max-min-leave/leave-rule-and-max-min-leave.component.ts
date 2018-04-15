import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveRuleAndMaxMinLeave } from './leave-rule-and-max-min-leave.model';
import { LeaveRuleAndMaxMinLeaveService } from './leave-rule-and-max-min-leave.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-leave-rule-and-max-min-leave',
    templateUrl: './leave-rule-and-max-min-leave.component.html'
})
export class LeaveRuleAndMaxMinLeaveComponent implements OnInit, OnDestroy {
leaveRuleAndMaxMinLeaves: LeaveRuleAndMaxMinLeave[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private leaveRuleAndMaxMinLeaveService: LeaveRuleAndMaxMinLeaveService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.leaveRuleAndMaxMinLeaveService.query().subscribe(
            (res: HttpResponse<LeaveRuleAndMaxMinLeave[]>) => {
                this.leaveRuleAndMaxMinLeaves = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInLeaveRuleAndMaxMinLeaves();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LeaveRuleAndMaxMinLeave) {
        return item.id;
    }
    registerChangeInLeaveRuleAndMaxMinLeaves() {
        this.eventSubscriber = this.eventManager.subscribe('leaveRuleAndMaxMinLeaveListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
