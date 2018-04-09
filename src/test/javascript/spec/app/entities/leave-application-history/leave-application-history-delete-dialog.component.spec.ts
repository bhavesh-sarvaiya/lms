/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LmsTestModule } from '../../../test.module';
import { LeaveApplicationHistoryDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/leave-application-history/leave-application-history-delete-dialog.component';
import { LeaveApplicationHistoryService } from '../../../../../../main/webapp/app/entities/leave-application-history/leave-application-history.service';

describe('Component Tests', () => {

    describe('LeaveApplicationHistory Management Delete Component', () => {
        let comp: LeaveApplicationHistoryDeleteDialogComponent;
        let fixture: ComponentFixture<LeaveApplicationHistoryDeleteDialogComponent>;
        let service: LeaveApplicationHistoryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveApplicationHistoryDeleteDialogComponent],
                providers: [
                    LeaveApplicationHistoryService
                ]
            })
            .overrideTemplate(LeaveApplicationHistoryDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveApplicationHistoryDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveApplicationHistoryService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
