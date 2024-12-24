import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Product, Productmap } from '../../models/product';
import { Productvariants } from '../../models/productvariants';
import { ProductsService } from '../../services/products.service';



@Component({
  selector: 'app-mapvariant',
  templateUrl: './mapvariant.component.html',
  styleUrls: ['./mapvariant.component.scss'],
  standalone: true,
  imports: [FormsModule,
    NgbPaginationModule,
    NgbDatepickerModule, CommonModule, RouterModule, ReactiveFormsModule, NgSelectModule]
})
export class MapvariantComponent implements OnInit {

  @Input() selectedProduct: Product = new Product;
  variants: Productvariants[] = [];
  @Output() editProduct = new EventEmitter<Product>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams: any = [];
  formVarValueData!: FormGroup;
  submit: Boolean = false;
  viewValue = false;
  productmaps: Productmap[] = [];
  selectedVar: any = '';

  constructor(private productsService: ProductsService, private modelservice: NgbModal, private toast: ToastService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.productmaps = this.selectedProduct.productsmaps || [];
    //console.log(this.selectedProduct)
    this.viewValue = true;
    this.formVarValueData = this.formBuilder.group({
      id: [''],
      product_id: [this.selectedProduct.pid],
      value: ['', [Validators.required]],
      order: ['', [Validators.pattern('[0-9]+'), Validators.minLength(1), Validators.maxLength(2)]]
    })
    this.productsService.variantlist(this.selectedProduct?.department_id).subscribe({
      next: variants => {
        this.variants = variants
      }
    })
  }

  saveProductVendor() {
    this.submit = true;
    if (this.formVarValueData.invalid) {
      return;
    }
    this.productsService.singlevarmap(this.formVarValueData.value, this.selectedProduct.uuid).subscribe({
      next: resp => {
        this.submit = false;
        this.toast.success('Successfully Saved');
        this.formVarValueData.reset();
        if (resp.data) {
          this.productmaps = resp.data
          this.selectedProduct.productsmaps = resp.data
        }
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    })
  }
  get form() {
    return this.formVarValueData.controls;
  }
  removeValue(i: number) {
    if (confirm('Are you sure you want to delete this value?')) {
      let editVal = this.productmaps[i]
      //console.log(editVal)
      if (editVal) {
        this.productsService.removeVar(editVal.id + '').subscribe({
          next: resp => {
            this.toast.success('Successfully Deleted');
            if (resp.data) {
              this.productmaps = resp.data
              this.selectedProduct.productsmaps = resp.data
            }
          }, error: err => {
            this.toast.failure(err.error.message);
          }
        })
      }
    }
  }
  editValue(i: number) {
    let editVal = this.productmaps[i]
    if (editVal) {
      this.formVarValueData.setValue({
        id: editVal.id,
        product_id: this.selectedProduct.pid,
        value: editVal.id,
        order: editVal.order
      });
      this.selectedVar = editVal.productvariant_id;
    }
  }
  clear() {
    this.formVarValueData.setValue({
      id: '',
      product_id: '',
      value: '',
      order: ''
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
