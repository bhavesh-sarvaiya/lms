import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { LeaveApplicationHistory } from './leave-application-history.model';
import { LeaveApplicationHistoryService } from './leave-application-history.service';

@Injectable()
export class LeaveApplicationHistoryPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private leaveApplicationHistoryService: LeaveApplicationHistoryService

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
                this.leaveApplicationHistoryService.find(id)
                    .subscribe((leaveApplicationHistoryResponse: HttpResponse<LeaveApplicationHistory>) => {
                        const leaveApplicationHistory: LeaveApplicationHistory = leaveApplicationHistoryResponse.body;
                        if (leaveApplicationHistory.actionDate) {
                            leaveApplicationHistory.actionDate = {
                                year: leaveApplicationHistory.actionDate.getFullYear(),
                                month: leaveApplicationHistory.actionDate.getMonth() + 1,
                                day: leaveApplicationHistory.actionDate.getDate()
                            };
                        }
                        this.ngbModalRef = this.leaveApplicationHistoryModalRef(component, leaveApplicationHistory);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.leaveApplicationHistoryModalRef(component, new LeaveApplicationHistory());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    leaveApplicationHistoryModalRef(component: Component, leaveApplicationHistory: LeaveApplicationHistory): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.leaveApplicationHistory = leaveApplicationHistory;
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
