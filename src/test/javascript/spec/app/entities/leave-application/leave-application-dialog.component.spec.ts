/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LmsTestModule } from '../../../test.module';
import { LeaveApplicationDialogComponent } from '../../../../../../main/webapp/app/entities/leave-application/leave-application-dialog.component';
import { LeaveApplicationService } from '../../../../../../main/webapp/app/entities/leave-application/leave-application.service';
import { LeaveApplication } from '../../../../../../main/webapp/app/entities/leave-application/leave-application.model';
import { EmployeeService } from '../../../../../../main/webapp/app/entities/employee';
import { LeaveTypeService } from '../../../../../../main/webapp/app/entities/leave-type';

describe('Component Tests', () => {

    describe('LeaveApplication Management Dialog Component', () => {
        let comp: LeaveApplicationDialogComponent;
        let fixture: ComponentFixture<LeaveApplicationDialogComponent>;
        let service: LeaveApplicationService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveApplicationDialogComponent],
                providers: [
                    EmployeeService,
                    LeaveTypeService,
                    LeaveApplicationService
                ]
            })
            .overrideTemplate(LeaveApplicationDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveApplicationDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveApplicationService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LeaveApplication(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.leaveApplication = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'leaveApplicationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LeaveApplication();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.leaveApplication = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'leaveApplicationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
