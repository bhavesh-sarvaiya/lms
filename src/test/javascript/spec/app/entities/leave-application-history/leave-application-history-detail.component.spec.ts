/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LmsTestModule } from '../../../test.module';
import { LeaveApplicationHistoryDetailComponent } from '../../../../../../main/webapp/app/entities/leave-application-history/leave-application-history-detail.component';
import { LeaveApplicationHistoryService } from '../../../../../../main/webapp/app/entities/leave-application-history/leave-application-history.service';
import { LeaveApplicationHistory } from '../../../../../../main/webapp/app/entities/leave-application-history/leave-application-history.model';

describe('Component Tests', () => {

    describe('LeaveApplicationHistory Management Detail Component', () => {
        let comp: LeaveApplicationHistoryDetailComponent;
        let fixture: ComponentFixture<LeaveApplicationHistoryDetailComponent>;
        let service: LeaveApplicationHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveApplicationHistoryDetailComponent],
                providers: [
                    LeaveApplicationHistoryService
                ]
            })
            .overrideTemplate(LeaveApplicationHistoryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveApplicationHistoryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveApplicationHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LeaveApplicationHistory(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.leaveApplicationHistory).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
