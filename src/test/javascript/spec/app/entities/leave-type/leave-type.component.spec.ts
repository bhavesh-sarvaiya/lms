/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LmsTestModule } from '../../../test.module';
import { LeaveTypeComponent } from '../../../../../../main/webapp/app/entities/leave-type/leave-type.component';
import { LeaveTypeService } from '../../../../../../main/webapp/app/entities/leave-type/leave-type.service';
import { LeaveType } from '../../../../../../main/webapp/app/entities/leave-type/leave-type.model';

describe('Component Tests', () => {

    describe('LeaveType Management Component', () => {
        let comp: LeaveTypeComponent;
        let fixture: ComponentFixture<LeaveTypeComponent>;
        let service: LeaveTypeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LmsTestModule],
                declarations: [LeaveTypeComponent],
                providers: [
                    LeaveTypeService
                ]
            })
            .overrideTemplate(LeaveTypeComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LeaveTypeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LeaveTypeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new LeaveType(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.leaveTypes[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
