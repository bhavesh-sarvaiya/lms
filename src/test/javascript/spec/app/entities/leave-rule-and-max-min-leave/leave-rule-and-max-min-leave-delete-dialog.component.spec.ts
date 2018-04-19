/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleAndMaxMinLeaveDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/leave-rule-and-max-min-leave/leave-rule-and-max-min-leave-delete-dialog.component';
import { LeaveRuleAndMaxMinLeaveService } from '../../../../../../main/webapp/app/entities/leave-rule-and-max-min-leave/leave-rule-and-max-min-leave.service';

describe('Component Tests', () => {

    describe('LeaveRuleAndMaxMinLeave Management Delete Component', () => {
        let comp: LeaveRuleAndMaxMinLeaveDeleteDialogComponent;
        let fixture: ComponentFixture<LeaveRuleAndMaxMinLeaveDeleteDialogComponent>;
        let service: LeaveRuleAndMaxMinLeaveService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleAndMaxMinLeaveDeleteDialogComponent],
                providers: [
                    LeaveRuleAndMaxMinLeaveService
                ]
            })
            .overrideTemplate(LeaveRuleAndMaxMinLeaveDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleAndMaxMinLeaveDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleAndMaxMinLeaveService);
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