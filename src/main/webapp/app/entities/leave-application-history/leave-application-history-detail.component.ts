import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveApplicationHistory } from './leave-application-history.model';
import { LeaveApplicationHistoryService } from './leave-application-history.service';

@Component({
    selector: 'jhi-leave-application-history-detail',
    templateUrl: './leave-application-history-detail.component.html'
})
export class LeaveApplicationHistoryDetailComponent implements OnInit, OnDestroy {

    leaveApplicationHistory: LeaveApplicationHistory;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private leaveApplicationHistoryService: LeaveApplicationHistoryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLeaveApplicationHistories();
    }

    load(id) {
        this.leaveApplicationHistoryService.find(id)
            .subscribe((leaveApplicationHistoryResponse: HttpResponse<LeaveApplicationHistory>) => {
                this.leaveApplicationHistory = leaveApplicationHistoryResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLeaveApplicationHistories() {
        this.eventSubscriber = this.eventManager.subscribe(
            'leaveApplicationHistoryListModification',
            (response) => this.load(this.leaveApplicationHistory.id)
        );
    }
}
