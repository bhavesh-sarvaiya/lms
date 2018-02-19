/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LmsTestModule } from '../../../test.module';
import { LeaveAllocationComponent } from '../../../../../../main/webapp/app/entities/leave-allocation/leave-allocation.component';
import { LeaveAllocationService } from '../../../../../../main/webapp/app/entities/leave-allocation/leave-allocation.service';
import { LeaveAllocation } from '../../../../../../main/webapp/app/entities/leave-allocation/leave-allocation.model';

describe('Component Tests', () => {

    describe('LeaveAllocation Management Component', () => {
        let comp: LeaveAllocationComponent;
        let fixture: ComponentFixture<LeaveAllocationComponent>;
        let service: LeaveAllocationService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveAllocationComponent],
                providers: [
                    LeaveAllocationService
                ]
            })
            .overrideTemplate(LeaveAllocationComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveAllocationComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveAllocationService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new LeaveAllocation(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.leaveAllocations[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
