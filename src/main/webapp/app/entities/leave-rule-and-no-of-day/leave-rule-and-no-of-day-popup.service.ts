import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { LeaveRuleAndNoOfDay } from './leave-rule-and-no-of-day.model';
import { LeaveRuleAndNoOfDayService } from './leave-rule-and-no-of-day.service';

@Injectable()
export class LeaveRuleAndNoOfDayPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private leaveRuleAndNoOfDayService: LeaveRuleAndNoOfDayService

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
                this.leaveRuleAndNoOfDayService.find(id)
                    .subscribe((leaveRuleAndNoOfDayResponse: HttpResponse<LeaveRuleAndNoOfDay>) => {
                        const leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay = leaveRuleAndNoOfDayResponse.body;
                        this.ngbModalRef = this.leaveRuleAndNoOfDayModalRef(component, leaveRuleAndNoOfDay);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.leaveRuleAndNoOfDayModalRef(component, new LeaveRuleAndNoOfDay());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    leaveRuleAndNoOfDayModalRef(component: Component, leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.leaveRuleAndNoOfDay = leaveRuleAndNoOfDay;
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
