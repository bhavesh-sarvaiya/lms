import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { LeaveApplication } from './leave-application.model';
import { LeaveApplicationService } from './leave-application.service';

@Injectable()
export class LeaveApplicationPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private leaveApplicationService: LeaveApplicationService

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
                this.leaveApplicationService.find(id)
                    .subscribe((leaveApplicationResponse: HttpResponse<LeaveApplication>) => {
                        const leaveApplication: LeaveApplication = leaveApplicationResponse.body;
                        /*if (leaveApplication.fromDate) {
                            leaveApplication.fromDate = {
                                year: leaveApplication.fromDate.getFullYear(),
                                month: leaveApplication.fromDate.getMonth() + 1,
                                day: leaveApplication.fromDate.getDate()
                            };
                            console.log(leaveApplication.fromDate);
                        }
                        if (leaveApplication.toDate) {
                            leaveApplication.toDate = {
                                year: leaveApplication.toDate.getFullYear(),
                                month: leaveApplication.toDate.getMonth() + 1,
                                day: leaveApplication.toDate.getDate()
                            };
                        }*/
                        this.ngbModalRef = this.leaveApplicationModalRef(component, leaveApplication);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.leaveApplicationModalRef(component, new LeaveApplication());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    leaveApplicationModalRef(component: Component, leaveApplication: LeaveApplication): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.leaveApplication = leaveApplication;
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
