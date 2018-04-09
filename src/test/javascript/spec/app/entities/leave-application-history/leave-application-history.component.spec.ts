/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LmsTestModule } from '../../../test.module';
import { LeaveApplicationHistoryComponent } from '../../../../../../main/webapp/app/entities/leave-application-history/leave-application-history.component';
import { LeaveApplicationHistoryService } from '../../../../../../main/webapp/app/entities/leave-application-history/leave-application-history.service';
import { LeaveApplicationHistory } from '../../../../../../main/webapp/app/entities/leave-application-history/leave-application-history.model';

describe('Component Tests', () => {

    describe('LeaveApplicationHistory Management Component', () => {
        let comp: LeaveApplicationHistoryComponent;
        let fixture: ComponentFixture<LeaveApplicationHistoryComponent>;
        let service: LeaveApplicationHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveApplicationHistoryComponent],
                providers: [
                    LeaveApplicationHistoryService
                ]
            })
            .overrideTemplate(LeaveApplicationHistoryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveApplicationHistoryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveApplicationHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new LeaveApplicationHistory(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.leaveApplicationHistories[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
