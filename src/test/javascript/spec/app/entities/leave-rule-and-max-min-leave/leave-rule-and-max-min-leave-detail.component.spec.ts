/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleAndMaxMinLeaveDetailComponent } from '../../../../../../main/webapp/app/entities/leave-rule-and-max-min-leave/leave-rule-and-max-min-leave-detail.component';
import { LeaveRuleAndMaxMinLeaveService } from '../../../../../../main/webapp/app/entities/leave-rule-and-max-min-leave/leave-rule-and-max-min-leave.service';
import { LeaveRuleAndMaxMinLeave } from '../../../../../../main/webapp/app/entities/leave-rule-and-max-min-leave/leave-rule-and-max-min-leave.model';

describe('Component Tests', () => {

    describe('LeaveRuleAndMaxMinLeave Management Detail Component', () => {
        let comp: LeaveRuleAndMaxMinLeaveDetailComponent;
        let fixture: ComponentFixture<LeaveRuleAndMaxMinLeaveDetailComponent>;
        let service: LeaveRuleAndMaxMinLeaveService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleAndMaxMinLeaveDetailComponent],
                providers: [
                    LeaveRuleAndMaxMinLeaveService
                ]
            })
            .overrideTemplate(LeaveRuleAndMaxMinLeaveDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleAndMaxMinLeaveDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleAndMaxMinLeaveService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LeaveRuleAndMaxMinLeave(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.leaveRuleAndMaxMinLeave).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
