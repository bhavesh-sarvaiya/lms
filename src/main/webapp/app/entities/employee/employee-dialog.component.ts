import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Employee } from './employee.model';
import { EmployeePopupService } from './employee-popup.service';
import { EmployeeService } from './employee.service';
import { Department, DepartmentService } from '../department';
import { User, UserService } from '../../shared';

@Component({
    selector: 'jhi-employee-dialog',
    templateUrl: './employee-dialog.component.html'
})
export class EmployeeDialogComponent implements OnInit {

    employee: Employee;
    isSaving: boolean;

    departments: Department[];

    users: User[];
    dobDp: any;
    joinDateDp: any;
    retiredDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.departmentService.query()
            .subscribe((res: HttpResponse<Department[]>) => { this.departments = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    if (this.employee.user === undefined) {
        this.employee.user = new User();
    }
        }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.employee.id !== undefined) {
            this.subscribeToSaveResponse(
                this.employeeService.update(this.employee));
        } else {
            this.subscribeToSaveResponse(
                this.employeeService.create(this.employee));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Employee>>) {
        result.subscribe((res: HttpResponse<Employee>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Employee) {
        this.eventManager.broadcast({ name: 'employeeListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackDepartmentById(index: number, item: Department) {
        return item.id;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-employee-popup',
    template: ''
})
export class EmployeePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private employeePopupService: EmployeePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.employeePopupService
                    .open(EmployeeDialogComponent as Component, params['id']);
            } else {
                this.employeePopupService
                    .open(EmployeeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
