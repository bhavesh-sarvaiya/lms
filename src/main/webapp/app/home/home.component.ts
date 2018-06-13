import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Account, LoginModalService, Principal, LoginService, StateStorageService } from '../shared';
import { AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { LeaveBalance, LeaveBalanceService } from '../entities/leave-balance';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { LeaveApplication, LeaveApplicationService } from '../entities/leave-application';
import { LeaveApplicationHistory, LeaveApplicationHistoryService } from '../entities/leave-application-history';
import { NavbarComponent } from '../layouts';

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
    leaveApplications1: LeaveApplication[];
    leaveApplicationHistories: LeaveApplicationHistory[];
    lengthLeave: number;
    lengthLeave1: number;
    lengthBalance: number;
    lengthHis: number;
    @Input() navnar: NavbarComponent;
    constructor(
        private loginService: LoginService,
        private stateStorageService: StateStorageService,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private jhiAlertService: JhiAlertService,
        private leaveApplicationHistoryService: LeaveApplicationHistoryService,
        private router: Router,
        private leaveBalanceService: LeaveBalanceService,
        private leaveApplicationService: LeaveApplicationService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
            if (this.account !== null) {
                this.getLeaveApplication();
                }
        });
        this.registerAuthenticationSuccess();
    }
    getLeaveApplication() {
        let status1 = 'AppliedHome';
        let status2 = 'apprej';
        if (this.account.login === 'admin') {
            status1 = 'AdminHome';
            status2 = 'AdminApprej';
        }
        this.leaveApplicationService.query(status1).subscribe(
            (res: HttpResponse<LeaveApplication[]>) => {
                this.leaveApplications = res.body;
                this.lengthLeave = this.leaveApplications.length;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );

        this.leaveApplicationService.query(status2).subscribe(
            (res: HttpResponse<LeaveApplication[]>) => {
                this.leaveApplications1 = res.body;
                this.lengthLeave1 = this.leaveApplications1.length;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );

        this.leaveApplicationHistoryService.getFromHome().subscribe(
            (res: HttpResponse<LeaveApplicationHistory[]>) => {
                this.leaveApplicationHistories = res.body;
                this.lengthHis = this.leaveApplicationHistories.length;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.leaveBalanceService.findAllForLeaveBalanceHome().subscribe(
            (res: HttpResponse<LeaveBalance[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
    );
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
                if (this.account !== null) {
                this.getLeaveApplication();
                }
            });
        });
        this.navnar.isAuthenticated();
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
        this.lengthBalance = this.leaveBalances.length;
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    // login() {
    //     this.modalRef = this.loginModalService.open();
    // }
}
