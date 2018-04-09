import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveApplicationHistory } from './leave-application-history.model';
import { LeaveApplicationHistoryPopupService } from './leave-application-history-popup.service';
import { LeaveApplicationHistoryService } from './leave-application-history.service';

@Component({
    selector: 'jhi-leave-application-history-delete-dialog',
    templateUrl: './leave-application-history-delete-dialog.component.html'
})
export class LeaveApplicationHistoryDeleteDialogComponent {

    leaveApplicationHistory: LeaveApplicationHistory;

    constructor(
        private leaveApplicationHistoryService: LeaveApplicationHistoryService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.leaveApplicationHistoryService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'leaveApplicationHistoryListModification',
                content: 'Deleted an leaveApplicationHistory'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-leave-application-history-delete-popup',
    template: ''
})
export class LeaveApplicationHistoryDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveApplicationHistoryPopupService: LeaveApplicationHistoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.leaveApplicationHistoryPopupService
                .open(LeaveApplicationHistoryDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
