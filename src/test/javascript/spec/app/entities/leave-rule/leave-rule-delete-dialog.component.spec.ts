/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LmsTestModule } from '../../../test.module';
import { LeaveRuleDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/leave-rule/leave-rule-delete-dialog.component';
import { LeaveRuleService } from '../../../../../../main/webapp/app/entities/leave-rule/leave-rule.service';

describe('Component Tests', () => {

    describe('LeaveRule Management Delete Component', () => {
        let comp: LeaveRuleDeleteDialogComponent;
        let fixture: ComponentFixture<LeaveRuleDeleteDialogComponent>;
        let service: LeaveRuleService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveRuleDeleteDialogComponent],
                providers: [
                    LeaveRuleService
                ]
            })
            .overrideTemplate(LeaveRuleDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveRuleDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveRuleService);
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
