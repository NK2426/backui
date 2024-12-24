import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { INVOICE } from '../../../models/invoice';
import { Settings } from '../../../models/settings';
import { InvoiceService } from '../../../services/invoice.service';
import { PurchaseorderService } from '../../../services/purchaseorder.service';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewInvoiceComponent implements OnInit {


  invoiceDetail!: INVOICE.InvoiceDetail;
  invoiceNumber!: string;
  settings?: Settings;


  submit: Boolean = false;
  pageSize = 24;
  page = 1;

  total = { quantity: 0, price: 0, discount: 0, taxamount: 0, total: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0, grandtotal: 0 }

  constructor(private route: ActivatedRoute, private router: Router, private toast: ToastService, private utlis: UtilsService,
    private invoiceService: InvoiceService, private porderservice: PurchaseorderService, private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    let invoicenumber = this.route.snapshot.paramMap.get('invoicenumber');
    if (invoicenumber) {
      this.invoiceNumber = invoicenumber;
      this.list(invoicenumber);
      this.getAddress();
    }
  }



  list(invoiceNumber: string) {
    this.invoiceService.getInvoiceById(invoiceNumber)
      .subscribe({
        next: (invoiceDetail: INVOICE.InvoiceHttpResponse) => {
          if (invoiceDetail && Object.keys(invoiceDetail).length && invoiceDetail.data && Object.keys(invoiceDetail.data).length) {
            this.invoiceDetail = invoiceDetail.data;

            if (this.invoiceDetail.invoiceorderitems) {

              this.total = { quantity: 0, price: 0, discount: 0, taxamount: 0, total: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0, grandtotal: 0 }

              this.invoiceDetail.invoiceorderitems.forEach((orderitem: any) => {
                if (orderitem) {
                  this.total.quantity += orderitem.quantity;
                  this.total.price += orderitem.price;
                  this.total.discount += orderitem.discount;
                  this.total.taxamount += orderitem.taxamount;
                  this.total.total += orderitem.total;
                  this.total.ctaxtotal += orderitem.ctaxval;
                  this.total.staxtotal += orderitem.staxval;
                  this.total.itaxtotal += orderitem.itaxval;
                  this.total.grandtotal += orderitem.grandtotal;
                }
              });
            }
          }
          this.cd.detectChanges();
        },
        error: () => {
        }
      });
  }


  getAddress() {
    this.porderservice.findsetting().subscribe({
      next: data => {
        this.settings = data;
      }
    })
    // this.cd.detectChanges();
  }




  inWords(num: any) {
    let n: any;
    let str = '';
    let a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    let b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
  }

  numberFormat(num: any) {
    return this.utlis.numberFormat(num);
  }

}
