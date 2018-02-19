import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveAllocation } from './leave-allocation.model';
import { LeaveAllocationPopupService } from './leave-allocation-popup.service';
import { LeaveAllocationService } from './leave-allocation.service';

@Component({
    selector: 'jhi-leave-allocation-delete-dialog',
    templateUrl: './leave-allocation-delete-dialog.component.html'
})
export class LeaveAllocationDeleteDialogComponent {

    leaveAllocation: LeaveAllocation;

    constructor(
        private leaveAllocationService: LeaveAllocationService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.leaveAllocationService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'leaveAllocationListModification',
                content: 'Deleted an leaveAllocation'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-leave-allocation-delete-popup',
    template: ''
})
export class LeaveAllocationDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveAllocationPopupService: LeaveAllocationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.leaveAllocationPopupService
                .open(LeaveAllocationDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
