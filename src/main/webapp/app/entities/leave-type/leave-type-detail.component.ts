import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveType } from './leave-type.model';
import { LeaveTypeService } from './leave-type.service';

@Component({
    selector: 'jhi-leave-type-detail',
    templateUrl: './leave-type-detail.component.html'
})
export class LeaveTypeDetailComponent implements OnInit, OnDestroy {

    leaveType: LeaveType;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private leaveTypeService: LeaveTypeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLeaveTypes();
    }

    load(id) {
        this.leaveTypeService.find(id)
            .subscribe((leaveTypeResponse: HttpResponse<LeaveType>) => {
                this.leaveType = leaveTypeResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLeaveTypes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'leaveTypeListModification',
            (response) => this.load(this.leaveType.id)
        );
    }
}
