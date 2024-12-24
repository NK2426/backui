import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Warehouse } from '../../../models/warehouse';
import { WarehouseComponent } from '../../../warehouse.component';
import { WarehouseManagerService } from '../../../services/warehousemanager.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';

import { State } from 'src/app/pages/catalog/models/postalcodes';
@Component({
  selector: 'app-edit-warehouse',
  templateUrl: './edit-warehouse.component.html',
  styleUrls: ['./edit-warehouse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditWarehouseComponent implements OnInit {
  formData!: FormGroup;
  data: Warehouse = {};
  id: any;
  edit: boolean = false;
  states?: State[];
  submit: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private warehouservice: WarehouseManagerService,
    private toast: ToastService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      address1: ['', [Validators.required, Validators.minLength(6)]],
      billingaddress: ['', [Validators.required, Validators.minLength(6)]],
      address2: ['', [Validators.required, Validators.minLength(6)]],
      state_id: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.minLength(6)]],
      gstin: [this.data.gstin, [Validators.required, Validators.minLength(15), Validators.maxLength(15)]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(10), Validators.maxLength(10)]],
      status: ['1']
    });
    this.warehouservice.getStates().subscribe({
      next: (resp) => {
        this.states = resp.data;
        this.cdr.detectChanges()
      },
      error: (error) => { }
    });
    let id = this.route.snapshot.paramMap.get('id');
    this.id = id;

    // console.log(id);
    this.id = history.state.id;
    if (id) {
      // console.log('history if ok');
      this.warehouservice.view(id).subscribe({
        next: (data) => {
          this.data = data;
          this.edit = true;
          data.billingaddress = data.billingaddress.split('<br>').join('')
          this.formData.get('id')?.setValue(this.data.id || '');
          this.formData.get('name')?.setValue(this.data.name || '');
          this.formData.get('address')?.setValue(this.data.address || '');
          this.formData.get('address1')?.setValue(this.data.address1 || '');
          this.formData.get('address2')?.setValue(this.data.address2 || '');
          this.formData.get('billingaddress')?.setValue(this.data.billingaddress || '');
          this.formData.get('mobile')?.setValue(this.data.mobile || '');
          this.formData.get('pincode')?.setValue(this.data.pincode || '')
          this.formData.get('gstin')?.setValue(this.data.gstin || '')
          this.edit == true;
        },
        error: (err) => {
          console.log(err);
        }
      });

    }
  }
  get form() {
    return this.formData.controls;
  }
  saveUser() {
    let id = this.route.snapshot.paramMap.get('id');
    // console.log('save user');
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    // console.log(id);
    if (this.edit) {
      // console.log('edit update', this.formData.value);
      let search = this.formData.get('billingaddress').value;
      search = search.split(',').join(',</br>');
      this.formData.get('billingaddress').setValue(search);
      // console.log(search, this.formData.get('billingaddress').value);
      this.warehouservice.update(this.formData.value).subscribe({
        next: (resp) => {
          // console.log(resp);
          this.toast.success('Warehouse Updated Successfully');
          this.data = {};
          this.formData.reset();
          this.submit = false;
          this.router.navigate(['/warehouse/warehouse-list']);
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    }
  }

  getstatename(event: any) {
    // console.log(event.target.value);

    let id = this.states.filter((e) => {
      if (e.name == event.target.value) return e.id;
    });
    this.formData.get('state_id').setValue(id[0].id);
    this.cdr.detectChanges()

  }
}
