/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LmsTestModule } from '../../../test.module';
import { LeaveTypeDetailComponent } from '../../../../../../main/webapp/app/entities/leave-type/leave-type-detail.component';
import { LeaveTypeService } from '../../../../../../main/webapp/app/entities/leave-type/leave-type.service';
import { LeaveType } from '../../../../../../main/webapp/app/entities/leave-type/leave-type.model';

describe('Component Tests', () => {

    describe('LeaveType Management Detail Component', () => {
        let comp: LeaveTypeDetailComponent;
        let fixture: ComponentFixture<LeaveTypeDetailComponent>;
        let service: LeaveTypeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveTypeDetailComponent],
                providers: [
                    LeaveTypeService
                ]
            })
            .overrideTemplate(LeaveTypeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveTypeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveTypeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LeaveType(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.leaveType).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
