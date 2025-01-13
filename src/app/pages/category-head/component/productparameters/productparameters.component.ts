import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Categories } from '../../models/categories';
import { Department } from '../../models/department';
import { Group } from '../../models/groups';
import { Productparameters, Productparameterspaginate } from '../../models/productparameters';
import { Subcategories } from '../../models/subcategories';
import { DepartmentsService } from '../../services/departments.service';
import { ProductparametersService } from '../../services/productparameters.service';
import { ProductvariantsService } from '../../services/productvariants.service';

@Component({
  selector: 'app-productparameters',
  templateUrl: './productparameters.component.html',
  styleUrls: ['./productparameters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductparametersComponent implements OnInit {


  productparameters?: Productparameters[];
  productparameterpaginate?: Productparameterspaginate = {};
  currentProductparameter: Productparameters = {};
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
  subclass: Subcategories[] = [];
  groups: Group[] = [];

  selectedDept = ''; selectedBrand = ''; selectedClass = ''; selectedSubclass = ''; selectedGroup = '';

  constructor(private productparametersservice: ProductparametersService, private modalService: NgbModal, private toast: ToastService, private productvariantsservice: ProductvariantsService, private utlis: UtilsService, private departmentservice: DepartmentsService, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', url: '/app' }, { label: 'Productparameters', active: true }];
    this.list();

    this.departmentservice.findList()
      .subscribe({
        next: data => {
          this.departments = data;
          this.changeDepartment(this.departments[0])
          
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
    const params = this.getRequestParams(this.search, this.selectedDept, this.selectedClass, this.selectedSubclass, this.selectedGroup, this.page, this.pageSize)
    this.productparametersservice.getAll(params)
      .subscribe({
        next: productparameters => {
          this.productparameters = productparameters.datas;
          this.count = productparameters.totalItems || 0;
          this.ref.detectChanges()
          if (productparameters.totalItems)
            this.count = productparameters.totalItems;
          
        }, error: error => {
          //this.authRedirect.next(error)
        }
      })
  }

  getRequestParams(search: string, dept: string, cat: string, subcat: string, group: string, page: number, pageSize: number): any {
    let params = { 'search': '', 'dept': '', 'cat': '', 'subcat': '', 'group': '', 'page': page, 'size': pageSize };
    if (search)
      params['search'] = search;
   
    if (cat)
      params['cat'] = cat;
    if (subcat)
      params['subcat'] = subcat;
    if (group)
      params['group'] = group;
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

  setActiveProductparameter(content: any, productparameter: Productparameters, index: number, value = ''): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentProductparameter = productparameter;
    this.currentProductparameter.addValue = value === '' ? false : true;
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
  addProductparameter(content: any): void {
    this.modalService.open(content);
    this.addAction = true;
    this.viewAction = false;
    this.currentIndex = -1;
    this.currentProductparameter = {};
  }
  editProductparameter(productparameter: Productparameters, value = ''): void {
    this.addAction = true;
    this.viewAction = false;
    let eproductparameter = Object.assign({}, productparameter)
    this.currentProductparameter = eproductparameter;
  }

  changeDepartment(dept: any) {
    this.selectedClass = '';
    this.selectedSubclass = '';
    this.selectedBrand = '';
    this.class = [];
    this.subclass = [];

    if (dept) {
      this.selectedDept = dept.did;

      this.productvariantsservice.catlist(dept.did)
        .subscribe({
          next: data => {
            this.class = data;
            this.list()
          }
        });

      this.productvariantsservice.subcatlist(dept.did, '0')
        .subscribe({
          next: data => {
            this.subclass = data;
            this.list()
          }
        });

      this.productvariantsservice.grouplist(dept.did, '0')
        .subscribe({
          next: data => {
            this.groups = data;
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
    //console.log(category)
    //this.subclass = [];
    this.selectedSubclass = '';
    if (category) {
      this.selectedClass = category.cid;
      this.productvariantsservice.subcatlist(this.selectedDept, this.selectedClass)
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
          }
        });
    }
    else {
      this.selectedClass = '';
      this.productvariantsservice.subcatlist(this.selectedDept, '0')
        .subscribe({
          next: subclass => {
            this.subclass = subclass;
          }
        });
      this.productvariantsservice.grouplist(this.selectedDept, '0')
        .subscribe({
          next: groups => {
            this.groups = groups;
          }
        });
    }
    this.list()

  }

  changeSubcategory(subcat: any) {
    this.groups = [];
    this.selectedGroup = ''
    if (subcat) {
      this.selectedSubclass = subcat.id;
      this.productvariantsservice.grouplist(this.selectedDept, this.selectedSubclass)
        .subscribe({
          next: groups => {
            this.groups = groups;
          }
        });

    }
    else {
      this.selectedSubclass = ''
      this.productvariantsservice.grouplist(this.selectedDept, '0')
        .subscribe({
          next: groups => {
            this.groups = groups;
          }
        });
    }
    this.list()
  }

  changeGroup(group: any) {
    if (group) {
      this.selectedGroup = group.id;
    }
    else {
      this.selectedGroup = ''
    }
    this.list()
  }

}
