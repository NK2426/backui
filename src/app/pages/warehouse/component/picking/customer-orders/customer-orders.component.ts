import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Ordering } from '../../../models/order';
import { OrderingService } from '../../../services/ordering.service';
export const roleMapping = {
  WHO: 5,
  PICKER: 11,
  PACKER: 12
};
@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class CustomerOrdersComponent implements OnInit {
  customerOrder?: Ordering.CustomerOrder[];
  packagepaginate?: Ordering.OrdersPaginate = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  title = 'Picking';
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(
    private orderingService: OrderingService,
    private toast: ToastService, private cdr: ChangeDetectorRef,
    private utlis: UtilsService
  ) { }

  ngOnInit(): void {
    this.list();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(
      this.search,
      this.page,
      this.pageSize
    );
    this.orderingService.getCustomerOrdersForPicking(params).subscribe({
      next: (customerOrders) => {
        this.customerOrder = customerOrders.datas;
        // if (customerOrders.totalItems) this.count = customerOrders.totalItems;
        this.count = customerOrders.totalItems -1 || 0;
        // console.log(this.count);
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.toast.failure('Error getting the orders.. Please Try again!!');
      }
    });
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
