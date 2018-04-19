/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleAndMaxMinLeaveDialogComponent } from '../../../../../../main/webapp/app/entities/leave-rule-and-max-min-leave/leave-rule-and-max-min-leave-dialog.component';
import { LeaveRuleAndMaxMinLeaveService } from '../../../../../../main/webapp/app/entities/leave-rule-and-max-min-leave/leave-rule-and-max-min-leave.service';
import { LeaveRuleAndMaxMinLeave } from '../../../../../../main/webapp/app/entities/leave-rule-and-max-min-leave/leave-rule-and-max-min-leave.model';
import { LeaveRuleService } from '../../../../../../main/webapp/app/entities/leave-rule';

describe('Component Tests', () => {

    describe('LeaveRuleAndMaxMinLeave Management Dialog Component', () => {
        let comp: LeaveRuleAndMaxMinLeaveDialogComponent;
        let fixture: ComponentFixture<LeaveRuleAndMaxMinLeaveDialogComponent>;
        let service: LeaveRuleAndMaxMinLeaveService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleAndMaxMinLeaveDialogComponent],
                providers: [
                    LeaveRuleService,
                    LeaveRuleAndMaxMinLeaveService
                ]
            })
            .overrideTemplate(LeaveRuleAndMaxMinLeaveDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleAndMaxMinLeaveDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleAndMaxMinLeaveService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LeaveRuleAndMaxMinLeave(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.leaveRuleAndMaxMinLeave = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'leaveRuleAndMaxMinLeaveListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LeaveRuleAndMaxMinLeave();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.leaveRuleAndMaxMinLeave = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'leaveRuleAndMaxMinLeaveListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
