import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Taxpaginate } from '../../models/product';
import { Tax } from '../../models/purchaseorder';
import { TaxService } from '../../services/tax.service';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TaxComponent implements OnInit {
  tax?: any[];
  taxpaginate?: Taxpaginate = {};
  currentTax: any = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  breadCrumbItems: Array<{}> = [];
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(private taxservices: TaxService, private modalService: NgbModal, private toast: ToastService, private utlis: UtilsService,private cd:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/app' },
      { label: 'Tax', active: true }
    ];
    this.list();
  }
  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
    this.taxservices.getAll(params).subscribe({
      next: (tax) => {
        this.tax = tax.datas;
        this.cd.detectChanges()
        this.count = tax.totalItems || 0;
        if (tax.totalItems) this.count = tax.totalItems;
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

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  setActiveTax(content: any, tax: Tax, index: number): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentTax = tax;
    this.addAction = false;
    this.viewAction = true;
  }
  refreshList(type: any): void {
    this.addAction = false;
    if (type == 'cancel') {
      this.viewAction = true;
    } else {
      this.modalService.dismissAll();
      if (type == 'refresh') this.list();
      this.currentIndex = -1;
    }
  }
  addtax(content: any): void {
    this.modalService.open(content);
    this.addAction = true;
    this.viewAction = false;
    this.currentIndex = -1;
    this.currentTax = {};
  }
  edittax(taxx: Tax): void {
    this.addAction = true;
    this.viewAction = false;
    let etax = Object.assign({}, taxx);
    this.currentTax = etax;
  }
}
