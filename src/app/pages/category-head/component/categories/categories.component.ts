import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Categories, Categoriespaginate } from '../../models/categories';
import { Department } from '../../models/department';
import { CategoriesService } from '../../services/categories.service';
import { DepartmentsService } from '../../services/departments.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {


  categories?: Categories[];
  categorypaginate?: Categoriespaginate = {};
  currentCategory: Categories = {};
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


  constructor(private caregoriesservices: CategoriesService, private departmentservice: DepartmentsService, private modalService: NgbModal, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', url: '/app' }, { label: 'Categories', active: true }];
    this.list();

    this.departmentservice.findList()
      .subscribe({
        next: data => {
          this.departments = data;
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
    this.caregoriesservices.getAll(params)
      .subscribe({
        next: categories => {
          this.categories = categories.datas;
          if (categories.totalItems)
            this.count = categories.totalItems;
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

  setActiveCategory(content: any, category: Categories, index: number): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentCategory = category;
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
  addCategory(content: any): void {
    this.modalService.open(content);
    this.addAction = true;
    this.viewAction = false;
    this.currentIndex = -1;
    this.currentCategory = {};
  }
  editCategory(category: Categories): void {
    this.addAction = true;
    this.viewAction = false;
    let ecategory = Object.assign({}, category)
    this.currentCategory = ecategory;
  }

}
