import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Productvariants, Productvariantsvalues } from '../../../models/productvariants';
import { ProductvariantsService } from '../../../services/productvariants.service';

@Component({
  selector: 'app-view-productvariants',
  templateUrl: './view-productvariants.component.html',
  styleUrls: ['./view-productvariants.component.scss']
})
export class ViewProductvariantsComponent implements OnInit {


  @Input() selectedProductvariant: Productvariants = new Productvariants;
  @Output() editProductvariant = new EventEmitter<Productvariants>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams: any = [];
  formVaraiantValueData!: FormGroup;
  submit: Boolean = false;
  viewValue = false
  variantsvalues: Productvariantsvalues[] = [];
  deleteaction = false;
  addfile: string = '';
  baseurl: string = '';
  fileName: any = '';
  constructor(private productvariants: ProductvariantsService, private modelservice: NgbModal, private toast: ToastService, private formBuilder: FormBuilder, private env: EnvService) { }


  ngOnInit(): void {
    this.baseurl = this.env.SITE_URL;
    this.variantsvalues = this.selectedProductvariant.productvariantvalues || [];
    // console.log(this.selectedProductvariant);
    this.fileName == this.selectedProductvariant.refimg || ''
    this.fileName = this.selectedProductvariant.refimg || '';
    if (this.selectedProductvariant.addValue === true)
      this.viewValue = true;

    this.formVaraiantValueData = this.formBuilder.group({
      id: [''],
      variant_id: [''],
      imgicon: [''],
      value: ['', [Validators.required]],
      ordering: ['', [Validators.pattern('[0-9]+'), Validators.minLength(1), Validators.maxLength(4)]],
    })
    this.productvariants.findvarassoc(this.selectedProductvariant.id).subscribe({
      next: resp => {
        if (resp.data.length == 0)
          this.deleteaction = true;
      }, error: err => {
        console.log(err);
      }
    })
  }

  saveProductvariantValues() {
    this.submit = true;
    if (this.formVaraiantValueData.invalid) {
      return;
    }

    let variantvalue = this.formVaraiantValueData.value;
    if (variantvalue.value) {
      variantvalue.value = variantvalue.value.replace(/(\r\n|\n|\r)/gm, "");

      let values = variantvalue.value.split(',')
      if (new Set(values).size !== values.length) {
        this.toast.failure('Duplicate Value Exists.. Please Check');
        return
      }
    }
    // this.productvariants.values(this.formVaraiantValueData.value, this.selectedProductvariant.uuid).subscribe({
    //   next: resp => {
    //     this.submit = false;
    //     console.log(resp.data);
    //     this.toast.success('Successfully Saved');
    //     this.formVaraiantValueData.reset();
    //     if (resp.data) {
    //       this.variantsvalues = resp.data
    //       this.selectedProductvariant.productvariantvalues = resp.data
    //       console.log( this.selectedProductvariant.productvariantvalues);

    //     }
    //     this.modelservice.dismissAll();
    //   }, error: err => {
    //     this.toast.failure(err);
    //   }
    // })



    // if(this.selectedProductvariant.showtype == 'Image' && this.addfile!=null)
    // {

    //   // if(this.formVaraiantValueData.value.imgicon == ''){

    //   //   this.toast.failure('Please add Image Icon')
    //   //   return
    //   // }

    //   const formd: any = new FormData();
    //   formd.append('imgicon', this.addfile);
    //   formd.append('variant_id', this.formVaraiantValueData.value.variant_id);
    //   formd.append('value', this.formVaraiantValueData.value.value);
    //   formd.append('ordering', this.formVaraiantValueData.value.ordering);
    //   this.productvariants.singleValueimg(formd,this.selectedProductvariant.uuid).subscribe({
    //     next:resp => {
    //       this.submit = false;
    //       this.toast.success('Successfully Saved');
    //       this.formVaraiantValueData.reset();
    //       if(resp){
    //         this.variantsvalues = resp
    //         this.selectedProductvariant.productvariantvalues = resp
    //       }
    //     },error: err=>{
    //       this.toast.failure(err.error.message);
    //     }
    //   })
    // }
    // else
    // {
    this.formVaraiantValueData.get('imgicon').setValue("")
    this.productvariants.values(this.formVaraiantValueData.value, this.selectedProductvariant.uuid).subscribe({
      next: resp => {
        this.submit = false;
        // console.log(resp.data);
        this.toast.success('Successfully Saved');
        this.formVaraiantValueData.reset();
        if (resp.data) {
          this.variantsvalues = resp.data
          this.selectedProductvariant.productvariantvalues = resp.data
          // console.log(this.selectedProductvariant.productvariantvalues);
        }
        this.modelservice.dismissAll();
      }, error: err => {
        this.toast.failure(err);
      }
    })
    // } 

  }
  get form() {
    return this.formVaraiantValueData.controls;
  }
  removeValue(i: number) {
    if (confirm('Are you sure you want to delete this value?')) {
      let editVal = this.variantsvalues[i]
      if (editVal) {
        this.productvariants.deleteValue(editVal.id + '').subscribe({
          next: resp => {
            this.toast.success('Successfully Deleted');
            if (resp.data) {
              this.variantsvalues = resp.data
              this.selectedProductvariant.productvariantvalues = resp
            }
          }, error: err => {
            this.toast.failure(err.error.message);
          }
        })
      }
    }
  }
  editValue(i: number) {
    let editVal = this.variantsvalues[i]
    if (editVal) {
      this.fileName = editVal.imgicon;

      this.formVaraiantValueData.setValue({
        id: editVal.id,
        variant_id: editVal.variant_id,
        value: editVal.value,
        imgicon: '',
        ordering: editVal.ordering || '',
      });
    }
  }
  clear() {
    this.fileName = '';
    this.formVaraiantValueData.setValue({
      id: '',
      variant_id: '',
      value: '',
      imgicon: '',
      ordering: '',
    });
  }
  editAction(productvariant: Productvariants, value = ''): void {
    //productvariant.addValue = value===''?false:true;
    this.editProductvariant.emit(productvariant);
  }
  editVariantValue(): void {
    this.viewValue = this.viewValue === true ? false : true;
  }

  deleteParameter(productvariant: Productvariants): void {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Product Variant Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then((parameterResponse) => {
      this.productvariants.delete(productvariant).subscribe({
        next: resp => {
          if (resp.status == 200)
            this.toast.success('Product Variant Deleted Successfully');
          else
            this.toast.failure(resp.message);
          this.refreshList.emit('refresh');
        }, error: err => {
          this.toast.failure(err);
        }
      })
    }, err => {
      console.log(err);
    });
  }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var mimeType = event.target.files[0].type;
      // console.log(mimeType)
      if (!mimeType.match('image.*')) {
        this.formVaraiantValueData.controls['imgicon'].setValue('');
        this.toast.failure("Upload Image only");
      }
      else
        this.addfile = file

    }
  }

}
