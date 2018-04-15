/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleDialogComponent } from '../../../../../../main/webapp/app/entities/leave-rule/leave-rule-dialog.component';
import { LeaveRuleService } from '../../../../../../main/webapp/app/entities/leave-rule/leave-rule.service';
import { LeaveRule } from '../../../../../../main/webapp/app/entities/leave-rule/leave-rule.model';
import { LeaveTypeService } from '../../../../../../main/webapp/app/entities/leave-type';

describe('Component Tests', () => {

    describe('LeaveRule Management Dialog Component', () => {
        let comp: LeaveRuleDialogComponent;
        let fixture: ComponentFixture<LeaveRuleDialogComponent>;
        let service: LeaveRuleService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleDialogComponent],
                providers: [
                    LeaveTypeService,
                    LeaveRuleService
                ]
            })
            .overrideTemplate(LeaveRuleDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LeaveRule(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.leaveRule = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'leaveRuleListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LeaveRule();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.leaveRule = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'leaveRuleListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
