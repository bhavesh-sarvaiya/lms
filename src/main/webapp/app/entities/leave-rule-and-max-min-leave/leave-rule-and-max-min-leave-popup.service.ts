import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { LeaveRuleAndMaxMinLeave } from './leave-rule-and-max-min-leave.model';
import { LeaveRuleAndMaxMinLeaveService } from './leave-rule-and-max-min-leave.service';

@Injectable()
export class LeaveRuleAndMaxMinLeavePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private leaveRuleAndMaxMinLeaveService: LeaveRuleAndMaxMinLeaveService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.leaveRuleAndMaxMinLeaveService.find(id)
                    .subscribe((leaveRuleAndMaxMinLeaveResponse: HttpResponse<LeaveRuleAndMaxMinLeave>) => {
                        const leaveRuleAndMaxMinLeave: LeaveRuleAndMaxMinLeave = leaveRuleAndMaxMinLeaveResponse.body;
                        this.ngbModalRef = this.leaveRuleAndMaxMinLeaveModalRef(component, leaveRuleAndMaxMinLeave);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.leaveRuleAndMaxMinLeaveModalRef(component, new LeaveRuleAndMaxMinLeave());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    leaveRuleAndMaxMinLeaveModalRef(component: Component, leaveRuleAndMaxMinLeave: LeaveRuleAndMaxMinLeave): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.leaveRuleAndMaxMinLeave = leaveRuleAndMaxMinLeave;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
