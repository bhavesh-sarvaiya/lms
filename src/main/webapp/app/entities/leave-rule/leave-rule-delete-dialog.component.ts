import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveRule } from './leave-rule.model';
import { LeaveRulePopupService } from './leave-rule-popup.service';
import { LeaveRuleService } from './leave-rule.service';

@Component({
    selector: 'jhi-leave-rule-delete-dialog',
    templateUrl: './leave-rule-delete-dialog.component.html'
})
export class LeaveRuleDeleteDialogComponent {

    leaveRule: LeaveRule;

    constructor(
        private leaveRuleService: LeaveRuleService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.leaveRuleService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'leaveRuleListModification',
                content: 'Deleted an leaveRule'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-leave-rule-delete-popup',
    template: ''
})
export class LeaveRuleDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveRulePopupService: LeaveRulePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.leaveRulePopupService
                .open(LeaveRuleDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
