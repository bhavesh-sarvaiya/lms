import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { LeaveAllocation } from './leave-allocation.model';
import { LeaveAllocationService } from './leave-allocation.service';

@Injectable()
export class LeaveAllocationPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private leaveAllocationService: LeaveAllocationService

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
                this.leaveAllocationService.find(id)
                    .subscribe((leaveAllocationResponse: HttpResponse<LeaveAllocation>) => {
                        const leaveAllocation: LeaveAllocation = leaveAllocationResponse.body;
                        if (leaveAllocation.allocationDate) {
                            leaveAllocation.allocationDate = {
                                year: leaveAllocation.allocationDate.getFullYear(),
                                month: leaveAllocation.allocationDate.getMonth() + 1,
                                day: leaveAllocation.allocationDate.getDate()
                            };
                        }
                        this.ngbModalRef = this.leaveAllocationModalRef(component, leaveAllocation);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.leaveAllocationModalRef(component, new LeaveAllocation());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    leaveAllocationModalRef(component: Component, leaveAllocation: LeaveAllocation): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.leaveAllocation = leaveAllocation;
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
