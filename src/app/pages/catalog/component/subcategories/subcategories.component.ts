import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Categories } from '../../models/categories';
import { Department } from '../../models/department';
import { Subcategories, Subcategoriespaginate } from '../../models/subcategories';
import { DepartmentsService } from '../../services/departments.service';
import { ProductsService } from '../../services/products.service';
import { SubcategoriesService } from '../../services/subcategories.service';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


import { SortEvent } from 'src/app/_helpers/directives/advance-sortable.directive';
@Component({
  selector: 'app-categories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class SubcategoriesComponent implements OnInit {
  subcategories?: Subcategories[];
  subcategorypaginate?: Subcategoriespaginate = {};
  currentSubcategory: Subcategories = {};
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

  class: Categories[] = [];
  selectedDept = ''; selectedClass = ''; selectedColumn = ''; selectedDirection = '';

  constructor(private subcategoriesService: SubcategoriesService, private cdr: ChangeDetectorRef, private modalService: NgbModal, private toast: ToastService, private utlis: UtilsService, private departmentservice: DepartmentsService, private productservice: ProductsService,) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', url: '/app' }, { label: 'Subcategories', active: true }];
    this.list();

    this.departmentservice.findList()
    .subscribe({
      next: data => {
        this.departments = data.filter((d: any) => d.did === 3);
        if (this.departments) {
          this.changeDepartment(this.departments[0])
        }
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
    const params = this.getRequestParams(this.search, this.selectedDept, this.selectedClass, this.selectedColumn, this.selectedDirection, this.page, this.pageSize)
    this.subcategoriesService.getAll(params)
      .subscribe({
        next: subcategories => {
          this.subcategories = subcategories.datas;
          this.count = subcategories.totalItems || 0;
          // this.cdr.detectChanges();
          if (subcategories.totalItems)
            this.count = subcategories.totalItems;
        }, error: error => {
          //this.authRedirect.next(error)
        }
      })
  }

  getRequestParams(search: string, dept: string, cat: string, column: string, direction: string, page: number, pageSize: number): any {
    let params = { 'search': '', 'dept': '', 'cat': '', 'orderby': '', 'order': '', 'page': page, 'size': pageSize };
    if (search)
      params['search'] = search;
    if (dept)
      params['dept'] = dept;
    if (cat)
      params['cat'] = cat;
    if (column)
      params['orderby'] = column;
    if (direction)
      params['order'] = direction;
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

  setActiveSubcategory(content: any, subcategory: Subcategories, index: number): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentSubcategory = subcategory;
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
  addSubcategory(content: any): void {
    this.modalService.open(content);
    this.addAction = true;
    this.viewAction = false;
    this.currentIndex = -1;
    this.currentSubcategory = {};
  }
  editSubcategory(subcategory: Subcategories): void {
    this.addAction = true;
    this.viewAction = false;
    let esubcategory = Object.assign({}, subcategory)
    this.currentSubcategory = esubcategory;
  }

  changeDepartment(dept: any) {
    this.selectedClass = '';
    this.class = [];

    if (dept) {
      this.selectedDept = dept.did;

      this.productservice.catlist(dept.did)
        .subscribe({
          next: data => {
            this.class = data;
            this.list()
          }
        });
    }
    else {
      this.selectedDept = ''
      this.list()
    }
  }

  changeCategory(category: any) {
    if (category) {
      this.selectedClass = category.cid;
    }
    else {
      this.selectedClass = '';
    }
    this.list()
  }

  onSort({ column, direction }: SortEvent | any) {

    this.selectedColumn = column;
    this.selectedDirection = direction;
    this.list();
  }

}
