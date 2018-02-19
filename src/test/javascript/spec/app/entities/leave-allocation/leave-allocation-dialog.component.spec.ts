/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LmsTestModule } from '../../../test.module';
import { LeaveAllocationDialogComponent } from '../../../../../../main/webapp/app/entities/leave-allocation/leave-allocation-dialog.component';
import { LeaveAllocationService } from '../../../../../../main/webapp/app/entities/leave-allocation/leave-allocation.service';
import { LeaveAllocation } from '../../../../../../main/webapp/app/entities/leave-allocation/leave-allocation.model';
import { LeaveTypeService } from '../../../../../../main/webapp/app/entities/leave-type';

describe('Component Tests', () => {

    describe('LeaveAllocation Management Dialog Component', () => {
        let comp: LeaveAllocationDialogComponent;
        let fixture: ComponentFixture<LeaveAllocationDialogComponent>;
        let service: LeaveAllocationService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveAllocationDialogComponent],
                providers: [
                    LeaveTypeService,
                    LeaveAllocationService
                ]
            })
            .overrideTemplate(LeaveAllocationDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveAllocationDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveAllocationService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LeaveAllocation(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.leaveAllocation = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'leaveAllocationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LeaveAllocation();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.leaveAllocation = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'leaveAllocationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
