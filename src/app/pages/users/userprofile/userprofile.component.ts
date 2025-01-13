import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDatepicker, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { User } from '../../hr/models/user';
import { UsersService } from '../../hr/services/users.service';
import { CommonModule } from '@angular/common';





@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone:true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule,RouterModule
  ],
  // exportAs:[NgbDatepicker]
})
export class UserprofileComponent implements OnInit {

  public user = JSON.parse(sessionStorage.getItem('token') || '{}');
  formData !: FormGroup
  pwdformData !: FormGroup
  submit: Boolean = false; pwdsubmit: Boolean = false;
  breadCrumbItems: Array<{}> = [];
  userData?: User
  rolename:any
  roles: Array<{ id: string; name: string }> = [
    { id: '0', name: 'ADMIN' },
    { id: '1', name: 'HR' },
    { id: '2', name: 'Category Head' },
    { id: '3', name: 'Purchaser' },
    { id: '4', name: 'Purchase Head' },
    { id: '5', name: 'Store Operator' },
    { id: '6', name: 'Vendor' },
    { id: '7', name: 'Web Team' },
    { id: '8', name: 'Finance' },
    { id: '9', name: 'Content Writer' },
    // { id: 10, name: 'Customer Support' },
    { id: '11', name: 'Content Manager' },
    { id: '12', name: 'Picker' },
    { id: '13', name: 'Packer' }
  ];
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

        let name = this.roles.filter(e=>e.id == this.userData.roleID)
        this.rolename = name[0].name

        // console.log(this.rolename);
        
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
