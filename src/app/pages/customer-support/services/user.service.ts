import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { USER } from '../models/user';
import { EnvService } from './env.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    UsersApiUrl: string = `${environment.CUSTOMER_SUPPORT_BASE_URL}users`;
    siteurl: string = `${environment.siteUrl}`;


    constructor(private http: HttpClient, private env: EnvService) { }

    getUsersList(params: {}): Observable<USER.UserPagination> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<USER.UserPagination>(this.UsersApiUrl, option)
    }

    getUserProductRating(params: {}): Observable<USER.UserProductRatingPagination> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<USER.UserProductRatingPagination>(this.UsersApiUrl + '/userratings', option)
    }

    approveRating(data: any) {
        return this.http.post<any>(this.UsersApiUrl + '/userratings/approverating', data, this.env.httpOptions)
            .pipe(map(res => res))
    }

}
