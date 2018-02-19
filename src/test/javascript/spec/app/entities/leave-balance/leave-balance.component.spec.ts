/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LmsTestModule } from '../../../test.module';
import { LeaveBalanceComponent } from '../../../../../../main/webapp/app/entities/leave-balance/leave-balance.component';
import { LeaveBalanceService } from '../../../../../../main/webapp/app/entities/leave-balance/leave-balance.service';
import { LeaveBalance } from '../../../../../../main/webapp/app/entities/leave-balance/leave-balance.model';

describe('Component Tests', () => {

    describe('LeaveBalance Management Component', () => {
        let comp: LeaveBalanceComponent;
        let fixture: ComponentFixture<LeaveBalanceComponent>;
        let service: LeaveBalanceService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveBalanceComponent],
                providers: [
                    LeaveBalanceService
                ]
            })
            .overrideTemplate(LeaveBalanceComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveBalanceComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveBalanceService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new LeaveBalance(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.leaveBalances[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
