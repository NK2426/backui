import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Packagepaginate, Packages } from '../../models/packages';
import { PackageService } from '../../services/package.service';
import { AddpackagesComponent } from './addpackages/addpackages.component';
import { ViewpackagesComponent } from './viewpackages/viewpackages.component';
@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule, ZXingScannerModule, NgbPaginationModule, ViewpackagesComponent, AddpackagesComponent]
})
export class PackagesComponent implements OnInit {

  packages?: Packages[];
  packagepaginate?: Packagepaginate = {};
  currentPackage: Packages = {};
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

  constructor(private packageservices: PackageService, private cdr: ChangeDetectorRef, private modalService: NgbModal, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', url: '/warehouse' }, { label: 'Shelves', active: true }];
    this.list();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.packageservices.getAll(params)
      .subscribe({
        next: shelves => {
          this.packages = shelves.datas;
          this.cdr.detectChanges();
          if (shelves.totalItems)
            this.count = shelves.totalItems;
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

  setActiveDepartment(content: any, packages: Packages, index: number): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentPackage = packages;
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
  addPackage(content: any): void {
    this.modalService.open(content);
    this.addAction = true;
    this.viewAction = false;
    this.currentIndex = -1;
    this.currentPackage = {};
  }
  editPackage(shelf: Packages): void {
    this.addAction = true;
    this.viewAction = false;
    let eshelf = Object.assign({}, shelf)
    this.currentPackage = eshelf;
  }

}
