import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Department } from '../../models/department';
import { Subcategories, Subcategoriespaginate } from '../../models/subcategories';
import { DepartmentsService } from '../../services/departments.service';
import { SubcategoriesService } from '../../services/subcategories.service';



@Component({
  selector: 'app-categories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.scss']
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

  constructor(private subcategoriesService: SubcategoriesService, private modalService: NgbModal, private toast: ToastService, private utlis: UtilsService, private departmentservice: DepartmentsService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', url: '/app' }, { label: 'Subcategories', active: true }];
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
    this.subcategoriesService.getAll(params)
      .subscribe({
        next: subcategories => {
          this.subcategories = subcategories.datas;
          this.count = subcategories.totalItems || 0;
          if (subcategories.totalItems)
            this.count = subcategories.totalItems;
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
      this.modalService.dismissAll();
    } else {
      if (type == 'refresh') this.list();
      this.currentIndex = -1;
      this.modalService.dismissAll();
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

}
