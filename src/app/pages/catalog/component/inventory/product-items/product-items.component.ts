import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { environment } from 'src/environments/environment';
import { Brands } from '../../../models/brands';
import { Categories } from '../../../models/categories';
import { Department } from '../../../models/department';
import { Group } from '../../../models/groups';
import { Item } from '../../../models/item';
import { Subcategories } from '../../../models/subcategories';
import { USER } from '../../../models/user';
import { DepartmentsService } from '../../../services/departments.service';
import { ProductsService } from '../../../services/products.service';
import { WebteamService } from '../../../services/webteam.service';

@Component({
  selector: 'app-product-items',
  templateUrl: './product-items.component.html',
  styleUrls: ['./product-items.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class ProductItemsComponent implements OnInit {
  productItemList: Item[] = [];
  currentIndex = -1;
  viewCompare = false;

  type = ''
  inwarditemcount = ''
  baseurl: string = '';

  /// FILTER 
  departments: Department[] = []
  selectedDept = ''; selectedBrand = ''; selectedClass = ''; selectedSubclass = ''; selectedGroup = ''; selectedVendor = ''; selectedColumn = ''; selectedDirection = '';
  brands: Brands[] = [];
  class: Categories[] = [];
  subclass: Subcategories[] = [];
  groups: Group[] = [];

  showcontents: any[] = [{ id: 1, name: 'Yes' }, { id: 0, name: 'No' }]
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  users: USER.UserDetail[] = [];


  constructor(
    private webteamservice: WebteamService, private cdr: ChangeDetectorRef, private toast: ToastService, private departmentservice: DepartmentsService, private productservice: ProductsService,
    private utils: UtilsService) { }

  ngOnInit(): void {
    this.baseurl = environment.PDF_BASE_URL;
    this.list()
    this.departmentservice.findList()
      .subscribe({
        next: data => {
          this.departments = data.filter((d: any) => d.did === 3);
          if (this.departments) {
            this.changeDepartment(this.departments[0])
          }
          // this.cdr.detectChanges();
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

    const params = this.getRequestParams(this.search, this.selectedDept, this.selectedBrand, this.selectedClass, this.selectedSubclass, this.selectedGroup, this.selectedVendor, this.selectedColumn, this.selectedDirection, this.page, this.pageSize)

    this.webteamservice.getAllProductItem(params)
      .subscribe({
        next: items => {
          this.productItemList = items.datas || [];
          this.users = items.users || [];
          this.users.find(t => t.name);


          this.count = items.totalItems || 0;
          // this.cdr.detectChanges()
        },
        error: () => {
        }
      });
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

  ///filter changes
  getRequestParams(search: string, dept: string, brand: string, cat: string, subcat: string, group: string, vendor: string, column: string, direction: string, page: number, pageSize: number): any {
    //console.log(vendor)
    let params = { 'search': '', 'dept': '', 'brand': '', 'cat': '', 'subcat': '', 'group': '', 'vendor': '', 'orderby': '', 'order': '', 'page': page, 'size': pageSize };
    if (search)
      params['search'] = search;
    if (dept)
      params['dept'] = dept;
    if (brand)
      params['brand'] = brand;
    if (cat)
      params['cat'] = cat;
    if (subcat)
      params['subcat'] = subcat;
    if (group)
      params['group'] = group;
    if (vendor != undefined)
      params['vendor'] = vendor;
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

  changeDepartment(dept: any) {
    this.selectedClass = '';
    this.selectedSubclass = '';
    this.selectedBrand = '';
    this.class = [];
    this.subclass = [];
    this.brands = [];

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

      this.productservice.brandlist(dept.did)
        .subscribe({
          next: data => {
            this.brands = data;
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

      this.productservice.grouplist(dept.did, '0')
        .subscribe({
          next: data => {
            this.groups = data;
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

  changeVendor(vendor: any) {
    //console.log(vendor)
    if (vendor) {
      this.selectedVendor = vendor.id;
      //console.log(this.selectedVendor)
    }
    else {
      this.selectedVendor = ''
    }
    this.list()
  }

  changeBrand(brand: any) {
    if (brand) {
      this.selectedBrand = brand.bid;
    }
    else {
      this.selectedBrand = ''
    }
    this.list()
  }

  changeSubcategory(subcat: any) {
    this.groups = [];
    this.selectedGroup = ''
    if (subcat) {
      this.selectedSubclass = subcat.id;
      this.productservice.grouplist(this.selectedDept, this.selectedSubclass)
        .subscribe({
          next: groups => {
            this.groups = groups;
            // this.cdr.detectChanges();
          }
        });

    }
    else {
      this.selectedSubclass = ''
      this.productservice.grouplist(this.selectedDept, '0')
        .subscribe({
          next: groups => {
            this.groups = groups;
            // this.cdr.detectChanges();
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

  downloadreport() {
    const params = this.getRequestParams(this.search, this.selectedDept, this.selectedBrand, this.selectedClass, this.selectedSubclass, this.selectedGroup, this.selectedVendor, 'updatedAt', 'desc', 0, 0)
    this.webteamservice.downloadreport(params).subscribe({
      next: (resp) => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = this.baseurl + resp.data.filename;
          link.target = 'new';
          //link.download = path;
          document.body.appendChild(link);
          link.click();
          link.remove();
          // this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.toast.failure('Error while download file : ' + err.error.message);
      }
    });
  }

  getUser(id: any) {
    let user = this.users.find(x => x.uid == id)
    // console.log(this.users.find(x => x.uid == id));
    // console.log(user?.name);
    return user?.name;
  }

}
