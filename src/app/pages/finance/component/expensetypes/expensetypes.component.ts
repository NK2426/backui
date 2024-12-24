import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Expensetypes, Expensetypespaginate } from '../../models/expensetypes';
import { ExpensetypesService } from '../../services/expensetypes.service';


@Component({
  selector: 'app-expensetypes',
  templateUrl: './expensetypes.component.html',
  styleUrls: ['./expensetypes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensetypesComponent implements OnInit {


  expensetypes?: Expensetypes[];
  expensetypepaginate?: Expensetypespaginate = {};
  currentExpensetype: Expensetypes = {};
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

  constructor(private expensetypesservices: ExpensetypesService, private modalService: NgbModal, private toast: ToastService, private utlis: UtilsService, private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', url: '/app' }, { label: 'Expensetypes', active: true }];
    this.list();
  }
  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.expensetypesservices.getAll(params)
      .subscribe({
        next: expensetypes => {
          this.expensetypes = expensetypes.datas;
          if (expensetypes.totalItems)
            this.count = expensetypes.totalItems;
          this.cd.detectChanges();
        }, error: error => {
          //this.authRedirect.next(error)
        }
      })
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

  setActiveExpensetype(content: any, expensetype: Expensetypes, index: number): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentExpensetype = expensetype;
    this.addAction = false;
    this.viewAction = true;
  }
  refreshList(type: any): void {
    this.addAction = false;
    if (type == 'cancel') {
      this.viewAction = true;
    } else {
      this.modalService.dismissAll();
      if (type == 'refresh')
        this.list();
      this.currentIndex = -1;
    }

  }
  addexpensetype(content: any): void {
    this.modalService.open(content);
    this.addAction = true;
    this.viewAction = false;
    this.currentIndex = -1;
    this.currentExpensetype = {};
  }
  editexpensetype(expensetype: Expensetypes): void {
    this.addAction = true;
    this.viewAction = false;
    let eexpensetype = Object.assign({}, expensetype)
    this.currentExpensetype = eexpensetype;
  }
}
