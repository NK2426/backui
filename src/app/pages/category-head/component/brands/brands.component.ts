import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Brands, Brandspaginate } from '../../models/brands';
import { Department } from '../../models/department';
import { BrandsService } from '../../services/brands.service';
import { DepartmentsService } from '../../services/departments.service';



@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsComponent implements OnInit {
  brands?: Brands[];
  brandpaginate?: Brandspaginate = {};
  currentBrand: Brands = {};
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
  departments: Department[] = []
  searchdepart = 0;

  constructor(private brandsservices: BrandsService, private modalService: NgbModal, private toast: ToastService, private utlis: UtilsService, private departmentservice: DepartmentsService, private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', url: '/app' }, { label: 'Brands', active: true }];
    this.list();
    this.departmentservice.findList()
      .subscribe({
        next: data => {
          this.departments = data;
          this.searchdepart = this.departments[0].did;
          // this.cd.detectChanges();
        },
        error: () => {
          this.departments = []
        }
      });
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.searchdepart + '#' + this.search, this.page, this.pageSize)
    this.brandsservices.getAll(params)
      .subscribe({
        next: brands => {
          this.brands = brands.datas;
          this.count = brands.totalItems || 0;
          this.cd.detectChanges();
          if (brands.totalItems)
            this.count = brands.totalItems;
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

  setActiveBrand(content: any, brand: Brands, index: number): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentBrand = brand;
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
  addbrand(content: any): void {
    this.modalService.open(content);
    this.addAction = true;
    this.viewAction = false;
    this.currentIndex = -1;
    this.currentBrand = {};
  }
  editbrand(brand: Brands): void {
    this.addAction = true;
    this.viewAction = false;
    let ebrand = Object.assign({}, brand)
    this.currentBrand = ebrand;
  }

}
