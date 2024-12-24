import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { ORDER } from '../../../models/order';
import { EnvService } from '../../../services/env.service';
import { OrderingService } from '../../../services/ordering.service';


@Component({
  selector: 'app-refunds',
  templateUrl: './refunds.component.html',
  styleUrls: ['./refunds.component.scss']
})
export class RefundsComponent implements OnInit {

  refunds?: ORDER.Refund[];
  packagepaginate?: ORDER.RefundsPaginate = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  orderStatus = '';
  title = 'Refunds';
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 20;
  pageSizes = [10,20, 30, 50, 100];

  constructor(private orderingservice: OrderingService,
    private utils: UtilsService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private utlis: UtilsService,
    private env: EnvService) { }

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
    //const additionalParams = this.getAdditionalRequestParams(this.formattedNgbFrom, this.formattedNgbTo, 'Cancel');
    this.orderingservice.getRefunds(params).subscribe({
      next: (refunds) => {
        this.refunds = refunds.datas;
        if (refunds.totalItems) this.count = refunds.totalItems;
      },
      error: (error) => {
        this.toast.failure('Error getting the orders.. Please Try again!!');
      }
    });
  }

  onDropdownChange(event: any) {
    this.orderStatus = event.value as string;
    this.list();
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

}
