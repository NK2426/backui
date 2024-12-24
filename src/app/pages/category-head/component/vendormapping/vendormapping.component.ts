import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Product } from '../../models/product';
import { Vendor, Vendormapping } from '../../models/vendor';
import { ProductsService } from '../../services/products.service';


@Component({
  selector: 'app-vendormapping',
  templateUrl: './vendormapping.component.html',
  styleUrls: ['./vendormapping.component.scss'],
  standalone: true,
  imports: [FormsModule,
    NgbPaginationModule,
    NgbDatepickerModule, CommonModule, RouterModule, ReactiveFormsModule, NgSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendormappingComponent implements OnInit {

  @Input() selectedProduct: Product = new Product;
  @Input() vendors: Vendor[] = [];
  @Output() editProduct = new EventEmitter<Product>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams: any = [];
  formVendorValueData!: FormGroup;
  submit: Boolean = false;
  viewValue = false;
  vendormaps: Vendormapping[] = [];

  constructor(private productsService: ProductsService, private modelservice: NgbModal, private toast: ToastService, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.vendormaps[0] = this.selectedProduct.vendormapping || {};
    this.viewValue = true;
    this.formVendorValueData = this.formBuilder.group({
      id: [''],
      product_id: [this.selectedProduct.pid],
      value: ['', [Validators.required]],
    })
  }

  saveProductVendor() {
    this.submit = true;
    if (this.formVendorValueData.invalid) {
      return;
    }
    this.productsService.singlevendormap(this.formVendorValueData.value, this.selectedProduct.uuid).subscribe({
      next: resp => {
        this.submit = false;
        this.toast.success('Successfully Saved');
        this.formVendorValueData.reset();
        if (resp.data) {
          this.vendormaps[0] = resp.data[0]
          this.selectedProduct.vendormappings = resp.data[0]
          this.refreshList.emit('refresh');
        }
      }, error: err => {
        if (typeof err == 'string') this.toast.failure(err);
        else this.toast.failure(err.error.message);
      }
    })
  }
  get form() {
    return this.formVendorValueData.controls;
  }
  removeValue(i: number) {
    if (confirm('Are you sure you want to delete this value?')) {
      let editVal = this.vendormaps[i]
      //console.log(editVal)
      if (editVal) {
        this.productsService.removeVendor(editVal.id + '').subscribe({
          next: resp => {
            this.toast.success('Successfully Deleted');
            if (resp.data) {
              this.vendormaps[0] = resp.data[0]
              this.selectedProduct.vendormappings = resp.data[0]
            }
          }, error: err => {
            this.toast.failure(err.error.message);
          }
        })
      }
    }
  }
  editValue(i: number) {
    let editVal = this.vendormaps[i]
    if (editVal) {
      this.formVendorValueData.setValue({
        id: editVal.id,
        product_id: this.selectedProduct.pid,
        value: editVal.id,
      });
    }
  }
  clear() {
    this.formVendorValueData.setValue({
      id: '',
      product_id: '',
      value: '',
    });
  }
  // editAction(productvariant:Productvariants, value = ''): void{
  //   //productvariant.addValue = value===''?false:true;
  //   this.editProductvariant.emit(productvariant);
  // }
  editVariantValue(): void {
    this.viewValue = this.viewValue === true ? false : true;
  }

}
