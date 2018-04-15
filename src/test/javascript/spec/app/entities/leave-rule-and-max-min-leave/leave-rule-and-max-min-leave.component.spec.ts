/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleAndMaxMinLeaveComponent } from '../../../../../../main/webapp/app/entities/leave-rule-and-max-min-leave/leave-rule-and-max-min-leave.component';
import { LeaveRuleAndMaxMinLeaveService } from '../../../../../../main/webapp/app/entities/leave-rule-and-max-min-leave/leave-rule-and-max-min-leave.service';
import { LeaveRuleAndMaxMinLeave } from '../../../../../../main/webapp/app/entities/leave-rule-and-max-min-leave/leave-rule-and-max-min-leave.model';

describe('Component Tests', () => {

    describe('LeaveRuleAndMaxMinLeave Management Component', () => {
        let comp: LeaveRuleAndMaxMinLeaveComponent;
        let fixture: ComponentFixture<LeaveRuleAndMaxMinLeaveComponent>;
        let service: LeaveRuleAndMaxMinLeaveService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleAndMaxMinLeaveComponent],
                providers: [
                    LeaveRuleAndMaxMinLeaveService
                ]
            })
            .overrideTemplate(LeaveRuleAndMaxMinLeaveComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleAndMaxMinLeaveComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleAndMaxMinLeaveService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new LeaveRuleAndMaxMinLeave(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.leaveRuleAndMaxMinLeaves[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
