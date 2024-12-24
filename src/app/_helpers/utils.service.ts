import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {


  formatDate(d: any): any {
    if (d === null) {
      return null;
    }
    return [
      d.year,
      (d.month < 10 ? ('0' + d.month) : d.month),
      (d.day < 10 ? ('0' + d.day) : d.day),
    ].join('-');
  }
  parsedateval(d: any): object {
    let [year, month, date] = d.split("-");
    return { year: parseInt(year), month: parseInt(month), day: parseInt(date) }
  }
  getRequestParams(search: string, page: number, pageSize: number,): any {
    let params = { 'search': '', 'page': page, 'size': pageSize };
    if (search)
      params['search'] = search;
    if (page)
      params['page'] = page - 1;
    if (pageSize)
      params['size'] = pageSize;
    return params;
  }

  getStatus() {
    return [{ id: '1', name: 'Active' }, { id: '0', name: 'Inactive' }]
  }


  /*
  input  -   new Date()  Sat Dec 03 2022 17:44:07 GMT+0530 (India Standard Time)
  output - 2022-12-03
  */
  getAPIDateFormat(date: Date, formatToConvert: string = 'yyyy-MM-dd') {
    return format(date, formatToConvert);
  }

  /*
  input  
    date --> new Date()  Sat Dec 03 2022 17:44:07 GMT+0530 (India Standard Time)
    numberOfDaysToSubtract -- > 2
  output - 2022-12-01
  */
  substractDays(date: Date, numberOfDaysToSubtract: number) {
    return subDays(date, numberOfDaysToSubtract);
  }

  /*
    input  
      ngbDate --> {year: 2022, month: 12, day: 1}
    output - 2022-12-01
    */
  ngbDateFormatToAPIFormat(ngbDate: NgbDate, formatToConvert: string = 'yyyy-MM-dd') {
    let date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    return format(date, formatToConvert);
  }

  numberFormat(num: any) {
    if (num) {
      var ans = num.toLocaleString('en-IN', { currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return ans;
    } else return 0;
  }

  ngbStructure(date: Date): NgbDateStruct {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }
  }


  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };

    // @Pipe({ name: 'replaceUS' })
    // export class ReplaceUSPipe implements PipeTransform {
    //   transform(value: string): string {
    //     return value ? value.replace(/_/g, "/") : value;
    //   }
    // }
  }
  getsortRequestParams(search: string, column: string, direction: string, page: number, pageSize: number): any {
    let params = { 'search': '', 'page': page, 'size': pageSize, orderby: '', order: '' };
    if (search)
      params['search'] = search;
    if (page)
      params['page'] = page - 1;
    if (pageSize)
      params['size'] = pageSize;
    if (column)
      params['orderby'] = column;
    if (direction)
      params['order'] = direction;

    return params;
  }
}