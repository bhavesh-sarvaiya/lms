/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleComponent } from '../../../../../../main/webapp/app/entities/leave-rule/leave-rule.component';
import { LeaveRuleService } from '../../../../../../main/webapp/app/entities/leave-rule/leave-rule.service';
import { LeaveRule } from '../../../../../../main/webapp/app/entities/leave-rule/leave-rule.model';

describe('Component Tests', () => {

    describe('LeaveRule Management Component', () => {
        let comp: LeaveRuleComponent;
        let fixture: ComponentFixture<LeaveRuleComponent>;
        let service: LeaveRuleService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleComponent],
                providers: [
                    LeaveRuleService
                ]
            })
            .overrideTemplate(LeaveRuleComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new LeaveRule(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.leaveRules[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
