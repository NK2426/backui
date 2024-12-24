import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Purchaseorder, Vendor } from '../../models/purchaseorder';
import { PurchaseorderService } from '../../services/purchaseorder.service';
import { WarehouseList } from '../../models/financeReport';
import { RevenuechartService } from '../../services/revenuechart.service';


@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaseorderComponent implements OnInit {


  purchaseorders!: Purchaseorder[];
  purchaseitems!: any;
  comments = '';
  fromstatus = 'Create';
  tostatus = 'Process';
  status: Array<{ id: string, name: string }> = [{ id: 'Accepted', name: 'Accepted' }, { id: 'Declined', name: 'Declined' }, { id: 'Approved', name: 'New' }, { id: 'Reject', name: 'Reject' }];
  headapprove = { status: '', halt: '', comments: '' };
  actionreason = false;

  title: any = 'Purchase Orders';
  type: any = []
  changestatus: any = { '': 'New', 'Approved': 'New', 'Vendor_revise': 'Revised', 'Decline': 'Declined', 'Accept': 'Accepted' };
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  warehouseData: WarehouseList[] = [];
  vendors: Vendor[] = []; selectedVendor = '';
  selectedStore ='';
  currentPO: Purchaseorder = {};
  currentIndex = -1;
  viewAction = false;

  constructor(
    private route: ActivatedRoute, private router: Router,
    private porderservice: PurchaseorderService, private toast: ToastService,
    private modelservice: NgbModal,
    private utlis: UtilsService,
    private cd: ChangeDetectorRef,
    private revenueService: RevenuechartService
  ) { }

  ngOnInit(): void {
    this.list();
    this.revenueService.getAllWarehouse().subscribe({
      next: (resp: any) => {
        this.warehouseData = resp.data;
        this.cd.detectChanges();
      }
    })
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    let type = ['Pick Up', 'Received', 'Inward'] //this.route.snapshot.paramMap.get('status') || '';
    this.type = type;
    const params = this.getRequestParams(this.search, this.selectedVendor, this.page, this.pageSize,this.selectedStore)
    this.porderservice.getAll(params, type)
      .subscribe({
        next: orders => {
          this.purchaseorders = orders.datas || [];
          this.count = orders.totalItems || 0;
          this.cd.detectChanges();
        },
        error: () => {
        }
      });


    this.porderservice.vendorlist().subscribe({
      next: vendors => {
        this.vendors = vendors;
      }
    })
  }

  getRequestParams(search: string, vendor: string, page: number, pageSize: number,warehouse:string): any {
    let params = { 'search': '', 'vendor': '', 'page': page, 'size': pageSize ,warehouse:''};
    if (search)
      params['search'] = search;
    if (vendor)
      params['vendor'] = vendor;
    if (page)
      params['page'] = page - 1;
    if (pageSize)
      params['size'] = pageSize;
    if (warehouse)
      params['warehouse'] = warehouse;
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

  setActivePO(content: any, po: Purchaseorder, index: number): void {
    this.modelservice.open(content);
    this.currentIndex = index;
    this.currentPO = po;
    this.viewAction = true;
  }

  viewPO(po: Purchaseorder): void {
    this.viewAction = true;
    let epo = Object.assign({}, po)
    this.currentPO = epo;
  }

  refreshList(type: any): void {
    if (type == 'cancel') {
      this.viewAction = true;
    } else {
      this.modelservice.dismissAll();
      if (type == 'refresh')
        this.list();
      this.currentIndex = -1;
    }

  }
  addPO(content: any): void {
    this.modelservice.open(content);
    this.viewAction = false;
    this.currentIndex = -1;
    this.currentPO = {};
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
