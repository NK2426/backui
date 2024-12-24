import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PAYMENT } from '../../../models/payment';
import { ToastService } from 'src/app/_helpers/toast.service';
import { PaymentService } from '../../../services/payment.service';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { threadId } from 'worker_threads';
import { of } from 'rxjs';

@Component({
  selector: 'app-upsert-payment',
  templateUrl: './upsert-payment.component.html',
  styleUrls: ['./upsert-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertPaymentComponent implements OnInit {
  @Input() data!: PAYMENT.Payment;
  @Output() refreshList = new EventEmitter<string>();
  @Output() editPaymentNotifier = new EventEmitter<PAYMENT.Payment>();
  options: any[] = [
    { _id: 1, stat: 'Active' },
    { _id: 0, stat: 'InActive' }
  ];
  @Output() refreshPaymentCycle = new EventEmitter<number>();
  paymentList: PAYMENT.Payment[] = [];
  paymentids: PAYMENT.Payments
  paymentoptions: any[] = [
    { displayName: 'Payment', value: 'Payment' },
    { displayName: 'Advance', value: 'Advance' }
  ];

  day: any[] = [
    { displayName: '0 Days', value: '1' },
    { displayName: '15 Days', value: '15' },
    { displayName: '30 Days', value: '30' },
    { displayName: '60 Days', value: '60' },
    { displayName: '90 Days', value: '90' },
    { displayName: '120 Days', value: '120' }
  ];

  day_date: any[] = [
    { displayName: '0 Days', value: '1' },
    { displayName: '15 Days', value: '15' },
    { displayName: '30 Days', value: '30' },
    { displayName: '60 Days', value: '60' },
    { displayName: '90 Days', value: '90' },
    { displayName: '120 Days', value: '120' }
  ];

  submit: Boolean = false;
  paysubmit: Boolean = false;
  showCycleForm!: boolean;
  formPaymentData!: FormGroup;
  formData!: FormGroup;
  typeForm!: FormGroup;
  currentPaymentTermID: number;
  currentPaymentCycleID!: number;
  modelref: NgbModalRef;

  items: FormArray;
  itemId: any;
  cycleid: any;

  get form() {
    return this.formData.controls;
  }

  get typeform() {
    return this.typeForm.controls;
  }

  constructor(
    private paymentService: PaymentService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private modelservice: NgbModal,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.showCycleForm = false;
    this.options;
    this.paymentoptions;
    this.formData = this.formBuilder.group({
      id: [this.data.id],
      name: [this.data.name, [Validators.required]],
      description: [this.data.description, [Validators.required]],
      status: [this.data.status]
    });
    // console.log(this.data.status);
    this.formPaymentData = this.formBuilder.group({
      id: [null],
      type: ['', [Validators.required]],
      days: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      percentage: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      paymentterm_id: [null]
    });

    this.formPaymentData = new FormGroup({
      items: new FormArray([])
    });
  }
  getControls() {
    return (this.formPaymentData.get('items') as FormArray).controls;
  }
  new_cycle: boolean = false;
  addPaymentCycle(): FormGroup {
    // console.log('inside add paymentcycle');
    // this.showCycleForm = true;
    this.new_cycle = true;
    // console.log(this.itemId.id);
    this.currentPaymentTermID = this.itemId.id;
    return this.formBuilder.group({
      id: [null],
      type: ['', [Validators.required]],
      days: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      percentage: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      paymentterm_id: [this.itemId.id]
    });
  }


  savepaymentid(resp: any) {
    this.currentPaymentTermID = this.formPaymentData.get('paymentterm_id').value;
  }

  resp: any;
  hidded_button: any = false;
  savePaymentTerm(): void {
    this.submit = true;
    if (this.formData.invalid) {
      // console.log(this.formData.value);
      return;
    }

    if (this.data && this.data.id) {
      this.formData.value.id = this.data.id;
      let maxCount = 0;
      // console.log(this.resp, this.data.paymentcycles);
      // this.data.paymentcycles.forEach((element) => {
      //   console.log(element.percentage);
      //   maxCount = maxCount + element.percentage;
      // })
      // console.log(maxCount);
      // if (maxCount == 100) {
      //   this.submit = false;
      //   this.toast.failure("Payment Cycle Percentage is 100 so you may not be Change the Status");
      // }
      // else {
      this.paymentService.updatePaymentTerm(this.data.id, this.formData.value).subscribe({
        next: (resp) => {
          // console.log(resp);
          if (resp.status == 'failure') {
            this.toast.failure('Failed to update payment term');
          } else {
            this.toast.success('Payment Term Updated Successfully');
            this.refreshList.emit('refresh');
            this.resp = this.data.id;

            this.data = {} as any;
            this.submit = false;
          }
        },
        error: (err) => {
          this.toast.failure(err);
          // console.log("error inside");
        }
      });
      // }
    } else {
      this.paymentService.createPaymentTerm(this.formData.value).subscribe({
        next: (resp) => {
          if (resp.status == 'failure') {
            this.toast.failure('Error Creating Payment Term');
          } else {
            this.toast.success('Payment Term Created Successfully');
            this.paymentids = resp
            // console.log('above if', resp, Object.values(resp), resp.id);
            this.hidded_button = true;
            if (this.hidded_button) {
              // console.log('inside hidded button');
              document.getElementById('upsert_submit').style.display = 'none';
              document.getElementById('upsert_cancel').style.display = 'none';
            } else {
              // console.log('outside hidded button');
              document.getElementById('upsert_submit').style.display = 'blcok';
              document.getElementById('upsert_cancel').style.display = 'block';
            }
            this.formData.disable();
            // console.log(this.currentPaymentTermID, resp, resp.status, resp.id);
            this.itemId = resp;
            this.savepaymentid(resp);
            this.data = {} as any;
            // console.log('this is disable form');
          }
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    }
  }

  showPaymentCycle: any = false;
  addItem(): void {
    this.items = this.formPaymentData.get('items') as FormArray;
    // console.log(this.items);
    this.items.push(this.addPaymentCycle());
    this.submit = false;
  }

  cancelPaymentCycleAction(): void {
    this.refreshList.emit('cancel');
  }

  change_payment(event: any) {
    // console.log(event, event.displayName)
    if (event.displayName == 'Payment') {
      this.payment = true;
      this.advance = false;
    }
    else {
      this.advance = true;
      this.payment = false;
    }
  }

  payment_array: any[] = [];
  paymentCycle: any;
  savePercentage: number = 0;
  paymentPercentageValue: any;
  paymentArray: any = []
  advanceArray: any = [];
  editPaymentFlag: boolean = false;
  payment: boolean = false;
  advance: boolean = false;
  savePaymentCycle(): void {
    this.showPaymentCycle = true;
    this.paymentCycle = this.formPaymentData.get('items').value;
    this.paysubmit = true;
    if (this.formData.invalid) {
      return;
    }
    // console.log(this.formPaymentData.value);
    // console.log(this.formPaymentData.value, this.formPaymentData.status);
    this.formPaymentData.value.items[0].paymentterm_id = this.currentPaymentTermID
    this.savePercentage = Number(this.formPaymentData.value.items[0].percentage) + this.savePercentage;
    // console.log(this.savePercentage);

    // Greater then 100%
    if (this.savePercentage > 100) {
      this.editPaymentFlag = false;
      this.savePercentage = this.savePercentage - Number(this.formPaymentData.value.items[0].percentage);
      this.toast.failure("Payment Cycle Percentage Maximum 100% Only");
      this.formPaymentData.reset();
      // console.log(this.savePercentage);
      return;
    }

    // console.log(this.formPaymentData.value, this.formPaymentData.value.items[0].days, this.formPaymentData.value.items[0].percentage, this.itemId.id)

    if (this.formPaymentData.value.items[0].type == 'Payment') {
      for (let j = 0; j < this.day.length; j++) {
        if (this.day[j].value !== this.formPaymentData.value.items[0].days) {
          this.paymentArray = [...this.paymentArray, this.day[j]];
        }
      }
      this.day = this.paymentArray;
      this.paymentArray = [];
    }

    if (this.formPaymentData.value.items[0].type == 'Advance') {
      for (let j = 0; j < this.day_date.length; j++) {
        if (this.day_date[j].value !== this.formPaymentData.value.items[0].days) {
          this.advanceArray = [...this.advanceArray, this.day_date[j]];
        }
      }
      this.day_date = this.advanceArray;
      this.advanceArray = [];
    }
    // console.log(this.paymentArray, this.advanceArray);


    /* Create Payment Cycle*/
    this.paymentService.createPaymentCycle(this.currentPaymentTermID, this.formPaymentData.value).subscribe({
      next: (resp) => {
        if (resp.status !== 201) {
          this.toast.failure('Error Creating Payment Term');
        } else {
          // console.log(resp, resp.data);
          this.p_id = resp.data;
          this.cycleid = resp.data
          this.paymentCycle[0].id = resp.data;

          // Less then 100%
          if (this.savePercentage <= 100) {
            // console.log(this.paymentCycle);
            this.payment_array.push(this.paymentCycle[0]);
            // console.log(this.payment_array);
            this.editPaymentFlag = false;

            this.toast.success('Payment Cycle Created Successfully');
            this.formPaymentData.reset();
          }
          // console.log(this.savePercentage);

          // 100%
          if (this.savePercentage == 100) {
            this.submit = false;
            this.new_cycle = false;
            this.editPaymentFlag = true;
            // console.log("this is 100%");
            // this.toast.success("Payment Cycle 100% Successfully");
          }
          // console.log(this.savePercentage, this.maxPercentage);
        }
      },
      error: (err) => {
        // console.log('errror inside', err);
        this.toast.failure(err);
        this.formPaymentData.reset();
        return;
      }
    });
  }

  cancelAction(): void {
    let type = 'cancel';
    this.refreshList.emit(type);
  }

  /* Delete Payment Cycle*/
  p_id: any;
  maxPercentage: number = 0;
  cycleDays: any;
  deletePaymentCycle(paymentCycle: PAYMENT.Paymentcycle): void {
    // console.log(paymentCycle, this.p_id);

    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Payment Cycle Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then(
      () => {
        // console.log(paymentCycle, paymentCycle.id, paymentCycle.percentage);
        this.paymentService.deletePaymentCycle(paymentCycle.id).subscribe({
          next: (resp) => {
            // console.log(resp, resp.data.percentage);
            this.showCycleForm = false;
            this.payment_array.splice(this.payment_array.findIndex(a => a.id === paymentCycle.id), 1)
            // console.log('element', this.payment_array);
            this.toast.success('Payment Cycle Deleted Successfully');

            // Advance Payment Days
            if (paymentCycle.type == 'Advance') {
              //this.day_date.push({ displayName: paymentCycle.days + ' Days', value: paymentCycle.days });
              this.cycleDays = paymentCycle.days == 1 ? '0' : paymentCycle.days;
              // console.log(this.cycleDays);
              this.day_date = [...this.day_date, { displayName: this.cycleDays + ' Days', value: paymentCycle.days }]
              // console.log(this.day_date);
            }
            // console.log(this.day_date);

            // Payment Array Days
            if (paymentCycle.type == 'Payment') {
              // this.day.push({ displayName: paymentCycle.days + ' Days', value: paymentCycle.days });
              this.cycleDays = paymentCycle.days == 1 ? '0' : paymentCycle.days;
              // console.log(this.cycleDays);
              this.day = [...this.day, { displayName: this.cycleDays + ' Days', value: paymentCycle.days }]
            }
            // console.log(this.day);


            this.savePercentage = this.savePercentage - Number(resp.data.percentage);
            // console.log(this.maxPercentage, this.savePercentage);
            this.savePercentage = this.savePercentage

            if (this.payment_array.length == 0) {
              this.submit = false;
              this.showPaymentCycle = false;
              this.new_cycle = true;
              // console.log("dummy");
              this.editPaymentFlag = false;
            }
            else {
              if (this.savePercentage <= 100) {
                this.new_cycle = true;
                this.submit = false;
                // console.log("insid paecentage");
                this.editPaymentFlag = false;
              }
            }
            this.cd.detectChanges();
          },
          error: (err) => {
            this.toast.failure(err);
          }
        });
      },
      (err) => {
        // console.log(err);
      }
    );
    this.cd.detectChanges();
  }

  editPaymentBtn: boolean = false;
  editPaymentTerm(payment: PAYMENT.Payment, fData: any, dId: any): void {
    // this.editPaymentNotifier.emit(payment);
    // console.log(payment);
    // console.log(fData, this.paymentids.id);
    fData.value.id = this.paymentids.id;
    // console.log(this.p_id, fData.value);
    this.data.id = this.paymentids.id;
    // console.log(fData.value, dId, this.p_id);
    this.showPaymentCycle = false;
    this.editPaymentFlag = false;

    this.formData.enable();
    document.getElementById('upsert_submit').style.display = 'block';
    document.getElementById('upsert_cancel').style.display = 'block';
    // this.editPaymentBtn = true;
  }
}