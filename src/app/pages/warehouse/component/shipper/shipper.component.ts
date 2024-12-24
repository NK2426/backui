import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Shipper, Shipperpaginate } from '../../models/shipper';
import { ShipperService } from '../../services/shipper.service';
import { AddshipperComponent } from './addshipper/addshipper.component';
import { ViewshipperComponent } from './viewshipper/viewshipper.component';

@Component({
  selector: 'app-shipper',
  templateUrl: './shipper.component.html',
  styleUrls: ['./shipper.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule, ViewshipperComponent, AddshipperComponent]
})
export class ShipperComponent implements OnInit {

  departments?: Shipper[];
  departmentpaginate?: Shipperpaginate = {};
  currentDepartment: Shipper = {};
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

  constructor(private shipperservice: ShipperService, private modalService: NgbModal, private cdr: ChangeDetectorRef, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', url: '/app' }, { label: 'Departments', active: true }];
    this.list();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.shipperservice.getAll(params)
      .subscribe({
        next: shippers => {
          this.departments = shippers.datas;
          this.cdr.detectChanges();
          if (shippers.totalItems)
            this.count = shippers.totalItems;
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

  setActiveDepartment(content: any, department: Shipper, index: number): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentDepartment = department;
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
  addDepartment(content: any): void {
    this.modalService.open(content);
    this.addAction = true;
    this.viewAction = false;
    this.currentIndex = -1;
    this.currentDepartment = {};
  }
  editDepartment(department: Shipper): void {
    this.addAction = true;
    this.viewAction = false;
    let edepartment = Object.assign({}, department)
    this.currentDepartment = edepartment;
  }

}
