import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { LeaveApplicationHistory } from './leave-application-history.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<LeaveApplicationHistory>;

@Injectable()
export class LeaveApplicationHistoryService {

    private resourceUrl =  SERVER_API_URL + 'api/leave-application-histories';
    private resourceUrl1 =  SERVER_API_URL + 'api/leave-application-histories-home';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(leaveApplicationHistory: LeaveApplicationHistory): Observable<EntityResponseType> {
        const copy = this.convert(leaveApplicationHistory);
        return this.http.post<LeaveApplicationHistory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(leaveApplicationHistory: LeaveApplicationHistory): Observable<EntityResponseType> {
        const copy = this.convert(leaveApplicationHistory);
        return this.http.put<LeaveApplicationHistory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LeaveApplicationHistory>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LeaveApplicationHistory[]>> {
        const options = createRequestOption(req);
        return this.http.get<LeaveApplicationHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LeaveApplicationHistory[]>) => this.convertArrayResponse(res));
    }

    getFromHome(req?: any): Observable<HttpResponse<LeaveApplicationHistory[]>> {
        const options = createRequestOption(req);
        return this.http.get<LeaveApplicationHistory[]>(this.resourceUrl1, { params: options, observe: 'response' })
            .map((res: HttpResponse<LeaveApplicationHistory[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LeaveApplicationHistory = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LeaveApplicationHistory[]>): HttpResponse<LeaveApplicationHistory[]> {
        const jsonResponse: LeaveApplicationHistory[] = res.body;
        const body: LeaveApplicationHistory[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LeaveApplicationHistory.
     */
    private convertItemFromServer(leaveApplicationHistory: LeaveApplicationHistory): LeaveApplicationHistory {
        const copy: LeaveApplicationHistory = Object.assign({}, leaveApplicationHistory);
        copy.actionDate = this.dateUtils
            .convertLocalDateFromServer(leaveApplicationHistory.actionDate);
        return copy;
    }

    /**
     * Convert a LeaveApplicationHistory to a JSON which can be sent to the server.
     */
    private convert(leaveApplicationHistory: LeaveApplicationHistory): LeaveApplicationHistory {
        const copy: LeaveApplicationHistory = Object.assign({}, leaveApplicationHistory);
        copy.actionDate = this.dateUtils
            .convertLocalDateToServer(leaveApplicationHistory.actionDate);
        return copy;
    }
}
