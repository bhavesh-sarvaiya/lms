import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveApplication } from './leave-application.model';
import { LeaveApplicationPopupService } from './leave-application-popup.service';
import { LeaveApplicationService } from './leave-application.service';

@Component({
    selector: 'jhi-leave-application-delete-dialog',
    templateUrl: './leave-application-delete-dialog.component.html'
})
export class LeaveApplicationDeleteDialogComponent {

    leaveApplication: LeaveApplication;

    constructor(
        private leaveApplicationService: LeaveApplicationService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.leaveApplicationService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'leaveApplicationListModification',
                content: 'Deleted an leaveApplication'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-leave-application-delete-popup',
    template: ''
})
export class LeaveApplicationDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveApplicationPopupService: LeaveApplicationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.leaveApplicationPopupService
                .open(LeaveApplicationDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
