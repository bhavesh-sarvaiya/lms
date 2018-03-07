import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveApplication } from './leave-application.model';
import { LeaveApplicationService } from './leave-application.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'jhi-leave-application-detail',
    templateUrl: './leave-application-detail.component.html'
})
export class LeaveApplicationDetailComponent implements OnInit, OnDestroy {

    fromDate: any;
    toDate: any;
    leaveApplication: LeaveApplication;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private leaveApplicationService: LeaveApplicationService,
        private route: ActivatedRoute
    ) {
    }

    save(status) {
        let d: Date = new Date(this.leaveApplication.toDate);
        console.log('id :' + this.leaveApplication.id);
        this.leaveApplication.toDate = { 'day': d.getDate() , 'month': d.getMonth() + 1, 'year': d.getFullYear() } ;
        d = new Date(this.leaveApplication.fromDate);
        this.leaveApplication.fromDate = { 'day': d.getDate() , 'month': d.getMonth() + 1, 'year': d.getFullYear() } ;
        console.log(status);
       if (this.leaveApplication.id !== undefined) {
            console.log(this.leaveApplication);
            this.leaveApplication.status = status;
             this.subscribeToSaveResponse(
            this.leaveApplicationService.update(this.leaveApplication));
        }
    }
    private subscribeToSaveResponse(result: Observable<HttpResponse<LeaveApplication>>) {
         result.subscribe((res: HttpResponse<LeaveApplication>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: LeaveApplication) {
        this.eventManager.broadcast({ name: 'leaveApplicationListModification', content: 'OK'});
       // this.isSaving = false;
      //  this.activeModal.dismiss(result);
    }

    private onSaveError() {
       // this.isSaving = false;
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
                this.fromDate = this.leaveApplication.fromDate;
                this.toDate = this.leaveApplication.toDate;
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
