/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleAndNoOfDayDetailComponent } from '../../../../../../main/webapp/app/entities/leave-rule-and-no-of-day/leave-rule-and-no-of-day-detail.component';
import { LeaveRuleAndNoOfDayService } from '../../../../../../main/webapp/app/entities/leave-rule-and-no-of-day/leave-rule-and-no-of-day.service';
import { LeaveRuleAndNoOfDay } from '../../../../../../main/webapp/app/entities/leave-rule-and-no-of-day/leave-rule-and-no-of-day.model';

describe('Component Tests', () => {

    describe('LeaveRuleAndNoOfDay Management Detail Component', () => {
        let comp: LeaveRuleAndNoOfDayDetailComponent;
        let fixture: ComponentFixture<LeaveRuleAndNoOfDayDetailComponent>;
        let service: LeaveRuleAndNoOfDayService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleAndNoOfDayDetailComponent],
                providers: [
                    LeaveRuleAndNoOfDayService
                ]
            })
            .overrideTemplate(LeaveRuleAndNoOfDayDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleAndNoOfDayDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleAndNoOfDayService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LeaveRuleAndNoOfDay(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.leaveRuleAndNoOfDay).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
