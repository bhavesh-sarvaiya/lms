import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveType } from './leave-type.model';
import { LeaveTypeService } from './leave-type.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-leave-type',
    templateUrl: './leave-type.component.html'
})
export class LeaveTypeComponent implements OnInit, OnDestroy {
leaveTypes: LeaveType[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private leaveTypeService: LeaveTypeService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.leaveTypeService.query().subscribe(
            (res: HttpResponse<LeaveType[]>) => {
                this.leaveTypes = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInLeaveTypes();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LeaveType) {
        return item.id;
    }
    registerChangeInLeaveTypes() {
        this.eventSubscriber = this.eventManager.subscribe('leaveTypeListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
