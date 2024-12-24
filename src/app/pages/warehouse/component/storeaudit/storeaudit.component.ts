import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { Warehouse } from '../../models/purchaseorder';;
import { BarCodeService } from '../../services/barcode.service';
import { Audit, Auditpaginate, BarCode } from '../../models/barcode';
import { PurchaseorderService } from 'src/app/pages/purchaser/services/purchaseorder.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-storeaudit',
  templateUrl: './storeaudit.component.html',
  styleUrls: ['./storeaudit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SharedModule, RouterModule, NgSelectModule]
})
export class StoreauditComponent {
  warehouses?: Audit[];
  departmentpaginate?: Auditpaginate = {
    warehouse: undefined
  };
  currentWarehouse: Warehouse = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  breadCrumbItems: Array<{}> = [];
  warehouse_id: any;

  /// Paginate //////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  warehouse: Warehouse[];

  selectedWarehouse:any = '';

  constructor(
    private warehouseservice: BarCodeService,
    private router: Router,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private utlis: UtilsService,
    private porderservice: PurchaseorderService,
    private cd: ChangeDetectorRef,
  ) { }
  ngOnInit(): void {
    this.warehouseList();
    this.list();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    this.warehouse_id = '';
    // this.page = 0;
    const params = this.getRequestParams(this.search, this.page, this.pageSize, this.selectedWarehouse);
    this.warehouseservice.getAllaudit(params).subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses.datas;
        this.warehouse_id = warehouses.warehouse;
        if (this.warehouse_id) {
          // this.warehouseList();
        }
        // console.log(this.warehouse_id)
        this.count = warehouses.totalItems || 0;
        this.cdr.detectChanges();
        if (warehouses.totalItems) this.count = warehouses.totalItems;
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });
  }

  getRequestParams(search: string, page: number, pageSize: number, selectedWarehouse: any): any {
    let params = { 'search': '', 'page': page, 'size': pageSize, 'store': selectedWarehouse };
    if (search)
      params['search'] = search;
    if (page)
      params['page'] = page - 1;
    if (pageSize)
      params['size'] = pageSize;
    if (selectedWarehouse)
      params['store'] = selectedWarehouse;
    return params;
  }

  changeWarehouse(warehouseId: any) {
    if (warehouseId.id) {
      this.selectedWarehouse = warehouseId.id;
      this.page = 1;
    }
    else {
      this.selectedWarehouse = '';
    }
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

  viewEdit(link: string, id: any) {
    if (link === "edit") {
      this.router.navigate(['warehouse/edit-warehouse/' + id]);
    }
    if (link === "view") {
      this.router.navigate(['warehouse/view-warehouse/' + id]);
    }
  }
  deleteBarcode(barcode: BarCode): void {
    // console.log('inside', barcode.barcode);

    const modalRef = this.modalService.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Barcode Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then(
      (parameterResponse) => {
        this.warehouseservice.delete(barcode).subscribe({
          next: (resp) => {
            // console.log(resp);
            this.toast.success('Barcode Deleted Successfully');
            this.list();
          },
          error: (err) => {
            this.toast.failure(err);
          }
        });
      },
      (err: any) => {
        console.log(err);
        this.toast.failure('Something went wrong.. Barcode does not delete.');
      }
    );
  }

  onClearWarehouse() {
    this.selectedWarehouse = '';
    this.page = 1;
    this.list();
  }

  warehouseList() {
    this.porderservice.getWarehouses().subscribe({
      next: (data) => {
        this.warehouse = data;
        console.log(this.warehouse,"><><><>><>><><><<>>");
        
        this.cd.detectChanges(); // Trigger change detection
      },
      error: (err) => {
        console.error('Error fetching warehouses:', err);
      }
    });
  }

}
