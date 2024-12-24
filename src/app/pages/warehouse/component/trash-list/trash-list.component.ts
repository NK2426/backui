import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
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
  selector: 'app-trash-list',
  templateUrl: './trash-list.component.html',
  styleUrls: ['./trash-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, SharedModule, RouterModule]
})
export class TrashListComponent {
  warehouses?: BarCode[];
  departmentpaginate?: Warehousepaginate = {};
  currentWarehouse: Warehouse = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  breadCrumbItems: Array<{}> = [];
  disputeForm!: FormGroup;
  /// Paginate //////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(
    private warehouseservice: BarCodeService,
    private router: Router,
    private modelservice: NgbModal,
    private fbdisput: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private utlis: UtilsService
  ) {}

  statusList :any =[
    {
      label:"Active" ,value:0,
      
    },
    {
      label:"InActive" ,value:1,
    }
  ]
  ngOnInit(): void {
    this.list();
    this.disputeForm = this.fbdisput.group({
      status:[0]
     
    });
    this.disputeForm.get('status').setValue(this.statusList[1].value)
  }
  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }
  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
    this.warehouseservice.getAllTrash(params).subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses.datas;
        this.count = warehouses.totalItems || 0;
        this.cdr.detectChanges();
        if (warehouses.totalItems) this.count = warehouses.totalItems;
        if(warehouses.datas.length == 0) 
        setTimeout(() => {
          this.toast.info("There is No Deleted Barcodes")
          this.router.navigate(['/warehouse/stockqc-list'])
        }, 1000);
        
      },
      error: (error) => {
        //this.authRedirect.next(error)
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
  changeStatus(event:any,value:any){
    // console.log(event.target.value,value);
    let status = { status :event.target.value}
    this.warehouseservice.changeTrashStatus(value,status).subscribe({
      next: (warehouses) => {
        // console.log(warehouses);
        this.toast.success('Status Changed')
        this.list()
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });
    
  }
 
}
