import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveType } from './leave-type.model';
import { LeaveTypePopupService } from './leave-type-popup.service';
import { LeaveTypeService } from './leave-type.service';

@Component({
    selector: 'jhi-leave-type-delete-dialog',
    templateUrl: './leave-type-delete-dialog.component.html'
})
export class LeaveTypeDeleteDialogComponent {

    leaveType: LeaveType;

    constructor(
        private leaveTypeService: LeaveTypeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.leaveTypeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'leaveTypeListModification',
                content: 'Deleted an leaveType'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-leave-type-delete-popup',
    template: ''
})
export class LeaveTypeDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveTypePopupService: LeaveTypePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.leaveTypePopupService
                .open(LeaveTypeDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
