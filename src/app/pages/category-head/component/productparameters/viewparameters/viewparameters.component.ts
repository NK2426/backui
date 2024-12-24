import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Productparameters, Productparametersvalues } from '../../../models/productparameters';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { Subcategories } from '../../../models/subcategories';
import { ProductparametersService } from '../../../services/productparameters.service';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';

@Component({
  selector: 'app-viewparameters',
  templateUrl: './viewparameters.component.html',
  styleUrls: ['./viewparameters.component.scss']
})
export class ViewparametersComponent implements OnInit {

  @Input() selectedProductparameter: Productparameters = new Productparameters;
  @Output() editProductparameter = new EventEmitter<Productparameters>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams: any = [];
  formParameterValueData!: FormGroup;
  submit: Boolean = false;
  viewValue = false;
  deleteaction = false;
  parametersvalues: Productparametersvalues[] = [];
  subcategories: Subcategories[] = []
  subclassArray: any = [];
  constructor(private productparameters: ProductparametersService, private modelservice: NgbModal, private toast: ToastService, private formBuilder: FormBuilder, private productservice: ProductsService) { }


  ngOnInit(): void {
    this.parametersvalues = this.selectedProductparameter.productparametervalues || [];

    if (this.selectedProductparameter.addValue === true)
      this.viewValue = true;

    this.formParameterValueData = this.formBuilder.group({
      id: [''],
      parameter_id: [''],
      value: ['', [Validators.required]],
      ordering: ['', [Validators.pattern('[0-9]+'), Validators.minLength(1), Validators.maxLength(2)]],
    })
    this.productparameters.findparamassoc(this.selectedProductparameter.id).subscribe({
      next: resp => {
        if (resp.data.length == 0)
          this.deleteaction = true;
      }, error: err => {
        console.log(err);
      }
    })

    // this.productservice.getcatlist(this.selectedProductparameter?.category_id).subscribe({
    //   next: data => {
    //     this.subcategories = data.subcategories
    //     let docs:any = this.selectedProductparameter?.subcategory_id?.split(',');
    //             this.subclassArray = data.subcategories.filter((r1:any) => docs.some((r2:any) => r1.id == r2));
    //   },
    //   error: () => {
    //     //this.departments = []
    //   }
    // });
  }
  saveProductparameterValues() {
    this.submit = true;
    if (this.formParameterValueData.invalid) {
      return;
    }

    let parametervalue = this.formParameterValueData.value;
    if (parametervalue.value) {
      parametervalue.value = parametervalue.value.replace(/(\r\n|\n|\r)/gm, "");

      let values = parametervalue.value.split(',')
      if (new Set(values).size !== values.length) {
        this.toast.failure('Duplicate Value Exists.. Please Check');
        return
      }
    }



    this.productparameters.values(this.formParameterValueData.value, this.selectedProductparameter.uuid).subscribe({
      next: resp => {
        this.submit = false;
        this.toast.success('Successfully Saved');
        this.formParameterValueData.reset();
        if (resp.data) {
          this.parametersvalues = resp.data
          this.selectedProductparameter.productparametervalues = resp.data
        }

      }, error: err => {
        this.toast.failure(err);
      }
    })
    this.modelservice.dismissAll();
  }
  get form() {
    return this.formParameterValueData.controls;
  }
  removeValue(i: number) {
    if (confirm('Are you sure you want to delete this value?')) {
      let editVal = this.parametersvalues[i]
      if (editVal) {
        this.productparameters.deleteValue(editVal.id + '').subscribe({
          next: resp => {
            this.toast.success('Successfully Deleted');
            if (resp.data) {
              this.parametersvalues = resp.data
              this.selectedProductparameter.productparametervalues = resp.data
            }
          }, error: err => {
            this.toast.failure(err.error.message);
          }
        })
      }
    }
  }
  editValue(i: number) {
    let editVal = this.parametersvalues[i]
    if (editVal) {
      this.formParameterValueData.setValue({
        id: editVal.id,
        parameter_id: editVal.parameter_id,
        value: editVal.value,
        ordering: editVal.ordering || '',
      });
    }
  }
  clear() {
    this.formParameterValueData.setValue({
      id: '',
      parameter_id: '',
      value: '',
      ordering: '',
    });
  }
  editParameterValue(): void {
    this.viewValue = this.viewValue === true ? false : true;
  }

  editAction(productparameter: Productparameters, value = ''): void {
    productparameter.addValue = value === '' ? false : true;
    this.editProductparameter.emit(productparameter);
  }

  deleteParameter(productparameter: Productparameters): void {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Product parameter Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then((parameterResponse) => {
      this.productparameters.delete(productparameter).subscribe({
        next: resp => {
          if (resp.status == 200)
            this.toast.success('Product parameter Deleted Successfully');
          else
            this.toast.failure(resp.message);
          this.toast.success('Product parameter Deleted Successfully');
          this.refreshList.emit('refresh');
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })   
    },err=>{
      //console.log(err);
    });
  }
}
