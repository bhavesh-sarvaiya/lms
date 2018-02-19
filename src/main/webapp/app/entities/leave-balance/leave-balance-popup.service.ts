import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { LeaveBalance } from './leave-balance.model';
import { LeaveBalanceService } from './leave-balance.service';

@Injectable()
export class LeaveBalancePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private leaveBalanceService: LeaveBalanceService

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
                this.leaveBalanceService.find(id)
                    .subscribe((leaveBalanceResponse: HttpResponse<LeaveBalance>) => {
                        const leaveBalance: LeaveBalance = leaveBalanceResponse.body;
                        this.ngbModalRef = this.leaveBalanceModalRef(component, leaveBalance);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.leaveBalanceModalRef(component, new LeaveBalance());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    leaveBalanceModalRef(component: Component, leaveBalance: LeaveBalance): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.leaveBalance = leaveBalance;
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
