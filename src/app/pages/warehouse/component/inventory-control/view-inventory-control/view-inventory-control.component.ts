import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { INVENTORY_CONTROL } from '../../../models/inventory-control';
import { InventoryControlService } from '../../../services/inventory-control.service';
@Component({
  selector: 'app-view-inventory-control',
  templateUrl: './view-inventory-control.component.html',
  styleUrls: ['./view-inventory-control.component.scss'],
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class ViewInventoryControlComponent implements OnInit {
  title = 'Inventory Control'
  stockDetail!: INVENTORY_CONTROL.Stock[];
  /// Pagination ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];


  constructor(private inventoryControlService: InventoryControlService, private cdr: ChangeDetectorRef, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.list();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.inventoryControlService.getInventoryStocks(params)
      .subscribe({
        next: inventoryStock => {
          if (Object.keys(inventoryStock || {}).length) {
            this.stockDetail = inventoryStock.datas;
            this.count = inventoryStock.totalItems;
            this.cdr.detectChanges();
          }
          // console.log(inventoryStock);

        }, error: error => {
          this.toast.failure("Error getting the stock info.. Please Try again!!");
        }
      })
  }
  /* Handles during page number click or select*/
  handlePageChange(event: number): void {
    this.page = event;
    this.list();
  }


  /* Handles during page dropdown change*/
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.list();
  }





}
