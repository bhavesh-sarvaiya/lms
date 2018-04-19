/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleAndNoOfDayDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/leave-rule-and-no-of-day/leave-rule-and-no-of-day-delete-dialog.component';
import { LeaveRuleAndNoOfDayService } from '../../../../../../main/webapp/app/entities/leave-rule-and-no-of-day/leave-rule-and-no-of-day.service';

describe('Component Tests', () => {

    describe('LeaveRuleAndNoOfDay Management Delete Component', () => {
        let comp: LeaveRuleAndNoOfDayDeleteDialogComponent;
        let fixture: ComponentFixture<LeaveRuleAndNoOfDayDeleteDialogComponent>;
        let service: LeaveRuleAndNoOfDayService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleAndNoOfDayDeleteDialogComponent],
                providers: [
                    LeaveRuleAndNoOfDayService
                ]
            })
            .overrideTemplate(LeaveRuleAndNoOfDayDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleAndNoOfDayDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleAndNoOfDayService);
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
