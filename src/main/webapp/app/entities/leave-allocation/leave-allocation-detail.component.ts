import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveAllocation } from './leave-allocation.model';
import { LeaveAllocationService } from './leave-allocation.service';

@Component({
    selector: 'jhi-leave-allocation-detail',
    templateUrl: './leave-allocation-detail.component.html'
})
export class LeaveAllocationDetailComponent implements OnInit, OnDestroy {

    leaveAllocation: LeaveAllocation;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private leaveAllocationService: LeaveAllocationService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLeaveAllocations();
    }

    load(id) {
        this.leaveAllocationService.find(id)
            .subscribe((leaveAllocationResponse: HttpResponse<LeaveAllocation>) => {
                this.leaveAllocation = leaveAllocationResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLeaveAllocations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'leaveAllocationListModification',
            (response) => this.load(this.leaveAllocation.id)
        );
    }
}
