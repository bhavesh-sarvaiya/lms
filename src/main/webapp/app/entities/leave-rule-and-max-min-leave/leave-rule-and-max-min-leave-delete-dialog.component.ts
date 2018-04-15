import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveRuleAndMaxMinLeave } from './leave-rule-and-max-min-leave.model';
import { LeaveRuleAndMaxMinLeavePopupService } from './leave-rule-and-max-min-leave-popup.service';
import { LeaveRuleAndMaxMinLeaveService } from './leave-rule-and-max-min-leave.service';

@Component({
    selector: 'jhi-leave-rule-and-max-min-leave-delete-dialog',
    templateUrl: './leave-rule-and-max-min-leave-delete-dialog.component.html'
})
export class LeaveRuleAndMaxMinLeaveDeleteDialogComponent {

    leaveRuleAndMaxMinLeave: LeaveRuleAndMaxMinLeave;

    constructor(
        private leaveRuleAndMaxMinLeaveService: LeaveRuleAndMaxMinLeaveService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.leaveRuleAndMaxMinLeaveService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'leaveRuleAndMaxMinLeaveListModification',
                content: 'Deleted an leaveRuleAndMaxMinLeave'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-leave-rule-and-max-min-leave-delete-popup',
    template: ''
})
export class LeaveRuleAndMaxMinLeaveDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveRuleAndMaxMinLeavePopupService: LeaveRuleAndMaxMinLeavePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.leaveRuleAndMaxMinLeavePopupService
                .open(LeaveRuleAndMaxMinLeaveDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
