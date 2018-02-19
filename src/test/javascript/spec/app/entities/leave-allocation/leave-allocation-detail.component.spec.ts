/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LmsTestModule } from '../../../test.module';
import { LeaveAllocationDetailComponent } from '../../../../../../main/webapp/app/entities/leave-allocation/leave-allocation-detail.component';
import { LeaveAllocationService } from '../../../../../../main/webapp/app/entities/leave-allocation/leave-allocation.service';
import { LeaveAllocation } from '../../../../../../main/webapp/app/entities/leave-allocation/leave-allocation.model';

describe('Component Tests', () => {

    describe('LeaveAllocation Management Detail Component', () => {
        let comp: LeaveAllocationDetailComponent;
        let fixture: ComponentFixture<LeaveAllocationDetailComponent>;
        let service: LeaveAllocationService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveAllocationDetailComponent],
                providers: [
                    LeaveAllocationService
                ]
            })
            .overrideTemplate(LeaveAllocationDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveAllocationDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveAllocationService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LeaveAllocation(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.leaveAllocation).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
