import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { LeaveRule } from './leave-rule.model';
import { createRequestOption } from '../../shared';
import { LeaveRuleAndNoOfDay } from '../leave-rule-and-no-of-day';
import { LeaveRuleAndMaxMinLeave } from '../leave-rule-and-max-min-leave';
import { LeaveRuleAndValidationType } from '../leave-rule-and-validation-type';

export type EntityResponseType = HttpResponse<LeaveRule>;

@Injectable()
export class LeaveRuleService {

    private resourceUrl =  SERVER_API_URL + 'api/leave-rules';
    private resourceUrl1 =  SERVER_API_URL + 'api/leave-rules-leave-type';

    constructor(private http: HttpClient) { }

    create(leaveRule: LeaveRule, leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay[], leaveRuleAndMaxMinLeave: LeaveRuleAndMaxMinLeave[], leaveRuleAndValidationType: LeaveRuleAndValidationType[]): Observable<EntityResponseType> {
        leaveRule = this.convert(leaveRule);
        return this.http.post<LeaveRule>(this.resourceUrl, {leaveRule, leaveRuleAndNoOfDay, leaveRuleAndMaxMinLeave, leaveRuleAndValidationType}, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(leaveRule: LeaveRule,  leaveRuleAndNoOfDay: LeaveRuleAndNoOfDay[],  leaveRuleAndMaxMinLeave: LeaveRuleAndMaxMinLeave[], leaveRuleAndValidationType: LeaveRuleAndValidationType[]): Observable<EntityResponseType> {
        leaveRule = this.convert(leaveRule);
        return this.http.put<LeaveRule>(this.resourceUrl, {leaveRule, leaveRuleAndNoOfDay, leaveRuleAndMaxMinLeave, leaveRuleAndValidationType}, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LeaveRule>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    findByLeaveType(id: number): Observable<EntityResponseType> {
        return this.http.get<LeaveRule>(`${this.resourceUrl1}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LeaveRule[]>> {
        const options = createRequestOption(req);
        return this.http.get<LeaveRule[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LeaveRule[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LeaveRule = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LeaveRule[]>): HttpResponse<LeaveRule[]> {
        const jsonResponse: LeaveRule[] = res.body;
        const body: LeaveRule[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LeaveRule.
     */
    private convertItemFromServer(leaveRule: LeaveRule): LeaveRule {
        const copy: LeaveRule = Object.assign({}, leaveRule);
        return copy;
    }

    /**
     * Convert a LeaveRule to a JSON which can be sent to the server.
     */
    private convert(leaveRule: LeaveRule): LeaveRule {
        const copy: LeaveRule = Object.assign({}, leaveRule);
        return copy;
    }
}
