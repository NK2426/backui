import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Warehouse, User } from 'src/app/pages/purchaser/models/purchaseorder';
import { User, Warehouse } from 'src/app/pages/purchaser/models/user';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
// import { UsersService } from 'src/app/_helpers/users.service';
import { UsersService } from '../../../services/users.service';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss'],
  exportAs: 'ngbDatePicker',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdduserComponent implements OnInit {
  formData!: FormGroup;
  data: User = {};
  warehouses: Warehouse[] = [];
  checkid: any = '';
  roles: Array<{ id: number; name: string }> = [
    { id: 1, name: 'HR' },
    { id: 2, name: 'Category Head' },
    { id: 3, name: 'Purchaser' },
    { id: 4, name: 'Purchase Head' },
    { id: 5, name: 'Warehouse Operator' },
    // { id: 6, name: 'Vendor' },
    { id: 7, name: 'Web Team' },
    { id: 8, name: 'Finance' },
    { id: 9, name: 'Content Writer' },
    // { id: 10, name: 'Customer Support' },
    { id: 11, name: 'Content Manager' },
    // { id: 12, name: 'Picker' },
    // { id: 13, name: 'Packer' }
  ];

  statuses: Array<{ id: string; name: string }> = [
    { id: '1', name: 'Active' },
    { id: '0', name: 'Inactive' }
  ];
  empid: any;
  active = 1;
  submit: boolean = false;
  breadCrumbItems: Array<{}> = [];
  edit: boolean = false;
  passwordvalidate: boolean = true;
  count: number;
  maxDate: any = '';
  minDate: any = '';
  joinmaxDate: any = '';
  regex_name = '[a-zA-Z ]*';
  regax_number = '/[0-9+- ]/';
  regex = '^[0-9]+$';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private utiltiyservice: UtilsService,
    private userservice: UsersService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    var date = new Date();
    this.joinmaxDate = date.toISOString().slice(0, 16).split('T')[0];
    date.setFullYear(date.getFullYear() - 22);
    date.setMonth(11, 31);
    this.maxDate = date.toISOString().slice(0, 16).split('T')[0];
    date.setFullYear(date.getFullYear() - 78);
    date.setMonth(0, 1);
    this.minDate = date.toISOString().slice(0, 16).split('T')[0];

    this.formData = this.formBuilder.group(
      {
        uuid: [this.data.uuid, [Validators.required, Validators.minLength(3)]],
        firstname: [this.data.firstname, [Validators.required, Validators.minLength(3), Validators.pattern(this.regex_name)]],
        lastname: [this.data.lastname, [Validators.required, Validators.minLength(3), Validators.pattern(this.regex_name)]],
        username: [this.data.username, [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        cpassword: [''],
        email: [this.data.email, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
        mobile: [this.data.mobile, [Validators.required, Validators.minLength(10), Validators.pattern('[0-9]+'), Validators.maxLength(10)]],
        role: [this.data.role, [Validators.required]],
        // warehouse: '1',
        // warehouse: [this.data.warehouse, [Validators.required]],
        warehouse_id: [this.data.warehouse_id, [Validators.required]],
        dateofbirth: ['', [Validators.required]],
        dateofjoin: [this.data.dateofjoin, [Validators.required]],
        salary: [this.data.salary, [Validators.required, Validators.pattern(this.regex)]],
        address: [this.data.address, [Validators.required, Validators.minLength(3)]],
        status: ['1']
      },
      {
        validator: this.utiltiyservice.MustMatch('password', 'cpassword')
      }
    );

    this.userservice.getWarehouses().subscribe({
      next: (resp) => {
        this.warehouses = resp;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.toast.failure(err);
      }
    });

    if (history.state.uuid) {
      this.formData.get('password')?.setValidators([]);
      this.passwordvalidate = false;
      this.userservice.find(history.state.uuid).subscribe({
        next: (data) => {
          this.edit = true;
          this.data = data;
          this.formData.setValue({
            uuid: data.uuid,
            firstname: data.name,
            lastname: data.lastname || '',
            username: data.username,
            email: data.email,
            mobile: data.mobile,
            password: '',
            cpassword: '',
            role: data.roleID,
            warehouse: data.warehouse,
            warehouse_id: data.warehouse_id,
            dateofbirth: data.dateofbirth || '',
            dateofjoin: data.dateofjoin || '',
            salary: data.salary || '',
            address: data.address || '',
            status: data.status || '0'
          });
        }
      });
      this.cd.detectChanges();
    }
    //console.log(this.edit);

    // console.log(this.formData, this.empid);
  }

  setpasswordvalid(value: string) {
    if (this.edit === true) {
      if (value && value !== '') {
        this.passwordvalidate = true;
        this.formData.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      } else {
        this.passwordvalidate = false;
        this.formData.get('password')?.setValidators([]);
      }
      this.formData.get('password')?.updateValueAndValidity();
    }
  }
  get form() {
    return this.formData.controls;
  }
  getcountofROle(event: any) {
    // console.log(event.target.value);

    this.userservice.checkid(event.target.value).subscribe({
      next: (resp) => {
        // console.log(resp);
        this.count = resp.data;
        if (event.target.value == '3' || 3) {
          this.count++
        }
        this.changesRole(event.target.value, this.count)
        this.cd.detectChanges();
        // console.log(this.count);
      },
      error: (err) => {
        this.toast.failure(err);
      }
    });

  }

  changesRole(val: any, count: any) {
    // console.log(val, count);

    switch (val !== 0) {
      case val == 1:
        this.formData.get('uuid').setValue('HR00' + count);
        this.formData.get('username').setValue('HR00' + count);
        break;
      case val == 2:
        this.formData.get('uuid').setValue('CHEAD00' + count);
        this.formData.get('username').setValue('CHEAD00' + count);
        break;
      case val == 3:
        this.formData.get('uuid').setValue('EMP00' + count);
        this.formData.get('username').setValue('EMP00' + count);
        break;
      case val == 4:
        this.formData.get('uuid').setValue('PHEAD00' + count);
        this.formData.get('username').setValue('PHEAD00' + count);
        break;
      case val == 5:
        this.formData.get('uuid').setValue('WHO00' + count);
        this.formData.get('username').setValue('WHO00' + count);
        break;

      case val == 7:
        this.formData.get('uuid').setValue('WEB00' + count);
        this.formData.get('username').setValue('WEB00' + count);
        break;
      case val == 8:
        this.formData.get('uuid').setValue('FIN00' + count);
        this.formData.get('username').setValue('FIN00' + count);
        break;
      case val == 9:
        this.formData.get('uuid').setValue('CWR00' + count);
        this.formData.get('username').setValue('CWR00' + count);
        break;
      case val == 11:
        this.formData.get('uuid').setValue('CM00' + count);
        this.formData.get('username').setValue('CM00' + count);
        break;
      case val == 12:
        this.formData.get('uuid').setValue('PICK00' + count);
        this.formData.get('username').setValue('PICK00' + count);
        break;
      case val == 13:
        this.formData.get('uuid').setValue('PACK00' + count);
        this.formData.get('username').setValue('PACK00' + count);
        break;
      default:
        this.toast.failure("Select Role")
    }
    if (this.formData.get('role').value !== '') {
      this.formData.controls['uuid'].disable();
      this.formData.controls['username'].disable();
    }
  }

  // changeRole() {
  //   let role: any = this.formData.get('role').value;
  //   if (role == 1) {
  //     this.getcountofROle(1);
  //   } else if (role == 2) {
  //     this.formData.get('uuid').setValue('CHEAD000' + this.count);
  //     this.formData.get('username').setValue('CHEAD0' + this.count);
  //   } else if (role == 3) {
  //     this.formData.get('uuid').setValue(this.empid);
  //     this.formData.get('username').setValue(this.empid);
  //   } else if (role == 4) {
  //     this.formData.get('uuid').setValue('PHEAD000' + this.count);
  //     this.formData.get('username').setValue('PHEAD0' + this.count);
  //   } else if (role == 5) {
  //     this.formData.get('uuid').setValue('WHO000' + this.count);
  //     this.formData.get('username').setValue('WHO0' + this.count);
  //   } else if (role == 7) {
  //     this.formData.get('uuid').setValue('WEB000' + this.count);
  //     this.formData.get('username').setValue('WEB0' + this.count);
  //   } else if (role == 8) {
  //     this.formData.get('uuid').setValue('FIN000' + this.count);
  //     this.formData.get('username').setValue('FIN0' + this.count);
  //   } else if (role == 9) {
  //     this.formData.get('uuid').setValue('CWR000' + this.count);
  //     this.formData.get('username').setValue('HR0' + this.count);
  //   } else if (role == 11) {
  //     this.formData.get('uuid').setValue('CM000' + this.count);
  //     this.formData.get('username').setValue('CM0' + this.count);
  //   } else if (role == 12) {
  //     this.formData.get('uuid').setValue('PICK000' + this.count);
  //     this.formData.get('username').setValue('PICK0' + this.count);
  //   } else {
  //     this.formData.get('uuid').setValue('PACK000' + this.count);
  //     this.formData.get('username').setValue('PACK0' + this.count);
  //   }


  // }
  findRole(id: number) {
    // console.log('inside findrole');
    const role: any = this.roles.filter((res) => res.id === id);
    // console.log(role);
    return role.name ? role.name : '';
  }

  saveUser(): void {
    //console.log(this.formData.get('firstname'))
    this.formData.controls['uuid'].enable();
    this.formData.controls['username'].enable();
    this.submit = true;
    // console.log(this.formData.get('uuid'), this.empid);

    if (this.formData.invalid) {
      // console.log('invalid data');
      return;
    }
    let dob = new Date(this.formData.value.dateofbirth);
    if (this.maxDate < this.formData.value.dateofbirth || dob.getFullYear() < 1922) {
      this.toast.failure('Enter valid DOB');
      return;
    }
    if (this.edit) {
      this.userservice.update(this.formData.value).subscribe({
        next: (resp) => {
          //console.log(resp);
          this.toast.success('User Updated Successfully');
          this.data = {};
          this.formData.reset();
          this.submit = false;
          // this.router.navigate(['/hr/employees/' + resp.data.status]);
          this.router.navigate(['/hr/employees']);
        },
        error: (err) => {
          //console.log('update error');
          this.toast.failure(err);
        }
      });
      this.cd.detectChanges();
    } else {
      //console.log("create");
      this.userservice.create(this.formData.value).subscribe({
        next: (resp) => {
          //console.log(resp);
          // console.log(resp.data.username);

          this.data = {};
          // console.log(this.data.uuid);

          let msg =
            'User Created Successfully\n' + '<strong style="text-transform:uppercase">' + 'EMP ID:' + '<strong>' + resp.data.uuid + '\n';
          this.toast.infoSucess(msg);

          this.formData.reset();
          this.submit = false;
          // this.router.navigate(['/hr/employees/' + resp.data.status]);
          this.router.navigate(['/hr/employees']);
        },
        error: (err) => {
          // console.log('create error');
          if (err == 'Employee ID already exists')
            this.count++
          this.changesRole(this.formData.get('role').value, this.count)
          this.toast.failure(err);
        }
      });
      this.cd.detectChanges();
    }
  }
  setactive($event: any): void {
    this.active = $event;
  }
}
