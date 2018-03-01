import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveApplication } from './leave-application.model';
import { LeaveApplicationService } from './leave-application.service';

@Component({
    selector: 'jhi-leave-application-detail',
    templateUrl: './leave-application-detail.component.html'
})
export class LeaveApplicationDetailComponent implements OnInit, OnDestroy {

    leaveApplication: LeaveApplication;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private leaveApplicationService: LeaveApplicationService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLeaveApplications();
    }

    load(id) {
        this.leaveApplicationService.find(id)
            .subscribe((leaveApplicationResponse: HttpResponse<LeaveApplication>) => {
                this.leaveApplication = leaveApplicationResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLeaveApplications() {
        this.eventSubscriber = this.eventManager.subscribe(
            'leaveApplicationListModification',
            (response) => this.load(this.leaveApplication.id)
        );
    }
}
