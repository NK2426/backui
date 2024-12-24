import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EnvService } from './env.service';
import { Attendance, Attendancepaginate } from '../models/attendance';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  UserApiUrl: string = environment.PURCHASE_BASE_URL + '/attendance';

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Attendancepaginate> {
    let option = this.env.httpOptionswithParams;
    option['params'] = params;
    return this.http.get<Attendancepaginate>(this.UserApiUrl, option);
  }

  find(uuid: string): Observable<Attendance> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.UserApiUrl + '/' + uuid, option)
      .pipe(map(res => res.data))
  }

  updatelogofftime(uid: number): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.put<any>(this.UserApiUrl + '/' + uid, option)
      .pipe(map(res => res.data))
  }
}
