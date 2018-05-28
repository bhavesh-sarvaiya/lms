import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveType } from './leave-type.model';
import { LeaveTypeService } from './leave-type.service';
import { Principal } from '../../shared';
import * as XLSX from 'xlsx';

@Component({
    selector: 'jhi-leave-type',
    templateUrl: './leave-type.component.html'
})
export class LeaveTypeComponent implements OnInit, OnDestroy {
leaveTypes: LeaveType[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private leaveTypeService: LeaveTypeService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.leaveTypeService.query().subscribe(
            (res: HttpResponse<LeaveType[]>) => {
                this.leaveTypes = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    exportExcel() {
        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.leaveTypes);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'LeaveType');
        const name = 'LeaveType_' + new Date().toString().slice(4, 24).replace(/ /g, '_')  + '.xlsx';
        /* save to file */
        XLSX.writeFile(wb, name);
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInLeaveTypes();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LeaveType) {
        return item.id;
    }
    registerChangeInLeaveTypes() {
        this.eventSubscriber = this.eventManager.subscribe('leaveTypeListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
