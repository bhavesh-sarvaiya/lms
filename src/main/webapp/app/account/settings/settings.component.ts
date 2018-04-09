import { Component, OnInit } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';

import { Principal, AccountService, JhiLanguageHelper } from '../../shared';
import { Employee, EmployeeService } from '../../entities/employee';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'jhi-settings',
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
    error: string;
    success: string;
    settingsAccount: any;
    employee: Employee;
    languages: any[];

    constructor(
        private account: AccountService,
        private principal: Principal,
        private languageService: JhiLanguageService,
        private employeeService: EmployeeService,
        private languageHelper: JhiLanguageHelper
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.settingsAccount = this.copyAccount(account);
            this.load(account.id);
        });
        this.languageHelper.getAll().then((languages) => {
            this.languages = languages;
        });
    }
    load(id) {
        this.employeeService.loadEmployeeByUser(id)
            .subscribe((employeeResponse: HttpResponse<Employee>) => {
                this.employee = employeeResponse.body;
                this.settingsAccount = this.copyAccount1( this.settingsAccount, this.employee);
            });
    }
    save() {
        this.account.save(this.settingsAccount).subscribe(() => {
            this.error = null;
            this.success = 'OK';
            this.principal.identity(true).then((account) => {
                this.settingsAccount = this.copyAccount(account);
            });
            this.languageService.getCurrent().then((current) => {
                if (this.settingsAccount.langKey !== current) {
                    this.languageService.changeLanguage(this.settingsAccount.langKey);
                }
            });
        }, () => {
            this.success = null;
            this.error = 'ERROR';
        });
    }

    copyAccount(account) {
        return {
            activated: account.activated,
            email: account.email,
            firstName: account.firstName,
            langKey: account.langKey,
            lastName: account.lastName,
            login: account.login,
            imageUrl: account.imageUrl
        };
    }
    copyAccount1(account, employee) {
        return {
            activated: account.activated,
            email: account.email,
            firstName: employee.firstName,
            langKey: account.langKey,
            lastName: employee.lastName,
            login: account.login,
            imageUrl: account.imageUrl
        };
    }
}
