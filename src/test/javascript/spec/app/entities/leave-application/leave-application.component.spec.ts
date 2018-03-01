/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LmsTestModule } from '../../../test.module';
import { LeaveApplicationComponent } from '../../../../../../main/webapp/app/entities/leave-application/leave-application.component';
import { LeaveApplicationService } from '../../../../../../main/webapp/app/entities/leave-application/leave-application.service';
import { LeaveApplication } from '../../../../../../main/webapp/app/entities/leave-application/leave-application.model';

describe('Component Tests', () => {

    describe('LeaveApplication Management Component', () => {
        let comp: LeaveApplicationComponent;
        let fixture: ComponentFixture<LeaveApplicationComponent>;
        let service: LeaveApplicationService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveApplicationComponent],
                providers: [
                    LeaveApplicationService
                ]
            })
            .overrideTemplate(LeaveApplicationComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveApplicationComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveApplicationService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new LeaveApplication(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.leaveApplications[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
