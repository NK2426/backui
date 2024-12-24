import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { PAYMENT } from '../../models/payment';
import { PaymentService } from '../../services/payment.service';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent implements OnInit {


  paymentList!: PAYMENT.Payment[];
  paymentPaginate!: PAYMENT.PaymentPaginated;
  currentPayment!: PAYMENT.Payment;
  addPaymentTerm = false;
  viewPaymentTerm = false;

  currentPaymentIndex!: number;
  currentPaymentCycleId!: number;

  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  constructor(private paymentService: PaymentService, private modalService: NgbModal, private toast: ToastService, private utlis: UtilsService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.list();
  }

  list(type?: string): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.paymentService.getPaymentList(params)
      .subscribe({
        next: (paymentTermList: any) => {
          this.paymentList = paymentTermList.datas;
          let payment_cycle = paymentTermList.datas.paymentcycles;
          // console.log(this.paymentList, payment_cycle);
          this.count = paymentTermList.totalItems || 0;
          this.cd.detectChanges()
          if (paymentTermList.totalItems)
            this.count = paymentTermList.totalItems;
          if (type === 'upsert') {
            this.paymentList[this.currentPaymentIndex].paymentcycles.map((cycle) => {
              if (cycle.id === this.currentPaymentCycleId) {
                this.currentPayment = this.paymentList[this.currentPaymentIndex];
              }
            })
          } if (type === 'delete') {
            if (this.paymentList[this.currentPaymentIndex].paymentcycles.length) {
              this.currentPayment = this.paymentList[this.currentPaymentIndex];
            } else {
              this.currentPayment = {} as PAYMENT.Payment;
            }
          }
        }, error: (error: any) => {
          this.toast.failure('Error retriving the payment terms. Try Again');
        }
      })
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.list();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.list();
  }

  setActivePayment(content: any, payment: PAYMENT.Payment, index: number): void {
    this.modalService.open(content);
    this.currentPaymentIndex = index;
    this.currentPayment = payment;
    this.addPaymentTerm = false;
    this.viewPaymentTerm = true;
  }
  refreshList(type: any): void {
    this.addPaymentTerm = false;
    if (type === 'cancel') {
      this.modalService.dismissAll();
    }
    if (type === "refreshcycle") {
      this.list('upsert');
    }
    if (type === "refreshDelete") {
      this.list('delete');
    }
    if (type === 'refresh') {
      this.modalService.dismissAll();
      this.list();
    }

  }

  refreshPaymentCycle(paymentCycleId: number): void {
    if (paymentCycleId) {
      this.currentPaymentCycleId = paymentCycleId;
    }
  }

  openDialog(content: any): void {
    this.modalService.open(content);
    this.addPaymentTerm = true;
    this.viewPaymentTerm = false;
    this.currentPayment = {} as any;
  }

  editPayment(payment: PAYMENT.Payment): void {
    this.addPaymentTerm = true;
    this.viewPaymentTerm = false;
    let epayment = Object.assign({}, payment)
    this.currentPayment = epayment;
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }
}