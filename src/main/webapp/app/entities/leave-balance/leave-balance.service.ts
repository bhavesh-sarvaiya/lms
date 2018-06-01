import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { LeaveBalance } from './leave-balance.model';
import { createRequestOption } from '../../shared';
import { Department } from '../department';

export type EntityResponseType = HttpResponse<LeaveBalance>;

@Injectable()
export class LeaveBalanceService {

    private resourceUrl =  SERVER_API_URL + 'api/leave-balances';
    private resourceUrl1 =  SERVER_API_URL + 'api/leave-balances-department';
    private resourceUrl2 =  SERVER_API_URL + 'api/leave-balances-leave-application';
    private resourceUrl3 =  SERVER_API_URL + 'api/leave-balances-leave-application-home';

    constructor(private http: HttpClient) { }

    create(leaveBalance: LeaveBalance): Observable<EntityResponseType> {
        const copy = this.convert(leaveBalance);
        return this.http.post<LeaveBalance>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(leaveBalance: LeaveBalance): Observable<EntityResponseType> {
        const copy = this.convert(leaveBalance);
        return this.http.put<LeaveBalance>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LeaveBalance>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LeaveBalance[]>> {
        const options = createRequestOption(req);
        return this.http.get<LeaveBalance[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LeaveBalance[]>) => this.convertArrayResponse(res));
    }

    findAllForLeaveApplication(req?: any): Observable<HttpResponse<LeaveBalance[]>> {
        const options = createRequestOption(req);
        return this.http.get<LeaveBalance[]>(this.resourceUrl2, { params: options, observe: 'response' })
            .map((res: HttpResponse<LeaveBalance[]>) => this.convertArrayResponse(res));
    }

    findAllForLeaveApplicationHome(req?: any): Observable<HttpResponse<LeaveBalance[]>> {
        const options = createRequestOption(req);
        return this.http.get<LeaveBalance[]>(this.resourceUrl3, { params: options, observe: 'response' })
            .map((res: HttpResponse<LeaveBalance[]>) => this.convertArrayResponse(res));
    }

    findAllByDepartment(id: number, req?: any): Observable<HttpResponse<LeaveBalance[]>> {
        const options = createRequestOption({id, req});
        return this.http.get<LeaveBalance[]>(this.resourceUrl1, { params: options, observe: 'response' })
            .map((res: HttpResponse<LeaveBalance[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LeaveBalance = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<LeaveBalance[]>): HttpResponse<LeaveBalance[]> {
        const jsonResponse: LeaveBalance[] = res.body;
        const body: LeaveBalance[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to LeaveBalance.
     */
    private convertItemFromServer(leaveBalance: LeaveBalance): LeaveBalance {
        const copy: LeaveBalance = Object.assign({}, leaveBalance);
        return copy;
    }

    /**
     * Convert a LeaveBalance to a JSON which can be sent to the server.
     */
    private convert(leaveBalance: LeaveBalance): LeaveBalance {
        const copy: LeaveBalance = Object.assign({}, leaveBalance);
        return copy;
    }
}
