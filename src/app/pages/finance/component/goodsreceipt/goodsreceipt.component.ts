import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Grn } from '../../models/grn';
import { BundleService } from '../../services/bundle.service';


@Component({
  selector: 'app-goodsreceipt',
  templateUrl: './goodsreceipt.component.html',
  styleUrls: ['./goodsreceipt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoodsreceiptComponent implements OnInit {

  grns!: Grn[];
  comments = '';
  fromstatus = 'Create';
  tostatus = 'Process';
  status: Array<{ id: string, name: string }> = [{ id: 'Accepted', name: 'Accepted' }, { id: 'Declined', name: 'Declined' }, { id: 'Approved', name: 'New' }, { id: 'Reject', name: 'Reject' }];
  headapprove = { status: '', halt: '', comments: '' };
  actionreason = false;

  title: string = 'Supplier Invoices';
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
    private bundleservice: BundleService, private toast: ToastService,
    private modelservice: NgbModal,
    private utlis: UtilsService, private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.list();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }
  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.bundleservice.getGrn(params)
      .subscribe({
        next: resp => {
          this.grns = resp.datas || [];
          this.count = resp.totalItems || 0;
          if (resp.totalItems) {
            this.count = resp.totalItems;
            // this.count = resp.totalItems || 0;
          }
          this.cd.detectChanges();
        },
        error: () => {
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

  numberFormat(num: any) {
    return this.utlis.numberFormat(num);
  }

}
