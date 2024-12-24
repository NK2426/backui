import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SortableDirective, SortEvent } from 'src/app/_helpers/directives/advance-sortable.directive';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Categories } from '../../models/categories';
import { Department } from '../../models/department';
import { Group, Grouppaginate } from '../../models/groups';
import { Subcategories } from '../../models/subcategories';
import { DepartmentsService } from '../../services/departments.service';
import { GroupService } from '../../services/group.service';
import { ProductsService } from '../../services/products.service';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
  ,
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})

export class GroupsComponent implements OnInit {

  products?: Group[];
  productsPaginate?: Grouppaginate;
  departments: Department[] = []
  searchdepart = 0;
  currentProduct: Group = {};

  class: Categories[] = [];
  subclass: Subcategories[] = [];

  addAction = false;
  viewAction = false;
  viewValue = false;
  currentIndex = -1;

  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  @ViewChildren(SortableDirective) headers!: QueryList<SortableDirective>;

  selectedDept = ''; selectedClass = ''; selectedSubclass = ''; selectedColumn = ''; selectedDirection = '';

  constructor(private groupService: GroupService, private cdr: ChangeDetectorRef, private modelservice: NgbModal, private toast: ToastService, private utlis: UtilsService, private modalService: NgbModal, private departmentservice: DepartmentsService, private productservice: ProductsService) { }

  ngOnInit(): void {
    this.list();
    this.departmentservice.findList()
      .subscribe({
        next: data => {
          this.departments = data.filter((d: any) => d.did === 3);
          if (this.departments) {
            this.changeDepartment(this.departments[0])
          }
          this.cdr.detectChanges();
        },
        error: () => {
          this.departments = []
        }
      });
  }

  list(): void {
    const params = this.getRequestParams(this.search, this.selectedDept, this.selectedClass, this.selectedSubclass, this.selectedColumn, this.selectedDirection, this.page, this.pageSize)
    this.groupService.getAll(params)
      .subscribe({
        next: products => {
          this.products = products.datas;
          // this.cdr.detectChanges();
          if (products.totalItems)
            this.count = products.totalItems;
          // this.cdr.detectChanges();
        }, error: error => {
          //this.authRedirect.next(error)
        }
      })
  }


  getRequestParams(search: string, dept: string, cat: string, subcat: string, column: string, direction: string, page: number, pageSize: number): any {
    let params = { 'search': '', 'dept': '', 'cat': '', 'subcat': '', 'orderby': '', 'order': '', 'page': page, 'size': pageSize };
    if (search)
      params['search'] = search;
    if (dept)
      params['dept'] = dept;
    if (cat)
      params['cat'] = cat;
    if (subcat)
      params['subcat'] = subcat;
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
  editProduct(product: Group, value = ''): void {
    this.addAction = true;
    this.viewAction = false;
    let eproduct = Object.assign({}, product)
    this.currentProduct = eproduct;
  }

  setActiveProduct(content: any, product: Group, index: number, value = ''): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentProduct = product;
    //this.currentProduct.addValue = value === '' ? false : true;
    this.addAction = false;
    this.viewAction = true;
  }

  changeDepartment(dept: any) {
    this.selectedClass = '';
    this.selectedSubclass = '';

    this.class = [];
    this.subclass = [];

    if (dept) {
      this.selectedDept = dept.did;

      this.productservice.catlist(dept.did)
        .subscribe({
          next: data => {
            this.class = data;
            this.list()
            // this.cdr.detectChanges();
          }
        });
      this.productservice.subcatlist(dept.did, '0')
        .subscribe({
          next: data => {
            this.subclass = data;
            this.list()
            // this.cdr.detectChanges();
          }
        });
    }
    else {
      this.selectedDept = ''
      this.list()
    }
  }

  changeCategory(category: any) {
    //console.log(category)
    //this.subclass = [];
    this.selectedSubclass = '';
    if (category) {
      this.selectedClass = category.cid;
      this.productservice.subcatlist(this.selectedDept, this.selectedClass)
        .subscribe({
          next: subclass => {
            // let subclassdata: Subcategories[] = []
            // if (subclass.length > 0) {
            //   vendors.forEach((val) => {
            //     if (val.user)
            //       vendordata.push({ id: val.vendor_id, name: val.user.name })
            //   })
            // }
            this.subclass = subclass;
            // this.cdr.detectChanges();
          }
        });
    }
    else {
      this.selectedClass = '';
      this.productservice.subcatlist(this.selectedDept, '0')
        .subscribe({
          next: subclass => {
            // let subclassdata: Subcategories[] = []
            // if (subclass.length > 0) {
            //   vendors.forEach((val) => {
            //     if (val.user)
            //       vendordata.push({ id: val.vendor_id, name: val.user.name })
            //   })
            // }
            this.subclass = subclass;
            // this.cdr.detectChanges();
          }
        });
    }
    this.list()

  }

  changeSubcategory(subcat: any) {

    if (subcat) {
      this.selectedSubclass = subcat.id;
    }
    else {
      this.selectedSubclass = ''
    }
    this.list()
  }

  onSort({ column, direction }: SortEvent | any) {
    // // resetting other headers
    // this.headers.forEach((header) => {
    //   if (header.sortable !== column) {
    //     header.direction = '';
    //   }
    // });
    // if (this.products) {
    //   this.products = this.sortProduct(this.products, column, direction);
    // }
    this.selectedColumn = column;
    this.selectedDirection = direction;
    this.list();
  }


}
