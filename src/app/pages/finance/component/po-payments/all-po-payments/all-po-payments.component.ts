import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { POPAYMENTS } from '../../../models/popayment';
import { PurchaseorderService } from '../../../services/purchaseorder.service';


@Component({
  selector: 'app-all-po-payments',
  templateUrl: './all-po-payments.component.html',
  styleUrls: ['./all-po-payments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllPoPaymentsComponent implements OnInit {

  poPayments: POPAYMENTS.PO_Payment[] = [];
  title = 'PO Payment';
  groupedObj = {} as any;
  dateKeys: string[] = [];
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(private purchaseOrderService: PurchaseorderService, private toast: ToastService, private utlis: UtilsService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllThreeWayMatching();
  }

  getAllThreeWayMatching(): void {

    this.purchaseOrderService.getPOPayments({})
      .subscribe({
        next: (details: POPAYMENTS.PO_Payment[]) => {
          if (details && details.length) {
            this.poPayments = details;
            this.groupByDate(this.poPayments);
          }
          this.cd.detectChanges();
        }, error: error => {
          this.toast.failure("Error getting the details.. Please Try again!!");
        }
      })
  }


  groupByDate(poPayments: POPAYMENTS.PO_Payment[]) {

    var grouped = {} as any;
    var todaysDMY = new Date().toISOString().substring(0, 10); // Standard ISO Format eg: 2022-01-05 YYYY-MM-DD
    var todaysDateISO = new Date(todaysDMY).toISOString(); // system todays date
    poPayments.forEach(function (a) {
      // grouped = {};
      a.paymentterm.paymentcycles.forEach(function (b) {
        let isToday = false;
        if (!grouped[b.date]) {
          grouped[b.date] = [];
        }
        if (todaysDateISO === new Date(b.date).toISOString()) {
          isToday = true;
        }
        grouped[b.date].push({
          paymentterm_id: a.paymentterm.id,
          paymentcycle_id: b.id,
          type: b.type,
          status: a.status,
          amount: a.grandtotal,
          isToday: isToday
        });
      });  //b end
    })// a end

    this.groupedObj = grouped;
    this.dateKeys = Object.keys(this.groupedObj);
  }

  getDay(date: string) {
    let temp = new Date(date);
    return this.days[temp.getDay()];
  }

}
