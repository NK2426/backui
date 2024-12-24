import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
//import { SortEvent, SortableDirective } from 'src/app/helpers/directives/advance-sortable.directive';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Grn } from './../../../models/grn';
import { Purchaseorder, Vendor } from './../../../models/purchaseorder';
import { PurchaseorderService } from '../../../services/purchaseorder.service';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/_themes/shared/shared.module';


@Component({
  selector: 'app-inwardpo',
  templateUrl: './inwardgrnbundle.component.html',
  styleUrls: ['./inwardgrnbundle.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, NgSelectModule, RouterModule,SharedModule]
})
export class InwardgrnbundleComponent implements OnInit {

  purchaseorders!: Purchaseorder[];
  grns!: Grn[];
  purchaseitems!: any;
  comments = '';
  fromstatus = 'Create';
  tostatus = 'Process';
  status: Array<{ id: string, name: string }> = [{ id: 'Accepted', name: 'Accepted' }, { id: 'Declined', name: 'Declined' }, { id: 'Approved', name: 'New' }, { id: 'Reject', name: 'Reject' }];
  headapprove = { status: '', halt: '', comments: '' };
  actionreason = false;

  title: any = 'Inward Documents';
  type: any = ''
  changestatus: any = { '': 'New', 'Approved': 'New', 'Vendor_revise': 'Revised', 'Decline': 'Declined', 'Accept': 'Accepted' };
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  vendors: Vendor[] = []; selectedVendor = ''; selectedColumn = ''; selectedDirection = '';

  currentPO: Purchaseorder = {};
  currentIndex = -1;
  viewAction = false;

  bundlereceivedarr: any = []; discrepancyarr: any = [];


  constructor(
    private route: ActivatedRoute, private router: Router,
    private porderservice: PurchaseorderService, private toast: ToastService,
    private modelservice: NgbModal,
  ) { }

  ngOnInit(): void {
    this.list();
  }
  list(): void {
    let type = ['Received', 'Inward'] //this.route.snapshot.paramMap.get('status') || '';
    this.type = type;
    const params = this.getRequestParams(this.search, this.selectedVendor, this.selectedColumn, this.selectedDirection, this.page, this.pageSize)
    this.porderservice.getAllgrns(params)
      .subscribe({
        next: orders => {
          this.grns = orders.datas || []; //?.filter((data: any) => data.tatkalpo_uuid == '')
          this.count = orders.totalItems || 0;
          // if (orders.datas) {

          //   this.purchaseorders?.forEach((val: any, index: number) => {
          //     let bundlereceived = val.bundles.filter((data: any) => data.status == 'Received' || 'Inward');
          //     let discrepancy = val.bundles.filter((data: any) => data.status == 'Dispute');
          //     //orders?.datas?.[index]?.bundlereceived = bundlereceived?.length;
          //     this.bundlereceivedarr[index] = bundlereceived.length;
          //     this.discrepancyarr[index] = discrepancy.length;
          //   })
          // }

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

  getRequestParams(search: string, vendor: string, column: string, direction: string, page: number, pageSize: number): any {
    let params = { 'search': '', 'vendor': '', 'page': page, 'size': pageSize, orderby: '', order: '' };
    if (search)
      params['search'] = search;
    if (vendor)
      params['vendor'] = vendor;
    if (page)
      params['page'] = page - 1;
    if (pageSize)
      params['size'] = pageSize;
    if (column)
      params['orderby'] = column;
    if (direction)
      params['order'] = direction;


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
    // console.log(this.selectedVendor)
    this.list()
  }

}


