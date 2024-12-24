import { Injectable, TemplateRef } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: any[] = [];
  loadingterm: boolean = false;
  constructor() { }
  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
  }
  remove(toast: any) {
  }
  success(msg: string) {

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: msg,
      showConfirmButton: false,
      timer: 1500
    });
  }
  failure(msg: string) {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: msg,
      showConfirmButton: false,
      timer: 2000
    });
  }

  info(msg: string) {
    Swal.fire({
      //position: 'top-end',
      icon: 'warning',
      title: msg,
      showConfirmButton: true,
      //timer: 5000
    });
    //this.show(msg, {header:'Error !', classname: 'toastserr', delay: 3000 });
  }
  infoSucess(msg: string) {
    Swal.fire({
      //position: 'top-end',
      icon: 'success',
      title: msg,
      showConfirmButton: true,
      //timer: 5000
    });
    //this.show(msg, {header:'Error !', classname: 'toastserr', delay: 3000 });
  }
}
