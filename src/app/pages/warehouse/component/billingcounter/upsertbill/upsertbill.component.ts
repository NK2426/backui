import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { BILLING_COUTNER } from '../../../models/billingcounter';
import { BillingCounterService } from '../../../services/billingcounter.service';

@Component({
  selector: 'app-upsertbill',
  templateUrl: './upsertbill.component.html',
  styleUrls: ['./upsertbill.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class UpsertbillComponent implements OnInit {


  @Input() data!: BILLING_COUTNER.BillingCounter;
  @Output() refreshList = new EventEmitter<string>();

  submit: Boolean = false;
  gsubmit: Boolean = false;
  formData!: FormGroup; typeForm!: FormGroup;
  modelref: any = '';

  get form() {
    return this.formData.controls;
  }

  get typeform() {
    return this.typeForm.controls;
  }

  constructor(private billingCounterService: BillingCounterService, private cdr: ChangeDetectorRef, private toast: ToastService, private formBuilder: FormBuilder, private modelservice: NgbModal) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      id: [this.data.id],
      uuid: [this.data.uuid],
      name: [this.data.name, [Validators.required]],
      description: [this.data.description, [Validators.required]],
      status: [this.data.status]
    });
  }



  saveBill(): void {
    this.submit = true;
    if (this.formData.invalid) {
      //console.log(this.formData);
      return;
    }
    if (this.data.id != null) {
      this.billingCounterService.update(this.formData.value).subscribe({
        next: resp => {
          if (resp.status == 'failure') {
            this.toast.failure(resp.message);
          }
          else {
            this.toast.success('Bill Updated Successfully');
            this.refreshList.emit('refresh');
            this.data = {} as any;
            this.formData.reset();
            this.submit = false;
            this.cdr.detectChanges();
          }
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    } else {

      this.billingCounterService.create(this.formData.value).subscribe({
        next: resp => {
          if (resp.status == 'failure') {
            this.toast.failure(resp.message);
          }
          else {
            this.toast.success('Bill Created Successfully');
            this.refreshList.emit('refresh');
            this.data = {} as any;
            this.formData.reset();
          }
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }


  viewType(content: any): void {
    this.modelref = this.modelservice.open(content, { size: 'md' });
  }

  cancelAction(): void {
    let type = 'cancel1';
    if (!this.data.id) {
      type = '';
    }
    this.refreshList.emit(type);
  }



}
