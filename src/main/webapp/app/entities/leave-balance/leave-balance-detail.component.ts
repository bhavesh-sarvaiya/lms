import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveBalance } from './leave-balance.model';
import { LeaveBalanceService } from './leave-balance.service';

@Component({
    selector: 'jhi-leave-balance-detail',
    templateUrl: './leave-balance-detail.component.html'
})
export class LeaveBalanceDetailComponent implements OnInit, OnDestroy {

    leaveBalance: LeaveBalance;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private leaveBalanceService: LeaveBalanceService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLeaveBalances();
    }

    load(id) {
        this.leaveBalanceService.find(id)
            .subscribe((leaveBalanceResponse: HttpResponse<LeaveBalance>) => {
                this.leaveBalance = leaveBalanceResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLeaveBalances() {
        this.eventSubscriber = this.eventManager.subscribe(
            'leaveBalanceListModification',
            (response) => this.load(this.leaveBalance.id)
        );
    }
}
