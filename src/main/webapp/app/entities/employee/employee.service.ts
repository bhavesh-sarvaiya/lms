import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Employee } from './employee.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Employee>;

@Injectable()
export class EmployeeService {

    private resourceUrl =  SERVER_API_URL + 'api/employees';
    private resourceUrl1 =  SERVER_API_URL + 'api/employee';
    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(employee: Employee): Observable<EntityResponseType> {
        const copy = this.convert(employee);
        return this.http.post<Employee>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(employee: Employee): Observable<EntityResponseType> {
        const copy = this.convert(employee);
        return this.http.put<Employee>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Employee>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    loadEmployeeByUser(id: any): Observable<EntityResponseType> {
        return this.http.get<Employee>(`api/employee/id/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Employee[]>> {
        const options = createRequestOption(req);
        return this.http.get<Employee[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Employee[]>) => this.convertArrayResponse(res));
    }
    query1(teachingstaff: boolean, canHaveVacation: boolean, granted: boolean): Observable<HttpResponse<Employee[]>> {
        const options = createRequestOption({teachingstaff, canHaveVacation, granted});
        return this.http.get<Employee[]>(this.resourceUrl1, { params: options, observe: 'response' })
            .map((res: HttpResponse<Employee[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Employee = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Employee[]>): HttpResponse<Employee[]> {
        const jsonResponse: Employee[] = res.body;
        const body: Employee[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Employee.
     */
    private convertItemFromServer(employee: Employee): Employee {
        const copy: Employee = Object.assign({}, employee);
        copy.dob = this.dateUtils
            .convertLocalDateFromServer(employee.dob);
        copy.joinDate = this.dateUtils
            .convertLocalDateFromServer(employee.joinDate);
        copy.retiredDate = this.dateUtils
            .convertLocalDateFromServer(employee.retiredDate);
        return copy;
    }

    /**
     * Convert a Employee to a JSON which can be sent to the server.
     */
    private convert(employee: Employee): Employee {
        const copy: Employee = Object.assign({}, employee);
        copy.dob = this.dateUtils
            .convertLocalDateToServer(employee.dob);
        copy.joinDate = this.dateUtils
            .convertLocalDateToServer(employee.joinDate);
        copy.retiredDate = this.dateUtils
            .convertLocalDateToServer(employee.retiredDate);
        return copy;
    }
}
