import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PAYMENT } from '../../../models/payment';
import { ToastService } from 'src/app/_helpers/toast.service';
import { PaymentService } from '../../../services/payment.service';


@Component({
  selector: 'app-upsert-payment',
  templateUrl: './upsert-payment.component.html',
  styleUrls: ['./upsert-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertPaymentComponent implements OnInit {


  @Input() data!: PAYMENT.Payment;
  @Input() updateTerm!: boolean;
  @Output() refreshList = new EventEmitter<string>();
  options: any[] = [
    { _id: 1, stat: 'Active' },
    { _id: 0, stat: 'InActive' }];

  selectedStatus: number = 0;
  submit: Boolean = false;
  formData!: FormGroup; typeForm!: FormGroup;

  get form() {
    return this.formData.controls;
  }

  get typeform() {
    return this.typeForm.controls;
  }

  constructor(private paymentService: PaymentService, private toast: ToastService, private formBuilder: FormBuilder, private modelservice: NgbModal, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.options
    this.formData = this.formBuilder.group({
      id: [this.data.id],
      name: [this.data.name, [Validators.required]],
      description: [this.data.description, [Validators.required]],
      status: [this.data && this.data.status ? this.data.status : 0]
    });
    this.selectedStatus = (this.data && this.data.id) ? this.data.status as number : 0;
  }

  /* ngOnChanges(changes: SimpleChanges): void {
    let change = changes['updateTerm'];
    if (change.currentValue === true) {
      this.updatePaymentTerm();
    }
  } */



  savePaymentTerm(): void {
    this.submit = true;
    if (this.formData.invalid) {
      // console.log(this.formData);
      return;
    }
    // update payment term
    if (this.data.id) {
      this.updatePaymentTerm();
    } else {
      // create payment term
      this.paymentService.createPaymentTerm(this.formData.value).subscribe({
        next: resp => {
          if (resp.status == 'failure') {
            this.toast.failure('Error Creating Payment Term');
          }
          else {
            this.toast.success('Payment Term Created Successfully');
            this.refreshList.emit('refresh');
            this.data = {} as any;
            this.formData.reset();
          }
          // this.cd.detectChanges();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }


  updatePaymentTerm() {
    if (this.data.id) {
      this.formData.patchValue({ status: 0 })
      this.paymentService.updatePaymentTerm(this.data.id, this.formData.value).subscribe({
        next: resp => {
          if (resp.status == 'failure') {
            this.toast.failure('Failed to update payment term');
          }
          else {
            this.toast.success('Payment Term Updated Successfully');
            this.refreshList.emit('refresh');
            this.data = {} as any;
            this.formData.reset();
            this.submit = false;
          }
          // this.cd.detectChanges();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }

  cancelAction(): void {
    let type = 'cancel';
    this.refreshList.emit(type);
  }

  /*ng select dropdown change*/
  onDropDownChange(model: any) {
    this.selectedStatus = model._id;
  }

}
