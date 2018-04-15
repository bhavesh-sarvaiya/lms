/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleAndValidationTypeDetailComponent } from '../../../../../../main/webapp/app/entities/leave-rule-and-validation-type/leave-rule-and-validation-type-detail.component';
import { LeaveRuleAndValidationTypeService } from '../../../../../../main/webapp/app/entities/leave-rule-and-validation-type/leave-rule-and-validation-type.service';
import { LeaveRuleAndValidationType } from '../../../../../../main/webapp/app/entities/leave-rule-and-validation-type/leave-rule-and-validation-type.model';

describe('Component Tests', () => {

    describe('LeaveRuleAndValidationType Management Detail Component', () => {
        let comp: LeaveRuleAndValidationTypeDetailComponent;
        let fixture: ComponentFixture<LeaveRuleAndValidationTypeDetailComponent>;
        let service: LeaveRuleAndValidationTypeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleAndValidationTypeDetailComponent],
                providers: [
                    LeaveRuleAndValidationTypeService
                ]
            })
            .overrideTemplate(LeaveRuleAndValidationTypeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleAndValidationTypeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleAndValidationTypeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LeaveRuleAndValidationType(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.leaveRuleAndValidationType).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
