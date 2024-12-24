import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Router } from '@angular/router';
import { NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { State, VCategory, Vendor, VendorAgent } from '../../../models/vendor';
import { VendorService } from '../../../services/vendor.service';
import { PurchaseorderService } from 'src/app/pages/purchaser/services/purchaseorder.service';
import { Paymentterm } from 'src/app/pages/purchaser/models/purchaseorder';

@Component({
  selector: 'app-editvendor',
  templateUrl: './editvendor.component.html',
  styleUrls: ['./editvendor.component.scss']
})
export class EditvendorComponent implements OnInit {
  formData!: FormGroup;
  data: Vendor = {};

  vendor: VendorAgent[] = [];
  category: VCategory[] = [];
  roles: Array<{ id: number; name: string }> = [
    { id: 1, name: 'HR' },
    { id: 2, name: 'Category Head' },
    { id: 3, name: 'Purchaser' },
    { id: 4, name: 'Purchase Head' },
    { id: 5, name: 'Warehouse Operator' }
  ];

  statuses: Array<{ id: string; name: string }> = [
    { id: '1', name: 'Active' },
    { id: '0', name: 'Inactive' }
  ];

  active = 1;
  submit: boolean = false;
  breadCrumbItems: Array<{}> = [];
  edit: boolean = false;
  passwordvalidate: boolean = true;

  states?: State[];

  paymentterms: Paymentterm[] = [];

  regex_name = '[a-zA-Z ]*';
  regax_number = '/[0-9+- ]/';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userservice: VendorService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private utiltiyservice: UtilsService,
    private porderservice: PurchaseorderService
  ) { }

  ngOnInit(): void {
    let uuid = this.route.snapshot.paramMap.get('uuid');
    this.formData = this.formBuilder.group(
      {
        uuid: [''],
        agentId: [''],
        vcategory: [''],
        state_name: [''],
        name: [this.data.name, [Validators.required, Validators.minLength(4)]],
        firstname: [this.data.firstname, [Validators.required, Validators.minLength(3), Validators.pattern(this.regex_name)]],
        lastname: [this.data.lastname],
        username: [this.data.username, [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        cpassword: [''],
        email: [this.data.email, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
        mobile: [this.data.mobile, [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(10), Validators.maxLength(10)]],
        website: [this.data.website],
        addnumber: [this.data.addnumber, [Validators.pattern('[0-9]+'), Validators.minLength(10), Validators.maxLength(10)]],
        gstin: [this.data.gstin, [Validators.pattern('^[a-zA-Z0-9_]*$')]],
        taxtype: [this.data.taxtype || '0', [Validators.required, Validators.pattern('[0-1]+')]],
        tin: [this.data.tin, [Validators.pattern('[0-9]+')]],
        paymentterm_id: [this.data.paymentterm_id, [Validators.required]],
        address: [this.data.address, [Validators.required]],
        address2: [this.data.address2, [Validators.required]],
        city: [this.data.city, [Validators.required]],
        state: [this.data.state, [Validators.required]],
        zipcode: [this.data.zipcode, [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(6)]],
        bphone: [this.data.bphone, [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(6), Validators.maxLength(10)]],
        saddress: [this.data.saddress, [Validators.required]],
        saddress2: [this.data.saddress2, [Validators.required]],
        scity: [this.data.scity, [Validators.required]],
        sstate: [this.data.sstate, [Validators.required]],
        szipcode: [this.data.szipcode, [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(6)]],
        sphone: [this.data.sphone, [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(6), Validators.maxLength(10)]],
        status: ['1'],
        vendrodetail_id: [''],
        address_id: [''],
        address2_id: [''],
        sameasbill: [0],
        //vendorId:['', [Validators.required, Validators.minLength(2)]]
        account_name: [this.data.account_name, [Validators.minLength(3)]],
        //sku: [this.data.sku, [Validators.required, Validators.minLength(3)]],
        account_no: [this.data.account_no, [Validators.pattern('[0-9]+'), Validators.minLength(6)]],
        bankname: [this.data.bankname],
        ifsc: [this.data.ifsc]
      },
      {
        validator: this.utiltiyservice.MustMatch('password', 'cpassword')
      }
    );
    this.userservice.getStates().subscribe({
      next: (resp) => {
        this.states = resp.data;
      },
      error: (error) => { }
    });
    if (uuid) {
      this.formData.get('password')?.setValidators([]);
      this.passwordvalidate = false;
      let data = {};
      this.userservice.find(uuid).subscribe({
        next: (data) => {
          if (data) {
            let vendor = data.vendor || {};
            let vendordetail = vendor.vendordetail || {};
            let baddress = data.address[0] || {};
            let saddress2 = data.address[1] || {};
            this.edit = true;

            this.formData.setValue({
              agentId: vendordetail?.agentId,
              vcategory: vendordetail?.vcategory,
              uuid: vendor?.uuid,
              name: vendor?.name,
              email: vendor?.email || '',
              mobile: vendor?.mobile || '',
              username: vendor.username || '',
              taxtype: vendor?.taxtype || 0,
              password: '',
              cpassword: '',
              firstname: vendordetail?.firstname || '',
              lastname: vendordetail?.lastname || '',
              website: vendordetail?.website || '',
              addnumber: vendordetail?.mobile || '',
              gstin: vendordetail?.gstin || '',
              tin: vendordetail?.tin || '',
              paymentterm_id: vendordetail?.paymentterm_id || '',
              address: baddress?.address || '',
              address2: baddress?.address2 || '',
              city: baddress?.city || '',
              state: baddress?.state_id || '',
              zipcode: baddress?.zipcode || '',
              bphone: baddress?.phone || '',
              saddress: saddress2?.address || '',
              saddress2: saddress2?.address2 || '',
              scity: saddress2?.city || '',
              sstate: saddress2?.state_id || '',
              szipcode: saddress2?.zipcode || '',
              sphone: saddress2?.phone || '',
              status: vendor.status,
              vendrodetail_id: vendordetail.id || '',
              address_id: baddress.id || '',
              address2_id: saddress2.id || '',
              sameasbill: 0,
              account_name: vendordetail?.account_name,
              account_no: vendordetail?.account_no,
              ifsc: vendordetail?.ifsc,
              bankname: vendordetail?.bankname
              //vendorId : vendordetail.vendorId
            });
          }
          // console.log(this.formData.value);
        }
      });
    }

    this.getagent();
    this.getCategory();
    this.paymentermlist();
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
  findRole(id: number) {
    const role: any = this.roles.filter((res) => res.id === id);
    return role.name ? role.name : '';
  }
  saveVendor(): void {
    this.submit = true;
    // console.log(this.formData.get('state').value);
    // console.log(this.formData);

    if (this.formData.invalid) {
      return;
    }
    if (this.formData.get('agentId').value == '' || this.formData.get('vcategory').value == '') {
      this.toast.failure('please select vendor agent and category');
    } else {
      if (this.edit) {
        this.userservice.update(this.formData.value).subscribe({
          next: (resp) => {
            //console.log(resp)
            this.toast.success('Vendor Updated Successfully');
            this.data = {};
            this.formData.reset();
            this.submit = false;
            this.router.navigate(['/category-head/vendors']);
          },
          error: (err) => {
            this.toast.failure(err);
          }
        });
      } else {
        // console.log(this.formData.get('state_name').value.name);

        this.userservice.create(this.formData.value).subscribe({
          next: (resp) => {
            this.toast.success('Vendor Created Successfully');
            this.data = {};
            this.formData.reset();
            this.router.navigate(['/category-head/vendors']);
          },
          error: (err) => {
            if (typeof err === 'string') {
              this.toast.failure(err);
            } else {
              this.toast.failure(err);
            }
          }
        });
      }
    }
  }
  onNavChange($event: any): void { }
  getagent() {
    this.userservice.getagentid().subscribe({
      next: (resp) => {
        // console.log(resp.datas);
        this.vendor = resp.datas;
        // console.log(this.vendor.length, this.vendor[this.vendor.length - 1]?.id);
        this.formData.get('agentId').setValue(this.vendor[this.vendor.length - 1]?.id);
      },
      error: (err) => {
        this.toast.failure(err);
      }
    });
  }
  getCategory() {
    this.userservice.getcategory().subscribe({
      next: (resp) => {
        // console.log(resp.datas);
        this.category = resp.datas;
      },
      error: (err) => {
        this.toast.failure(err);
      }
    });
  }
  setactive($event: any): void {
    this.active = $event;
  }

  same($event: any) {
    if ($event.target.checked == true) {
      this.formData.get('saddress')?.setValue(this.formData.get('address')?.value);
      this.formData.get('saddress2')?.setValue(this.formData.get('address2')?.value);
      this.formData.get('scity')?.setValue(this.formData.get('city')?.value);
      this.formData.get('sstate')?.setValue(this.formData.get('state')?.value);
      this.formData.get('szipcode')?.setValue(this.formData.get('zipcode')?.value);
      this.formData.get('sphone')?.setValue(this.formData.get('bphone')?.value);
    } else {
      this.formData.get('saddress')?.setValue('');
      this.formData.get('saddress2')?.setValue('');
      this.formData.get('scity')?.setValue('');
      this.formData.get('sstate')?.setValue('');
      this.formData.get('szipcode')?.setValue('');
      this.formData.get('sphone')?.setValue('');
    }
  }

  sameaddress(val: any) {
    if (val) {
      if (this.formData.get('sameasbill')?.value == 1) {
        if (val.target.name == 'bphone') {
          this.formData.get('sphone')?.setValue(val.target.value);
        } else this.formData.get('s' + val.target.name)?.setValue(val.target.value);
      }
    }
    if (this.formData.get('state').value) {
      this.userservice.getStateid(this.formData.get('state').value).subscribe({
        next: (resp) => {
          // console.log(resp.name);
          this.formData.get('state_name').setValue(resp.name);
        },
        error: (error) => { }
      });
    }
  }

  paymentermlist() {
    this.porderservice.paymenttermlist().subscribe({
      next: (data: any) => {
        this.paymentterms = data;
      }
    });
  }
}
