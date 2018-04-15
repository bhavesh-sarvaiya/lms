import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { LeaveRuleAndMaxMinLeave } from './leave-rule-and-max-min-leave.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<LeaveRuleAndMaxMinLeave>;

@Injectable()
export class LeaveRuleAndMaxMinLeaveService {

    private resourceUrl =  SERVER_API_URL + 'api/leave-rule-and-max-min-leaves';

    constructor(private http: HttpClient) { }

    create(leaveRuleAndMaxMinLeave: LeaveRuleAndMaxMinLeave): Observable<EntityResponseType> {
        const copy = this.convert(leaveRuleAndMaxMinLeave);
        return this.http.post<LeaveRuleAndMaxMinLeave>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(leaveRuleAndMaxMinLeave: LeaveRuleAndMaxMinLeave): Observable<EntityResponseType> {
        const copy = this.convert(leaveRuleAndMaxMinLeave);
        return this.http.put<LeaveRuleAndMaxMinLeave>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LeaveRuleAndMaxMinLeave>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LeaveRuleAndMaxMinLeave[]>> {
        const options = createRequestOption(req);
        return this.http.get<LeaveRuleAndMaxMinLeave[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LeaveRuleAndMaxMinLeave[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LeaveRuleAndMaxMinLeave = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LeaveRuleAndMaxMinLeave[]>): HttpResponse<LeaveRuleAndMaxMinLeave[]> {
        const jsonResponse: LeaveRuleAndMaxMinLeave[] = res.body;
        const body: LeaveRuleAndMaxMinLeave[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LeaveRuleAndMaxMinLeave.
     */
    private convertItemFromServer(leaveRuleAndMaxMinLeave: LeaveRuleAndMaxMinLeave): LeaveRuleAndMaxMinLeave {
        const copy: LeaveRuleAndMaxMinLeave = Object.assign({}, leaveRuleAndMaxMinLeave);
        return copy;
    }

    /**
     * Convert a LeaveRuleAndMaxMinLeave to a JSON which can be sent to the server.
     */
    private convert(leaveRuleAndMaxMinLeave: LeaveRuleAndMaxMinLeave): LeaveRuleAndMaxMinLeave {
        const copy: LeaveRuleAndMaxMinLeave = Object.assign({}, leaveRuleAndMaxMinLeave);
        return copy;
    }
}
