/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LmsTestModule } from '../../../test.module';
import { LeaveBalanceDetailComponent } from '../../../../../../main/webapp/app/entities/leave-balance/leave-balance-detail.component';
import { LeaveBalanceService } from '../../../../../../main/webapp/app/entities/leave-balance/leave-balance.service';
import { LeaveBalance } from '../../../../../../main/webapp/app/entities/leave-balance/leave-balance.model';

describe('Component Tests', () => {

    describe('LeaveBalance Management Detail Component', () => {
        let comp: LeaveBalanceDetailComponent;
        let fixture: ComponentFixture<LeaveBalanceDetailComponent>;
        let service: LeaveBalanceService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveBalanceDetailComponent],
                providers: [
                    LeaveBalanceService
                ]
            })
            .overrideTemplate(LeaveBalanceDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveBalanceDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveBalanceService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LeaveBalance(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.leaveBalance).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
