import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { PAYMENT } from '../../../models/payment';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewPaymentComponent implements OnInit {
  @Input() selectedPayment!: PAYMENT.Payment;
  @Output() editPaymentNotifier = new EventEmitter<PAYMENT.Payment>();
  @Output() refreshList = new EventEmitter<string>();
  @Output() refreshPaymentCycle = new EventEmitter<number>();
  options: any[] = [
    { displayName: 'Payment', value: 'Payment' },
    { displayName: 'Advance', value: 'Advance' }
  ];
  day: any[] = [
    { displayName: '0 Days', value: '1' },
    { displayName: '120 Days', value: '120' },
    { displayName: '90 Days', value: '90' },
    { displayName: '60 Days', value: '60' },
    { displayName: '30 Days', value: '30' },
    { displayName: '15 Days', value: '15' }
  ];
  currentPaymentTermID!: number;
  currentPaymentCycleID!: number;
  showCycleForm!: boolean;
  assignedparams: any = [];

  submit: Boolean = false;
  data!: PAYMENT.Paymentcycle;
  formData!: FormGroup;
  typeForm!: FormGroup;
  get form() {
    return this.formData.controls;
  }

  get typeform() {
    return this.typeForm.controls;
  }
  constructor(
    private paymentService: PaymentService,
    private formBuilder: FormBuilder,
    private modelservice: NgbModal,
    private toast: ToastService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.showCycleForm = false;
    if (this.selectedPayment && this.selectedPayment.id) {
      this.currentPaymentTermID = this.selectedPayment.id;
    }
    this.cd.detectChanges();
    this.formData = this.formBuilder.group({
      id: [null],
      type: ['', [Validators.required]],
      days: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      percentage: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      paymentterm_id: [null]
    });
  }

  editPaymentTerm(payment: PAYMENT.Payment): void {
    this.editPaymentNotifier.emit(payment);
  }

  addPaymentCycle() {
    this.showCycleForm = true;
    this.formData = this.formBuilder.group({
      id: [null],
      type: ['', [Validators.required]],
      days: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      percentage: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      paymentterm_id: [null]
    });
  }

  editPaymentCycle(paymentCycle: PAYMENT.Paymentcycle) {
    this.showCycleForm = true;
    this.data = paymentCycle;
    this.currentPaymentCycleID = paymentCycle.id as number;
    this.formData = this.formBuilder.group({
      id: [paymentCycle.id],
      type: [paymentCycle.type, [Validators.required]],
      days: [paymentCycle.days, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      percentage: [paymentCycle.percentage, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      paymentterm_id: [paymentCycle.paymentterm_id]
    });
  }

  /* Delete Payment Cycle*/
  deletePaymentCycle(paymentCycle: PAYMENT.Paymentcycle): void {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Payment Cycle Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then(
      () => {
        this.currentPaymentCycleID = paymentCycle.id as number;
        // console.log(this.currentPaymentCycleID, paymentCycle.id, paymentCycle);
        this.paymentService.deletePaymentCycle(paymentCycle.id || 0).subscribe({
          next: (resp) => {
            this.refreshPaymentCycle.emit(this.currentPaymentCycleID);
            this.showCycleForm = false;
            this.refreshList.emit('refreshDelete');
            this.toast.success('Payment Cycle Deleted Successfully');
          },
          error: (err) => {
            this.toast.failure(err);
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /* Create and Update Payment Cycle*/
  savePaymentCycle(): void {
    this.submit = true;
    if (this.formData.invalid) {
      // console.log(this.formData, this.formData.value)
      return;
    }
    /* Update Payment Cycle*/
    // console.log(this.formData.value, this.currentPaymentTermID);
    this.formData.value.paymentterm_id = this.currentPaymentTermID;
    // console.log(this.formData.value);
    if (this.data && this.data.id) {
      this.paymentService.updatePaymentCycleOnEdit(this.currentPaymentTermID, this.formData.value).subscribe({
        next: (resp) => {
          if (resp.status !== 201) {
            this.toast.failure('Failed to update payment term');
          } else {
            this.refreshPaymentCycle.emit(this.currentPaymentCycleID);
            this.showCycleForm = false;
            this.toast.success('Payment Cycle Updated Successfully');
            this.data = {} as any;
            this.formData.reset();
            this.refreshList.emit('refreshcycle');
            this.submit = false;
          }
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    } else {
      /* Create Payment Cycle*/
      this.paymentService.updatePaymentCycleOnEdit(this.currentPaymentTermID, this.formData.value).subscribe({
        next: (resp) => {
          if (resp.status !== 201) {
            this.toast.failure('Error Creating Payment Term');
          } else {
            this.refreshPaymentCycle.emit(resp.data.id);
            this.showCycleForm = false;
            this.toast.success('Payment Cycle Created Successfully');
            this.data = {} as any;
            this.refreshList.emit('refreshcycle');
            this.formData.reset();
          }
        },
        error: (err) => {
          this.toast.failure(err);
          // console.log("this is inside max 100");
          this.formData.reset();
        }
      });
    }
  }

  /* Delete Payment Term*/
  deletePaymentTerm(payment: PAYMENT.Payment): void {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Payment Term Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then(
      () => {
        this.paymentService.deletePaymentTerm(payment).subscribe({
          next: (resp) => {
            this.toast.success('Payment Term Deleted Successfully');
            this.refreshList.emit('refresh');
          },
          error: (err) => {
            this.toast.failure(err);
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }
  cancelPaymentCycleAction(): void {
    this.showCycleForm = false;
  }
}
