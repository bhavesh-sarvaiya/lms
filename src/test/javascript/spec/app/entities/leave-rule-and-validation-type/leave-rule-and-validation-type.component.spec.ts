/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleAndValidationTypeComponent } from '../../../../../../main/webapp/app/entities/leave-rule-and-validation-type/leave-rule-and-validation-type.component';
import { LeaveRuleAndValidationTypeService } from '../../../../../../main/webapp/app/entities/leave-rule-and-validation-type/leave-rule-and-validation-type.service';
import { LeaveRuleAndValidationType } from '../../../../../../main/webapp/app/entities/leave-rule-and-validation-type/leave-rule-and-validation-type.model';

describe('Component Tests', () => {

    describe('LeaveRuleAndValidationType Management Component', () => {
        let comp: LeaveRuleAndValidationTypeComponent;
        let fixture: ComponentFixture<LeaveRuleAndValidationTypeComponent>;
        let service: LeaveRuleAndValidationTypeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleAndValidationTypeComponent],
                providers: [
                    LeaveRuleAndValidationTypeService
                ]
            })
            .overrideTemplate(LeaveRuleAndValidationTypeComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleAndValidationTypeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleAndValidationTypeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new LeaveRuleAndValidationType(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.leaveRuleAndValidationTypes[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
