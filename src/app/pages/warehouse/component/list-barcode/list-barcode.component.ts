import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { Warehouse } from '../../models/purchaseorder';
import { Warehousepaginate } from '../../models/warehouse';
import { WarehouseManagerService } from '../../services/warehousemanager.service';
import { BarCodeService } from '../../services/barcode.service';
import { BarCode } from '../../models/barcode';

@Component({
  selector: 'app-list-barcode',
  templateUrl: './list-barcode.component.html',
  styleUrls: ['./list-barcode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SharedModule, RouterModule]
})
export class ListBarcodeComponent {
  warehouses?: BarCode[];
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
    private warehouseservice: BarCodeService,
    private router: Router,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
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
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
    this.warehouseservice.getAll(params).subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses.datas
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


}
