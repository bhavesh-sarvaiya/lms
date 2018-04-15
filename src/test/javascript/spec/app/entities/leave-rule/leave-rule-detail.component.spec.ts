/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleDetailComponent } from '../../../../../../main/webapp/app/entities/leave-rule/leave-rule-detail.component';
import { LeaveRuleService } from '../../../../../../main/webapp/app/entities/leave-rule/leave-rule.service';
import { LeaveRule } from '../../../../../../main/webapp/app/entities/leave-rule/leave-rule.model';

describe('Component Tests', () => {

    describe('LeaveRule Management Detail Component', () => {
        let comp: LeaveRuleDetailComponent;
        let fixture: ComponentFixture<LeaveRuleDetailComponent>;
        let service: LeaveRuleService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleDetailComponent],
                providers: [
                    LeaveRuleService
                ]
            })
            .overrideTemplate(LeaveRuleDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LeaveRule(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.leaveRule).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
