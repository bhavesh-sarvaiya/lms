import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { LeaveRuleAndValidationType } from './leave-rule-and-validation-type.model';
import { LeaveRuleAndValidationTypeService } from './leave-rule-and-validation-type.service';

@Injectable()
export class LeaveRuleAndValidationTypePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private leaveRuleAndValidationTypeService: LeaveRuleAndValidationTypeService

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
                this.leaveRuleAndValidationTypeService.find(id)
                    .subscribe((leaveRuleAndValidationTypeResponse: HttpResponse<LeaveRuleAndValidationType>) => {
                        const leaveRuleAndValidationType: LeaveRuleAndValidationType = leaveRuleAndValidationTypeResponse.body;
                        this.ngbModalRef = this.leaveRuleAndValidationTypeModalRef(component, leaveRuleAndValidationType);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.leaveRuleAndValidationTypeModalRef(component, new LeaveRuleAndValidationType());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    leaveRuleAndValidationTypeModalRef(component: Component, leaveRuleAndValidationType: LeaveRuleAndValidationType): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.leaveRuleAndValidationType = leaveRuleAndValidationType;
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
