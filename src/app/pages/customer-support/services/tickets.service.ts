import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TICKET } from '../models/ticket';
import { USER } from '../models/user';
import { EnvService } from './env.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TicketsService {

    TicketsAPIBaseURL: string = `${environment.CUSTOMER_SUPPORT_BASE_URL}tickets`;
    siteurl: string = `${environment.CATEGORY_HEAD_BASE_URL}`;


    constructor(private http: HttpClient, private env: EnvService) { }

    getAllTicket(params: {}, status?: string): Observable<TICKET.TicketsPaginated> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        let url = ''
        if (status === '' || !status) {
            url = this.TicketsAPIBaseURL;
        } else {
            url = this.TicketsAPIBaseURL + '/status/' + status
        }
        return this.http.get<TICKET.TicketsPaginated>(url, option)
    }

    getTicketByStatus(params: {}, ticketStatus: string): Observable<TICKET.TicketsPaginated> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<TICKET.TicketsPaginated>(this.TicketsAPIBaseURL + '/status/' + ticketStatus, option)
    }

    getTicketDetailById(ticketID: string | null): Observable<TICKET.Ticket> {
        return this.http.get<TICKET.Ticket>(this.TicketsAPIBaseURL + '/' + ticketID)
    }

    getcsteam(): Observable<Partial<USER.UserDetail[]>> {
        return this.http.get<Partial<USER.UserDetail[]>>(this.TicketsAPIBaseURL + '/getcsteam', this.env.httpOptionsparams)
    }


}
