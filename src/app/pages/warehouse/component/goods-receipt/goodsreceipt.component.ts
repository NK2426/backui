import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Grn } from '../../models/grn';
import { Vendor } from '../../models/purchaseorder';
import { BundleService } from '../../services/bundle.service';
import { InventoryService } from '../../services/inventory.service';
import { PurchaseorderService } from '../../services/purchaseorder.service';


@Component({
  selector: 'app-goodsreceipt',
  templateUrl: './goodsreceipt.component.html',
  styleUrls: ['./goodsreceipt.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule]
})
export class GoodsreceiptComponent implements OnInit {

  grns!: Grn[];
  comments = '';
  fromstatus = 'Create';
  tostatus = 'Process';
  status: Array<{ id: string, name: string }> = [{ id: 'Accepted', name: 'Accepted' }, { id: 'Declined', name: 'Declined' }, { id: 'Approved', name: 'New' }, { id: 'Reject', name: 'Reject' }];
  headapprove = { status: '', halt: '', comments: '' };
  actionreason = false;

  vendors: Vendor[] = []; selectedVendor = '';
  title: any = 'Goods Receipt';
  type = ''
  changestatus: any = { '': 'New', 'Approved': 'New', 'Vendor_revise': 'Revised', 'Decline': 'Declined', 'Accept': 'Accepted' };
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  bundlereceivedarr: any = []; discrepancyarr: any = [];
  bundlereceivedarritm: any = []; discrepancyarritm: any = [];
  productquantity: any = [];

  constructor(
    private route: ActivatedRoute, private router: Router,
    private bundleservice: BundleService,
    private inventoryservice: InventoryService,
    private toast: ToastService,
    private modelservice: NgbModal,
    private utlis: UtilsService,
    private cdr: ChangeDetectorRef,
    private porderservice: PurchaseorderService
  ) { }

  ngOnInit(): void {
    this.list();
  }
  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.getRequestParams(this.search, this.selectedVendor, this.page, this.pageSize)
    this.bundleservice.getGrn(params)
      .subscribe({
        next: resp => {
          this.grns = resp.datas || [];
          this.count = resp.totalItems || 0;
          this.cdr.detectChanges();
        },
        error: () => {
          this.toast.failure('Error retriving data! Try again')
        }
      });

    this.porderservice.vendorlist().subscribe({
      next: vendors => {
        this.vendors = vendors
      }
    })
  }
  syncinventory(grnid: string): void {
    if (grnid != '') {
      this.inventoryservice.grnsyncinventory(grnid).subscribe({
        next: resp => {
          this.toast.success('This GRN Sync Successfully.');
          this.list()
        },
        error: () => {
          this.toast.failure('This GRN not Sync.');
          this.list()
        }
      })
    } else {
      this.toast.failure('This GRN does not exists.');
    }
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

  getRequestParams(search: string, vendor: string, page: number, pageSize: number): any {
    let params = { 'search': '', 'vendor': '', 'page': page, 'size': pageSize };
    if (search)
      params['search'] = search;
    if (vendor)
      params['vendor'] = vendor;
    if (page)
      params['page'] = page - 1;
    if (pageSize)
      params['size'] = pageSize;

    return params;
  }

  changeVendor(vendor: any) {
    if (vendor) {
      this.selectedVendor = vendor.uid;
    }
    else {
      this.selectedVendor = ''
    }
    this.list()
  }

}
