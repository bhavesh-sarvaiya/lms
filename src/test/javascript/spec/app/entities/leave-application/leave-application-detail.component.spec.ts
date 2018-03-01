/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LmsTestModule } from '../../../test.module';
import { LeaveApplicationDetailComponent } from '../../../../../../main/webapp/app/entities/leave-application/leave-application-detail.component';
import { LeaveApplicationService } from '../../../../../../main/webapp/app/entities/leave-application/leave-application.service';
import { LeaveApplication } from '../../../../../../main/webapp/app/entities/leave-application/leave-application.model';

describe('Component Tests', () => {

    describe('LeaveApplication Management Detail Component', () => {
        let comp: LeaveApplicationDetailComponent;
        let fixture: ComponentFixture<LeaveApplicationDetailComponent>;
        let service: LeaveApplicationService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveApplicationDetailComponent],
                providers: [
                    LeaveApplicationService
                ]
            })
            .overrideTemplate(LeaveApplicationDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveApplicationDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveApplicationService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LeaveApplication(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.leaveApplication).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
