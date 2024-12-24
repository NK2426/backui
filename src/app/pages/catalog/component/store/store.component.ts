import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { Store, StorePaginate } from '../../models/store';
import { StoreManagerService } from '../../services/store.service';


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SharedModule,
    NgSelectModule, RouterModule]
})

export class StoreComponent {
  warehouses?: Store[];
  departmentpaginate?: StorePaginate = {};
  currentWarehouse: Store = {};
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
    private warehouseservice: StoreManagerService,
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
      this.router.navigate(['catalog/edit-store/' + id]);
    }
    if (link === "view") {
      this.router.navigate(['catalog/view-store/' + id]);
    }
  }
  
  deleteWarehouse(Warehouse: Store): void {
    // console.log('inside');

    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'P.O Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then((parameterResponse) => {
      this.warehouseservice.delete(Warehouse).subscribe({
        next: resp => {
          this.toast.success('Soret Deleted Successfully');
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
