import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
// import { UsersService } from 'src/app/_helpers/users.service';
import { UsersService } from '../../services/users.service';
// import { User, Warehouse } from 'src/app/pages/purchaser/models/user';
import { User, Warehouse } from '../../models/user';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  exportAs: 'ngbDatepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit {
  formData!: FormGroup;
  data: User = {};
  warehouses: Warehouse[] = [];
  roles: Array<{ id: number, name: string }> = [{ id: 1, name: 'HR' }, { id: 2, name: 'Category Head' }, { id: 3, name: 'Purchaser' }, { id: 4, name: 'Purchase Head' }, { id: 5, name: 'Warehouse Operator' }, { id: 6, name: 'Vendor' }, { id: 7, name: 'Web Team' }, { id: 8, name: 'Finance' }, { id: 9, name: 'Content Writer' }, { id: 10, name: 'Customer Support' }, { id: 11, name: 'Content Manager' }, { id: 12, name: 'Picker' }, { id: 13, name: 'Packer' }];

  statuses: Array<{ id: string, name: string }> = [{ id: '1', name: 'Active' }, { id: '0', name: 'Inactive' }];

  active = 1;
  submit: boolean = false;
  breadCrumbItems: Array<{}> = [];
  edit: boolean = false;
  passwordvalidate: boolean = true;
  uuid: any;

  maxDate: any = ''; minDate: any = ''; joinmaxDate: any = '';

  constructor(
    private route: ActivatedRoute, private router: Router,
    private userservice: UsersService, private toast: ToastService,
    private formBuilder: FormBuilder,
    private utiltiyservice: UtilsService, private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    var date = new Date();
    this.joinmaxDate = (date.toISOString().slice(0, 16)).split('T')[0];
    date.setFullYear(date.getFullYear() - 22);
    date.setMonth(11, 31)
    this.maxDate = (date.toISOString().slice(0, 16)).split('T')[0];
    date.setFullYear(date.getFullYear() - 78);
    date.setMonth(0, 1)
    this.minDate = (date.toISOString().slice(0, 16)).split('T')[0];

    this.formData = this.formBuilder.group({
      uuid: [''],
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpassword: [''],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(10), Validators.maxLength(10)]],
      role: ['', [Validators.required]],
      warehouse: '1',
      warehouse_id: [''],
      dateofbirth: ['', [Validators.required]],
      dateofjoin: ['', [Validators.required]],
      salary: [''],
      address: [''],
      status: ['1'],

    }, {
      validator: this.utiltiyservice.MustMatch('password', 'cpassword'),
    });

    let uuid = this.route.snapshot.paramMap.get('uuid');
    this.uuid = uuid;
    //console.log(uuid);
    this.uuid = history.state.uuid;

    this.userservice.getWarehouses().subscribe({
      next: resp => {
        this.warehouses = resp;
        this.ref.detectChanges();
        //console.log(resp);
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    })


    // //console.log(history.state.uuid);
    if (uuid) {
      //console.log("history if ok");
      this.formData.get('password')?.setValidators([]);
      this.passwordvalidate = false;
      this.userservice.find(uuid)
        .subscribe({
          next: date => {
            this.data = date;
            //console.log(this.data);
            this.edit = true;
            this.formData.get('uuid')?.setValue(this.data.uuid || '');
            this.formData.get('firstname')?.setValue(this.data.name || '');
            this.formData.get('lastname')?.setValue(this.data.lastname || '');
            this.formData.get('username')?.setValue(this.data.username || '');
            this.formData.get('email')?.setValue(this.data.email || '');
            this.formData.get('mobile')?.setValue(this.data.mobile || '');
            this.formData.get('password')?.setValue(this.data.password || '');
            this.formData.get('cpassword')?.setValue('');
            this.formData.get('role')?.setValue(this.data.roleID || '');
            this.formData.get('warehouse_id')?.setValue(this.data.warehouse_id || '1');
            this.formData.get('dateofbirth')?.setValue(this.data.dateofbirth || '');
            this.formData.get('dateofjoin')?.setValue(this.data.dateofjoin || '');
            this.formData.get('salary')?.setValue(this.data.salary || '');
            this.formData.get('address')?.setValue(this.data.address || '');
            this.formData.get('status')?.setValue(this.data.status || '0');
          },
          error: err => {
            //console.log(err);
          }
        })
      // .subscribe({
      //   next: data => {
      //     //console.log('history next ok');
      //     this.edit = true;
      //     this.data = data;
      //     //console.log(data);
      //     this.formData.setValue({
      //       uuid: data.uuid,
      //       firstname: data.name,
      //       lastname: data.lastname || '',
      //       username: data.username,
      //       email: data.email,
      //       mobile: data.mobile,
      //       password: '',
      //       cpassword: '',
      //       role: data.roleID,
      //       warehouse: '1',
      //       warehouse_id: data.warehouse_id,
      //       dateofbirth: data.dateofbirth || '',
      //       dateofjoin: data.dateofjoin || '',
      //       salary: data.salary || '',
      //       address: data.address || '',
      //       status: data.status || '0',
      //     })
      //     //console.log(this.formData);
      //   },
      //   error: err => {
      //     //console.log(err);
      //     //console.log('error data');
      //   }
      // })
    }
    this.formData.get('username')?.disable()
    //console.log(this.edit)
  }

  setpasswordvalid(value: string) {
    if (this.edit === true) {
      if (value && value !== '') {
        this.passwordvalidate = true;
        this.formData.get('password')?.setValidators([
          Validators.required,
          Validators.minLength(6)
        ]);
      } else {
        this.passwordvalidate = false;
        this.formData.get('password')?.setValidators([]);
      }
      this.formData.get('password')?.updateValueAndValidity()
    }
  }
  get form() {
    return this.formData.controls;
  }
  findRole(id: number) {
    const role: any = this.roles.filter(res => res.id === id)
    return role.name ? role.name : '';
  }
  saveUser(status: string = 'Draft') {
    // //console.log("save user");
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    let dob = new Date(this.formData.value.dateofbirth);
    if (this.maxDate < this.formData.value.dateofbirth || dob.getFullYear() < 1922) {
      this.toast.failure('Enter valid DOB');
      return;
    }
    //console.log(this.edit);
    if (this.edit) {
      //console.log("edit update")
      this.userservice.update(this.formData.value).subscribe({
        next: resp => {
          //console.log(resp);
          this.toast.success('User Updated Successfully');
          this.data = {};
          this.formData.reset();
          this.submit = false;
          this.router.navigate(['/hr/employees']);
        }, error: err => {
          this.toast.failure(err);
        }
      })
    } else {
      //console.log("edit create")
      this.userservice.create(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('User Created Successfully');
          this.data = {}
          this.formData.reset();
          this.submit = false;
          this.router.navigate(['/hr/employees' + resp.data.status]);
        }, error: err => {
          this.toast.failure(err);
        }
      })
    }
  }
  onNavChange($event: any): void {
  }
  setactive($event: any): void {
    this.active = $event;
  }
}
