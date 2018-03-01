import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { LeaveApplication } from './leave-application.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<LeaveApplication>;

@Injectable()
export class LeaveApplicationService {

    private resourceUrl =  SERVER_API_URL + 'api/leave-applications';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(leaveApplication: LeaveApplication): Observable<EntityResponseType> {
        const copy = this.convert(leaveApplication);
        return this.http.post<LeaveApplication>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(leaveApplication: LeaveApplication): Observable<EntityResponseType> {
        const copy = this.convert(leaveApplication);
        return this.http.put<LeaveApplication>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LeaveApplication>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LeaveApplication[]>> {
        const options = createRequestOption(req);
        return this.http.get<LeaveApplication[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LeaveApplication[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LeaveApplication = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LeaveApplication[]>): HttpResponse<LeaveApplication[]> {
        const jsonResponse: LeaveApplication[] = res.body;
        const body: LeaveApplication[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LeaveApplication.
     */
    private convertItemFromServer(leaveApplication: LeaveApplication): LeaveApplication {
        const copy: LeaveApplication = Object.assign({}, leaveApplication);
        copy.fromDate = this.dateUtils
            .convertLocalDateFromServer(leaveApplication.fromDate);
        copy.toDate = this.dateUtils
            .convertLocalDateFromServer(leaveApplication.toDate);
        return copy;
    }

    /**
     * Convert a LeaveApplication to a JSON which can be sent to the server.
     */
    private convert(leaveApplication: LeaveApplication): LeaveApplication {
        const copy: LeaveApplication = Object.assign({}, leaveApplication);
        copy.fromDate = this.dateUtils
            .convertLocalDateToServer(leaveApplication.fromDate);
        copy.toDate = this.dateUtils
            .convertLocalDateToServer(leaveApplication.toDate);
        return copy;
    }
}
