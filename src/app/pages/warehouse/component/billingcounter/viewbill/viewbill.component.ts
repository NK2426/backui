import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastService } from 'src/app/_helpers/toast.service';
import { BILLING_COUTNER } from '../../../models/billingcounter';
import { BillingCounterService } from '../../../services/billingcounter.service';

@Component({
  selector: 'app-viewbill',
  templateUrl: './viewbill.component.html',
  styleUrls: ['./viewbill.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule, QRCodeModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class ViewbillComponent {


  @Input() selectedBill!: BILLING_COUTNER.BillingCounter;
  @Output() editBill = new EventEmitter<BILLING_COUTNER.BillingCounter>();
  @Output() refreshList = new EventEmitter<string>();

  assignedparams: any = [];



  constructor(private billingCounterService: BillingCounterService, private cdr: ChangeDetectorRef, private modelservice: NgbModal, private toast: ToastService) { }

  editAction(bill: BILLING_COUTNER.BillingCounter): void {
    this.editBill.emit(bill);
  }

  deleteBill(bill: BILLING_COUTNER.BillingCounter): void {
    if (confirm('Bill Delete Confirmation . Do you want to delete?')) {
      this.billingCounterService.delete(bill).subscribe({
        next: (resp: any) => {
          this.toast.success('Bill Deleted Successfully');
          this.refreshList.emit('refresh');
        }, error: (err: any) => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }


}
