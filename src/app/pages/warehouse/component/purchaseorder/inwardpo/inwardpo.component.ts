import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Purchaseorder, Vendor } from '../../../models/purchaseorder';
import { PurchaseorderService } from '../../../services/purchaseorder.service';
@Component({
  selector: 'app-inwardpo',
  templateUrl: './inwardpo.component.html',
  styleUrls: ['./inwardpo.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule]
})
export class InwardpoComponent implements OnInit {

  purchaseorders!: Purchaseorder[];
  purchaseitems!: any;
  comments = '';
  fromstatus = 'Create';
  tostatus = 'Process';
  status: Array<{ id: string, name: string }> = [{ id: 'Accepted', name: 'Accepted' }, { id: 'Declined', name: 'Declined' }, { id: 'Approved', name: 'New' }, { id: 'Reject', name: 'Reject' }];
  headapprove = { status: '', halt: '', comments: '' };
  actionreason = false;

  title: any = 'Inward Bundles';
  type: any = ''
  changestatus: any = { '': 'New', 'Approved': 'New', 'Vendor_revise': 'Revised', 'Decline': 'Declined', 'Accept': 'Accepted' };
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  vendors: Vendor[] = []; selectedVendor = '';

  currentPO: Purchaseorder = {};
  currentIndex = -1;
  viewAction = false;

  bundlereceivedarr: any = []; discrepancyarr: any = [];

  constructor(
    private route: ActivatedRoute, private router: Router,
    private porderservice: PurchaseorderService, private toast: ToastService,
    private modelservice: NgbModal, private cdr: ChangeDetectorRef,
    private utlis: UtilsService
  ) { }

  ngOnInit(): void {
    this.list();
  }
  list(): void {
    let type = ['Received', 'Inward'] //this.route.snapshot.paramMap.get('status') || '';
    this.type = type;
    const params = this.getRequestParams(this.search, this.selectedVendor, this.page, this.pageSize)
    this.porderservice.getAll(params, type)
      .subscribe({
        next: orders => {
          this.purchaseorders = orders.datas || [];
          this.count = orders.totalItems || 0;
          if (orders.datas) {

            orders.datas?.forEach((val: any, index: number) => {
              let bundlereceived = val.bundles.filter((data: any) => data.status == 'Received' || 'Inward');
              let discrepancy = val.bundles.filter((data: any) => data.status == 'Dispute');
              //orders?.datas?.[index]?.bundlereceived = bundlereceived?.length;
              this.bundlereceivedarr[index] = bundlereceived.length;
              this.discrepancyarr[index] = discrepancy.length;
            })
          }
          this.cdr.detectChanges();
        },
        error: () => {
        }
      });

    this.porderservice.vendorlist().subscribe({
      next: vendors => {
        this.vendors = vendors
      }
    })
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
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

  handlePageChange(event: number): void {
    this.page = event;
    this.list();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.list();
  }


  changeVendor(vendor: any) {
    if (vendor) {
      this.selectedVendor = vendor.uid;
    }
    else {
      this.selectedVendor = ''
    }
    //console.log(this.selectedVendor)
    this.list()
  }

}


