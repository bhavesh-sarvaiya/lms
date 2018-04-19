import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { LeaveRuleAndNoOfDay } from './leave-rule-and-no-of-day.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<LeaveRuleAndNoOfDay>;

@Injectable()
export class LeaveRuleAndNoOfDayService {

    private resourceUrl =  SERVER_API_URL + 'api/leave-rule-and-no-of-days';

    constructor(private http: HttpClient) { }

    create(leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay): Observable<EntityResponseType> {
        const copy = this.convert(leaveRuleAndNoOfDay);
        return this.http.post<LeaveRuleAndNoOfDay>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay): Observable<EntityResponseType> {
        const copy = this.convert(leaveRuleAndNoOfDay);
        return this.http.put<LeaveRuleAndNoOfDay>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LeaveRuleAndNoOfDay>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LeaveRuleAndNoOfDay[]>> {
        const options = createRequestOption(req);
        return this.http.get<LeaveRuleAndNoOfDay[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LeaveRuleAndNoOfDay[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LeaveRuleAndNoOfDay = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LeaveRuleAndNoOfDay[]>): HttpResponse<LeaveRuleAndNoOfDay[]> {
        const jsonResponse: LeaveRuleAndNoOfDay[] = res.body;
        const body: LeaveRuleAndNoOfDay[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LeaveRuleAndNoOfDay.
     */
    private convertItemFromServer(leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay): LeaveRuleAndNoOfDay {
        const copy: LeaveRuleAndNoOfDay = Object.assign({}, leaveRuleAndNoOfDay);
        return copy;
    }

    /**
     * Convert a LeaveRuleAndNoOfDay to a JSON which can be sent to the server.
     */
    private convert(leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay): LeaveRuleAndNoOfDay {
        const copy: LeaveRuleAndNoOfDay = Object.assign({}, leaveRuleAndNoOfDay);
        return copy;
    }
}
