import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LeaveRuleAndNoOfDay } from './leave-rule-and-no-of-day.model';
import { LeaveRuleAndNoOfDayPopupService } from './leave-rule-and-no-of-day-popup.service';
import { LeaveRuleAndNoOfDayService } from './leave-rule-and-no-of-day.service';

@Component({
    selector: 'jhi-leave-rule-and-no-of-day-delete-dialog',
    templateUrl: './leave-rule-and-no-of-day-delete-dialog.component.html'
})
export class LeaveRuleAndNoOfDayDeleteDialogComponent {

    leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay;

    constructor(
        private leaveRuleAndNoOfDayService: LeaveRuleAndNoOfDayService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.leaveRuleAndNoOfDayService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'leaveRuleAndNoOfDayListModification',
                content: 'Deleted an leaveRuleAndNoOfDay'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-leave-rule-and-no-of-day-delete-popup',
    template: ''
})
export class LeaveRuleAndNoOfDayDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private leaveRuleAndNoOfDayPopupService: LeaveRuleAndNoOfDayPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.leaveRuleAndNoOfDayPopupService
                .open(LeaveRuleAndNoOfDayDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
