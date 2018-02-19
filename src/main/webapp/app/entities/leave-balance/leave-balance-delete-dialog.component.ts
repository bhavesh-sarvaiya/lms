import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveBalance } from './leave-balance.model';
import { LeaveBalancePopupService } from './leave-balance-popup.service';
import { LeaveBalanceService } from './leave-balance.service';

@Component({
    selector: 'jhi-leave-balance-delete-dialog',
    templateUrl: './leave-balance-delete-dialog.component.html'
})
export class LeaveBalanceDeleteDialogComponent {

    leaveBalance: LeaveBalance;

    constructor(
        private leaveBalanceService: LeaveBalanceService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.leaveBalanceService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'leaveBalanceListModification',
                content: 'Deleted an leaveBalance'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-leave-balance-delete-popup',
    template: ''
})
export class LeaveBalanceDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveBalancePopupService: LeaveBalancePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.leaveBalancePopupService
                .open(LeaveBalanceDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
