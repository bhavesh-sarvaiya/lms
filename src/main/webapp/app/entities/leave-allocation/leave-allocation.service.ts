import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { LeaveAllocation } from './leave-allocation.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<LeaveAllocation>;

@Injectable()
export class LeaveAllocationService {

    private resourceUrl =  SERVER_API_URL + 'api/leave-allocations';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(leaveAllocation: LeaveAllocation): Observable<EntityResponseType> {
        const copy = this.convert(leaveAllocation);
        return this.http.post<LeaveAllocation>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(leaveAllocation: LeaveAllocation): Observable<EntityResponseType> {
        const copy = this.convert(leaveAllocation);
        return this.http.put<LeaveAllocation>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LeaveAllocation>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LeaveAllocation[]>> {
        const options = createRequestOption(req);
        return this.http.get<LeaveAllocation[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LeaveAllocation[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LeaveAllocation = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LeaveAllocation[]>): HttpResponse<LeaveAllocation[]> {
        const jsonResponse: LeaveAllocation[] = res.body;
        const body: LeaveAllocation[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LeaveAllocation.
     */
    private convertItemFromServer(leaveAllocation: LeaveAllocation): LeaveAllocation {
        const copy: LeaveAllocation = Object.assign({}, leaveAllocation);
        copy.allocationDate = this.dateUtils
            .convertLocalDateFromServer(leaveAllocation.allocationDate);
        return copy;
    }

    /**
     * Convert a LeaveAllocation to a JSON which can be sent to the server.
     */
    private convert(leaveAllocation: LeaveAllocation): LeaveAllocation {
        const copy: LeaveAllocation = Object.assign({}, leaveAllocation);
        if (leaveAllocation.allocationDate === undefined || leaveAllocation.allocationDate === null || leaveAllocation.allocationDate.toString().trim() === '') {
            return copy;
        }
        copy.allocationDate = this.dateUtils
            .convertLocalDateToServer(leaveAllocation.allocationDate);
        return copy;
    }
}
