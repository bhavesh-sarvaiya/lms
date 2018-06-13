import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LeaveApplication } from './leave-application.model';
import { LeaveApplicationService } from './leave-application.service';
import { Principal, User } from '../../shared';
import { Employee, EmployeeService, Post } from '../employee';
import * as $ from 'jquery';
import * as XLSX from 'xlsx';

@Component({
    selector: 'jhi-leave-application',
    templateUrl: './leave-application.component.html'
})

export class LeaveApplicationComponent implements OnInit, OnDestroy {
leaveApplications: LeaveApplication[];
    currentAccount: User;
    eventSubscriber: Subscription;
    employee: Employee;
    post: string;
    constructor(
        private leaveApplicationService: LeaveApplicationService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private employeeService: EmployeeService
    ) {
    }
    loadEmployee(id) {
        this.employeeService.loadEmployeeByUser(id)
            .subscribe((employeeResponse: HttpResponse<Employee>) => {
                this.employee = employeeResponse.body;
            });
    }
    loadAll(status?) {
        if (this.currentAccount.login === 'admin') {
            status = 'all';
        } else if (status === undefined) {
            status = 'APPLIED';
        }
        this.leaveApplicationService.query(status).subscribe(
            (res: HttpResponse<LeaveApplication[]>) => {
                this.leaveApplications = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    exportExcel() {
        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.leaveApplications);

        /* generat  e workbook and add the worksheet */
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1; //January is 0!
        const yyyy = today.getFullYear();
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'leaveApplication');
        const name = 'leaveApplication_' + new Date().toString().slice(4, 24).replace(/ /g, '_')  + '.xlsx';
        /* save to file */
        XLSX.writeFile(wb, name);
    }
    ngOnInit(status?) {
        $(document).ready(function(){
            $(".nav-tabs a").click(function(){
                $(this).tab('show');
            });
        });
            this.principal.identity().then((account) => {
                this.currentAccount = account;
                this.loadEmployee(this.currentAccount.id);
                this.loadAll(status);
            });
        this.registerChangeInLeaveApplications();
        // Select all tabs

    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LeaveApplication) {
        return item.id;
    }
    registerChangeInLeaveApplications() {
        console.log('inside register');
        this.eventSubscriber = this.eventManager.subscribe('leaveApplicationListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
/*
export enum post {
    'LDC',
    'UDC',
    'SECTIONOFFICER',
    'ASSISTANTREGISTER',
    'DEPUTYREGISTER',
    'FACULTY',
    'HOD',
    'REGISTRAR',
    'VICECHANCELLOR',
    'CHANCELLOR'
}*/
