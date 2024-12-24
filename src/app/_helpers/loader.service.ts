import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private httpLoading$ = new ReplaySubject<boolean>(1);
  private pdfProgress$ = new ReplaySubject<boolean>(1);

  constructor() { }

  httpProgress(): Observable<boolean> {
    return this.httpLoading$.asObservable();
  }
  pdfProgress(): Observable<boolean> {
    return this.pdfProgress$.asObservable();
  }


  setHttpProgressStatus(inprogess: boolean) {
    this.httpLoading$.next(inprogess);
  }
}
