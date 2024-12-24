import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Categories } from '../../models/categories';
import { Department } from '../../models/department';
import { Group, Grouppaginate } from '../../models/groups';
import { Subcategories } from '../../models/subcategories';
import { DepartmentsService } from '../../services/departments.service';
import { GroupService } from '../../services/groups.service';
import { ProductsService } from '../../services/products.service';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent implements OnInit {

  products?: Group[];
  productsPaginate?: Grouppaginate;
  departments: Department[] = []
  searchdepart = 0;
  currentProduct: Group = {};

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

  class: Categories[] = [];
  subclass: Subcategories[] = [];
  selectedDept = ''; selectedClass = ''; selectedSubclass = '';

  constructor(private groupservice: GroupService, private modelservice: NgbModal, private toast: ToastService, private utlis: UtilsService, private modalService: NgbModal, private departmentservice: DepartmentsService, private productservice: ProductsService, private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.list();
    this.groupservice.findList()
      .subscribe({
        next: data => {
          this.departments = data;
          // this.cd.detectChanges();
          this.changeDepartment(this.departments[0]);
          
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
    const params = this.getRequestParams(this.search, this.selectedDept, this.selectedClass, this.selectedSubclass, this.page, this.pageSize)
    this.groupservice.getAllgrp(params)
      .subscribe({
        next: products => {
          this.products = products.datas;
          this.cd.detectChanges();
          this.count = products.totalItems || 0;
          
          if (products.totalItems)
            this.count = products.totalItems;
        }, error: error => {
          //this.authRedirect.next(error)
        }
      })

  }

  getRequestParams(search: string, dept: string, cat: string, subcat: string, page: number, pageSize: number): any {
    let params = { 'search': '', 'dept': '', 'cat': '', 'subcat': '', 'page': page, 'size': pageSize };
    if (search)
      params['search'] = search;
    if (dept)
      params['dept'] = dept;
    if (cat)
      params['cat'] = cat;
    if (subcat)
      params['subcat'] = subcat;
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

  deleteUser(Product: Group): void {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Group Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then((parameterResponse) => {
      this.groupservice.delete(Product).subscribe({
        next: resp => {
          this.toast.success('Group Deleted Successfully');
          this.list();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }, err => {
      //this.toast.failure('Something went wrong.. Product does not delete.');
    });
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
            this.changeCategory(this.class);
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
    this.subclass = [];
    this.selectedSubclass = '';
    if (category) {
      this.selectedClass = category.cid;
      this.productservice.subcatlist(this.selectedClass)
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
            // this.changeSubcategory(this.subclass[0]);
          }
        });
    }
    else {
      this.selectedClass = '';
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

}
