import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { LeaveType } from './leave-type.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<LeaveType>;

@Injectable()
export class LeaveTypeService {

    private resourceUrl =  SERVER_API_URL + 'api/leave-types';

    constructor(private http: HttpClient) { }

    create(leaveType: LeaveType): Observable<EntityResponseType> {
        const copy = this.convert(leaveType);
        return this.http.post<LeaveType>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(leaveType: LeaveType): Observable<EntityResponseType> {
        const copy = this.convert(leaveType);
        return this.http.put<LeaveType>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LeaveType>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LeaveType[]>> {
        const options = createRequestOption(req);
        return this.http.get<LeaveType[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LeaveType[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LeaveType = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LeaveType[]>): HttpResponse<LeaveType[]> {
        const jsonResponse: LeaveType[] = res.body;
        const body: LeaveType[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LeaveType.
     */
    private convertItemFromServer(leaveType: LeaveType): LeaveType {
        const copy: LeaveType = Object.assign({}, leaveType);
        return copy;
    }

    /**
     * Convert a LeaveType to a JSON which can be sent to the server.
     */
    private convert(leaveType: LeaveType): LeaveType {
        const copy: LeaveType = Object.assign({}, leaveType);
        return copy;
    }
}
