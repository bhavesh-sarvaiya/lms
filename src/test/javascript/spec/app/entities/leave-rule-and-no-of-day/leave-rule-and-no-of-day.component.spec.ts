/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleAndNoOfDayComponent } from '../../../../../../main/webapp/app/entities/leave-rule-and-no-of-day/leave-rule-and-no-of-day.component';
import { LeaveRuleAndNoOfDayService } from '../../../../../../main/webapp/app/entities/leave-rule-and-no-of-day/leave-rule-and-no-of-day.service';
import { LeaveRuleAndNoOfDay } from '../../../../../../main/webapp/app/entities/leave-rule-and-no-of-day/leave-rule-and-no-of-day.model';

describe('Component Tests', () => {

    describe('LeaveRuleAndNoOfDay Management Component', () => {
        let comp: LeaveRuleAndNoOfDayComponent;
        let fixture: ComponentFixture<LeaveRuleAndNoOfDayComponent>;
        let service: LeaveRuleAndNoOfDayService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleAndNoOfDayComponent],
                providers: [
                    LeaveRuleAndNoOfDayService
                ]
            })
            .overrideTemplate(LeaveRuleAndNoOfDayComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleAndNoOfDayComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleAndNoOfDayService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new LeaveRuleAndNoOfDay(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.leaveRuleAndNoOfDays[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
