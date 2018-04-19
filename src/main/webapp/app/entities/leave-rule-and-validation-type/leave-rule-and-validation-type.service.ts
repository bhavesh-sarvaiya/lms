import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { LeaveRuleAndValidationType } from './leave-rule-and-validation-type.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<LeaveRuleAndValidationType>;

@Injectable()
export class LeaveRuleAndValidationTypeService {

    private resourceUrl =  SERVER_API_URL + 'api/leave-rule-and-validation-types';

    constructor(private http: HttpClient) { }

    create(leaveRuleAndValidationType: LeaveRuleAndValidationType): Observable<EntityResponseType> {
        const copy = this.convert(leaveRuleAndValidationType);
        return this.http.post<LeaveRuleAndValidationType>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(leaveRuleAndValidationType: LeaveRuleAndValidationType): Observable<EntityResponseType> {
        const copy = this.convert(leaveRuleAndValidationType);
        return this.http.put<LeaveRuleAndValidationType>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LeaveRuleAndValidationType>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LeaveRuleAndValidationType[]>> {
        const options = createRequestOption(req);
        return this.http.get<LeaveRuleAndValidationType[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LeaveRuleAndValidationType[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LeaveRuleAndValidationType = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LeaveRuleAndValidationType[]>): HttpResponse<LeaveRuleAndValidationType[]> {
        const jsonResponse: LeaveRuleAndValidationType[] = res.body;
        const body: LeaveRuleAndValidationType[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LeaveRuleAndValidationType.
     */
    private convertItemFromServer(leaveRuleAndValidationType: LeaveRuleAndValidationType): LeaveRuleAndValidationType {
        const copy: LeaveRuleAndValidationType = Object.assign({}, leaveRuleAndValidationType);
        return copy;
    }

    /**
     * Convert a LeaveRuleAndValidationType to a JSON which can be sent to the server.
     */
    private convert(leaveRuleAndValidationType: LeaveRuleAndValidationType): LeaveRuleAndValidationType {
        const copy: LeaveRuleAndValidationType = Object.assign({}, leaveRuleAndValidationType);
        return copy;
    }
}
