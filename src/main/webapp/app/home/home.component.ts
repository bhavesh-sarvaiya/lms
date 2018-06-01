import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Account, LoginModalService, Principal, LoginService, StateStorageService } from '../shared';
import { AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { LeaveBalance, LeaveBalanceService } from '../entities/leave-balance';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { LeaveApplication, LeaveApplicationService } from '../entities/leave-application';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.css'
    ]

})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    authenticationError: boolean;
    password: string;
    rememberMe: boolean;
    username: string;
    credentials: any;
    leaveBalances: LeaveBalance[];
    leaveApplications: LeaveApplication[];

    constructor(
        private loginService: LoginService,
        private stateStorageService: StateStorageService,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private jhiAlertService: JhiAlertService,
        private router: Router,
        private leaveBalanceService: LeaveBalanceService,
        private leaveApplicationService: LeaveApplicationService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();

        this.leaveBalanceService.findAllForLeaveApplicationHome().subscribe(
                (res: HttpResponse<LeaveBalance[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.leaveApplicationService.query('APPLIED').subscribe(
            (res: HttpResponse<LeaveApplication[]>) => {
                this.leaveApplications = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
       /* if (!this.principal.isAuthenticated() ) {
        console.log(this.principal.isAuthenticated());
        this.login();
        }*/
    }

    login() {
        this.loginService.login({
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe
        }).then(() => {
            this.authenticationError = false;
            if (this.router.url === '/register' || (/^\/activate\//.test(this.router.url)) ||
                (/^\/reset\//.test(this.router.url))) {
                this.router.navigate(['']);
            }

            this.eventManager.broadcast({
                name: 'authenticationSuccess',
                content: 'Sending Authentication Success'
            });

            // // previousState was set in the authExpiredInterceptor before being redirected to login modal.
            // // since login is succesful, go to stored previousState and clear previousState
            const redirect = this.stateStorageService.getUrl();
            if (redirect) {
                this.stateStorageService.storeUrl(null);
                this.router.navigate([redirect]);
            }
        }).catch(() => {
            this.authenticationError = true;
        });
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }
    requestResetPassword() {
        // this.activeModal.dismiss('to state requestReset');
        this.router.navigate(['/reset', 'request']);
    }

    private onSuccess(data, headers) {
        // this.page = pagingParams.page;
        this.leaveBalances = data;
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    // login() {
    //     this.modalRef = this.loginModalService.open();
    // }
}
