import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PUSHNOTIFICATION } from '../models/notification';

import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    NotificationApiUrl: string = `${environment.CATALOG_BASE_URL}/notifications`;


    constructor(private http: HttpClient, private env: EnvService) { }

    // CREATE
    createNotification(jsonData: Partial<any>): Observable<any> {
        return this.http.post<any>(this.NotificationApiUrl, jsonData)
            .pipe(map(res => res));
    }

    // READ ONE
    getNotificationById(notificationID: string): Observable<PUSHNOTIFICATION.NotificationHttpResponse> {
        return this.http.get<PUSHNOTIFICATION.NotificationHttpResponse>(this.NotificationApiUrl + `/${notificationID}`);
    }

    // READ ALL
    getNotificaionList(params: {}): Observable<PUSHNOTIFICATION.NotificationsPaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<PUSHNOTIFICATION.NotificationsPaginate>(this.NotificationApiUrl, option);
    }



    // DELETE
    deleteNotification(notificationID: string): Observable<any> {
        return this.http.delete<any>(this.NotificationApiUrl + '/' + notificationID);
    }

    // Disable Notification
    disableNotification(notificationID: string): Observable<PUSHNOTIFICATION.NotificationHttpResponse> {
        return this.http.delete<PUSHNOTIFICATION.NotificationHttpResponse>(this.NotificationApiUrl + '/disable/' + notificationID);
    }


}
