/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleAndNoOfDayDialogComponent } from '../../../../../../main/webapp/app/entities/leave-rule-and-no-of-day/leave-rule-and-no-of-day-dialog.component';
import { LeaveRuleAndNoOfDayService } from '../../../../../../main/webapp/app/entities/leave-rule-and-no-of-day/leave-rule-and-no-of-day.service';
import { LeaveRuleAndNoOfDay } from '../../../../../../main/webapp/app/entities/leave-rule-and-no-of-day/leave-rule-and-no-of-day.model';
import { LeaveRuleService } from '../../../../../../main/webapp/app/entities/leave-rule';

describe('Component Tests', () => {

    describe('LeaveRuleAndNoOfDay Management Dialog Component', () => {
        let comp: LeaveRuleAndNoOfDayDialogComponent;
        let fixture: ComponentFixture<LeaveRuleAndNoOfDayDialogComponent>;
        let service: LeaveRuleAndNoOfDayService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleAndNoOfDayDialogComponent],
                providers: [
                    LeaveRuleService,
                    LeaveRuleAndNoOfDayService
                ]
            })
            .overrideTemplate(LeaveRuleAndNoOfDayDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleAndNoOfDayDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleAndNoOfDayService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LeaveRuleAndNoOfDay(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.leaveRuleAndNoOfDay = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'leaveRuleAndNoOfDayListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LeaveRuleAndNoOfDay();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.leaveRuleAndNoOfDay = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'leaveRuleAndNoOfDayListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
