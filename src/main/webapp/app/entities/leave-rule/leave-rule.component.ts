import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveRule } from './leave-rule.model';
import { LeaveRuleService } from './leave-rule.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-leave-rule',
    templateUrl: './leave-rule.component.html'
})
export class LeaveRuleComponent implements OnInit, OnDestroy {
leaveRules: LeaveRule[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private leaveRuleService: LeaveRuleService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.leaveRuleService.query().subscribe(
            (res: HttpResponse<LeaveRule[]>) => {
                this.leaveRules = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInLeaveRules();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LeaveRule) {
        return item.id;
    }
    registerChangeInLeaveRules() {
        this.eventSubscriber = this.eventManager.subscribe('leaveRuleListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
