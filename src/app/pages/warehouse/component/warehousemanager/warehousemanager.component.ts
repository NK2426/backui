import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Warehouse, Warehousepaginate } from '../../models/warehouse';
import { WarehouseManagerService } from '../../services/warehousemanager.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { Product } from '../../models/product';

@Component({
  selector: 'app-warehousemanager',
  templateUrl: './warehousemanager.component.html',
  styleUrls: ['./warehousemanager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SharedModule,
    NgSelectModule, RouterModule]
})
export class WarehousemanagerComponent implements OnInit {
  warehouses?: Warehouse[];
  departmentpaginate?: Warehousepaginate = {};
  currentWarehouse: Warehouse = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  breadCrumbItems: Array<{}> = [];

  /// Paginate //////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(
    private warehouseservice: WarehouseManagerService,
    private router: Router,
    private modelservice: NgbModal,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private utlis: UtilsService
  ) {}
  ngOnInit(): void {
    this.list();
  }
  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }
  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
    this.warehouseservice.getAll(params).subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses.datas;
        this.count = warehouses.totalItems || 0;
        this.cdr.detectChanges();
        if (warehouses.totalItems) this.count = warehouses.totalItems;
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });
  } handlePageChange(event: number): void {
    this.page = event;
    this.list();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.list();
  }
  viewEdit(link: string, id: any) {
    if (link === "edit") {
      this.router.navigate(['warehouse/edit-warehouse/' + id]);
    }
    if (link === "view") {
      this.router.navigate(['warehouse/view-warehouse/' + id]);
    }
  }
  
  deleteWarehouse(Warehouse: Warehouse): void {
    // console.log('inside');
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'P.O Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then((parameterResponse) => {
      this.warehouseservice.delete(Warehouse).subscribe({
        next: resp => {
          this.toast.success('Warehouse Deleted Successfully');
          this.list();
        }, error: err => {
          this.toast.failure(err);
        }
      })
    }, (err: any) => {
      console.log(err);
      this.toast.failure('Something went wrong.. Warehouse does not delete.');
    });
  }

  

}
