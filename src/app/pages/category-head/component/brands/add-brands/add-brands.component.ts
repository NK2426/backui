/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Brands } from '../../../models/brands';
import { Department } from '../../../models/department';
import { Vendor } from '../../../models/purchaseorder';
import { BrandsService } from '../../../services/brands.service';
import { DepartmentsService } from '../../../services/departments.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'add-brands',
  templateUrl: './add-brands.component.html',
  styleUrls: ['./add-brands.component.scss']
})
export class AddBrandsComponent implements OnInit {

  @Input() data: Brands = {};
  @Output() refreshList = new EventEmitter<string>();
  formData!: FormGroup;
  submit: Boolean = false;
  statuses: Array<{ id: string, name: string }> = [];
  departments: Department[] = []
  vendors: Vendor[] = [];

  constructor(private brandsservice: BrandsService, private departmentservice: DepartmentsService, private toast: ToastService, private formBuilder: FormBuilder, private utilty: UtilsService, private productservice: ProductsService) {
  }
  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      uuid: [this.data.uuid],
      name: [this.data.name, [Validators.required, Validators.minLength(3)]],
      department_id: [this.data.department_id, [Validators.required]],//, [Validators.required]
      createdBy: [this.data.createdBy],
      vendor_id: [this.data.vendor_id, [Validators.required]],
      description: [this.data.description],
      status: [this.data.status]
    });
    this.statuses = this.utilty.getStatus();
    this.departmentservice.findList()
      .subscribe({
        next: data => {
          this.departments = data;
        },
        error: () => {
          this.departments = []
        }
      });
      this.formData.get('department_id').setValue('3')
    this.productservice.vendorlist().subscribe({
      next: vendors => {
        this.vendors = vendors
      }
    })
  }

  get form() {
    return this.formData.controls;
  }

  saveProductvariants(): void {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.data.uuid != null) {
      this.brandsservice.update(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('Brand Updated Successfully');
          this.refreshList.emit('refresh');
          this.data = {};
          this.formData.reset();
          this.submit = false;
        }, error: err => {
          this.toast.failure(err);
        }
      })
    } else {
      this.brandsservice.create(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('Brand Created Successfully');
          this.refreshList.emit('refresh');
          this.data = {}
          this.formData.reset();
        }, error: err => {
          this.toast.failure(err);
        }
      })
    }
  }
  cancelAction(): void {
    let type = 'cancel1';
    if (!this.data.uuid) {
      type = '';
    }
    this.refreshList.emit(type);
  }

}
