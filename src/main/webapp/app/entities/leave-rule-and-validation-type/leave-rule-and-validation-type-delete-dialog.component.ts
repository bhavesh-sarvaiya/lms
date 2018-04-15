import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveRuleAndValidationType } from './leave-rule-and-validation-type.model';
import { LeaveRuleAndValidationTypePopupService } from './leave-rule-and-validation-type-popup.service';
import { LeaveRuleAndValidationTypeService } from './leave-rule-and-validation-type.service';

@Component({
    selector: 'jhi-leave-rule-and-validation-type-delete-dialog',
    templateUrl: './leave-rule-and-validation-type-delete-dialog.component.html'
})
export class LeaveRuleAndValidationTypeDeleteDialogComponent {

    leaveRuleAndValidationType: LeaveRuleAndValidationType;

    constructor(
        private leaveRuleAndValidationTypeService: LeaveRuleAndValidationTypeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.leaveRuleAndValidationTypeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'leaveRuleAndValidationTypeListModification',
                content: 'Deleted an leaveRuleAndValidationType'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-leave-rule-and-validation-type-delete-popup',
    template: ''
})
export class LeaveRuleAndValidationTypeDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveRuleAndValidationTypePopupService: LeaveRuleAndValidationTypePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.leaveRuleAndValidationTypePopupService
                .open(LeaveRuleAndValidationTypeDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
