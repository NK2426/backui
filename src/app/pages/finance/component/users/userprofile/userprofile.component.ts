import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UsersService } from 'src/app/_helpers/users.service';
import { User } from '../../../models/purchaseorder';


@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserprofileComponent implements OnInit {

  public user = JSON.parse(localStorage.getItem('auth_user') || '{}');
  formData !: FormGroup
  pwdformData !: FormGroup
  submit: Boolean = false; pwdsubmit: Boolean = false;
  breadCrumbItems: Array<{}> = [];
  userData?: User

  constructor(private userservice: UsersService, private formBuilder: FormBuilder, private toast: ToastService, private modalService: NgbModal, private router: Router, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', url: '/app/dashboard' }, { label: 'Profile', active: true }];
    // this.formData = this.formBuilder.group({
    //   uid: '',
    //   uuid: '',
    //   roleID: [''],
    //   username: ['', [Validators.required]],
    //   name: ['', [Validators.required]],
    //   email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    //   mobile: ['', [Validators.required]],
    //   //password: ['']
    // });
    // if (this.user.uid != 1) {
    //   this.formData.get('roleID')?.setValidators([
    //     Validators.required
    //   ]);
    // }

    this.userservice.find(this.user.uuid).subscribe({
      next: resp => {
        this.userData = resp;
        // this.formData.patchValue({
        //   uuid: resp.uuid,
        //   //clientId: resp.clientId,
        //   roleID: resp.roleID,
        //   username: resp.username,
        //   name: resp.name,
        //   email: resp.email,
        //   mobile: resp.mobile,
        //   //password: ['']
        // });
        this.cd.detectChanges();
      }
    })
  }

  // get form() {
  //   return this.formData.controls;
  // }


  // saveUser(){
  //   this.submit = true;     

  //   if (this.formData.invalid)
  //   {
  //     return;
  //   }
  //   //this.data.clientId = this.user.clientId;
  //   this.userservice.editProfile(this.formData.value).subscribe({
  //     next: resp => {
  //       this.toast.success('Profile Updated Successfully');
  //       this.submit = false;
  //     },
  //     error: err => {
  //       this.toast.failure(err.error.message);
  //     }
  //   })
  // }

  changepwd(content: any) {
    this.modalService.open(content);

    this.pwdformData = this.formBuilder.group({
      uid: this.user.id,
      oldpassword: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmpassword: ['', [Validators.required]],
      //password: ['']
    });
  }

  get pwdform() {
    return this.pwdformData.controls;
  }

  savePwd() {
    this.pwdsubmit = true;
    if (this.pwdformData.invalid)
      return

    this.userservice.changepwd(this.pwdformData.value).subscribe({
      next: resp => {
        if (resp.status == 'success')
          this.toast.success('Password Updated Successfully');
        else if (resp.status == 'failure')
          this.toast.failure(resp.message);
        this.pwdsubmit = false;
        this.cancel()
        this.cd.detectChanges();
      },
      error: err => {
        this.toast.failure(err.error.message);
      }
    })
  }

  setActiveUser(content: any): void {

    this.modalService.open(content);
    //this.viewAction = true;
  }

  cancel() {
    this.modalService.dismissAll();
  }

}
