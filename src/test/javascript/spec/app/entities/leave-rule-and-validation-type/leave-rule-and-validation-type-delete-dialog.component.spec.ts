/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleAndValidationTypeDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/leave-rule-and-validation-type/leave-rule-and-validation-type-delete-dialog.component';
import { LeaveRuleAndValidationTypeService } from '../../../../../../main/webapp/app/entities/leave-rule-and-validation-type/leave-rule-and-validation-type.service';

describe('Component Tests', () => {

    describe('LeaveRuleAndValidationType Management Delete Component', () => {
        let comp: LeaveRuleAndValidationTypeDeleteDialogComponent;
        let fixture: ComponentFixture<LeaveRuleAndValidationTypeDeleteDialogComponent>;
        let service: LeaveRuleAndValidationTypeService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleAndValidationTypeDeleteDialogComponent],
                providers: [
                    LeaveRuleAndValidationTypeService
                ]
            })
            .overrideTemplate(LeaveRuleAndValidationTypeDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleAndValidationTypeDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleAndValidationTypeService);
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
