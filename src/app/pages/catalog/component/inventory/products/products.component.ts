import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { SortableDirective, SortEvent } from 'src/app/_helpers/directives/advance-sortable.directive';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { environment } from 'src/environments/environment';
import { Brands } from '../../../models/brands';
import { Categories } from '../../../models/categories';
import { Department } from '../../../models/department';
import { Group } from '../../../models/groups';
import { Product, Productpaginate } from '../../../models/product';
import { Productvariants } from '../../../models/productvariants';
import { Subcategories } from '../../../models/subcategories';
import { Vendor } from '../../../models/vendor';
import { DepartmentsService } from '../../../services/departments.service';
import { ProductsService } from '../../../services/products.service';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/_themes/shared/shared.module';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule, SharedModule]
})
export class ProductsComponent implements OnInit {

  baseurl = '';
  products?: Product[];
  productsPaginate?: Productpaginate;
  departments: Department[] = []
  searchdepart = 0;
  currentProduct: Product = {};
  vendors: Vendor[] = [];
  variants: Productvariants[] = [];


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

  brands: Brands[] = [];
  class: Categories[] = [];
  subclass: Subcategories[] = [];
  groups: Group[] = [];
  pos: any[] = [];
  showcontents: any[] = [{ id: 1, name: 'Yes' }, { id: 0, name: 'No' }]
  type: any[] = [{ id: 1, name: 'All' }, { id: 2, name: 'Catalog' }, { id: 3, name: 'PO' }]
  @ViewChildren(SortableDirective) headers!: QueryList<SortableDirective>;


  selectedDept = ''; selectedBrand = ''; selectedClass = ''; selectedSubclass = ''; selectedGroup = ''; selectedVendor = ''; selectedColumn = ''; selectedDirection = '';

  selectedtype = 'Catalog'
  constructor(private productservice: ProductsService, private cdr: ChangeDetectorRef, private modelservice: NgbModal, private toast: ToastService, private utlis: UtilsService, private departmentservice: DepartmentsService, private modalService: NgbModal) {


  }

  ngOnInit(): void {
    this.baseurl = environment.CATALOG_URL;
    this.list();


    this.productservice.getpolist()
      .subscribe({
        next: data => {
          this.pos = data;
          // this.cdr.detectChanges();
        },
        error: () => {
          this.pos = []
        }
      });

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
    const params = this.getRequestParams(this.search, this.selectedDept, this.selectedBrand,
      this.selectedClass, this.selectedSubclass, this.selectedGroup, this.selectedVendor,
      this.selectedColumn, this.selectedDirection, this.page, this.pageSize, this.selectedtype)
    this.productservice.getAll(params)
      .subscribe({
        next: products => {
          this.products = products.datas;
          this.count = products.totalItems || 0;
          // this.cdr.detectChanges();
          if (products.totalItems)
            this.count = products.totalItems;
          // this.cdr.detectChanges();
        }, error: error => {
          //this.authRedirect.next(error)
        }
      })
    this.productservice.vendorlist().subscribe({
      next: vendors => {
        this.vendors = vendors
        // this.cdr.detectChanges();
      }
    })

  }

  getRequestParams(search: string, dept: string, brand: string, cat: string, subcat: string, group: string, vendor: string, column: string, direction: string, page: number, pageSize: number, type: string): any {
    //console.log(vendor)
    let params = { 'search': '', 'dept': '', 'brand': '', 'cat': '', 'subcat': '', 'group': '', 'vendor': '', 'orderby': '', 'order': '', 'page': page, 'size': pageSize, type: '' };
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
    if (type)
      params['type'] = type;
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

  deleteUser(Product: Product): void {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Product Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then((parameterResponse) => {
      this.productservice.delete(Product).subscribe({
        next: resp => {
          this.toast.success('Product Deleted Successfully');
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
  editProduct(product: Product, value = ''): void {
    this.addAction = true;
    this.viewAction = false;
    let eproduct = Object.assign({}, product)
    this.currentProduct = eproduct;
  }

  setActiveProduct(content: any, product: Product, index: number, value = ''): void {
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
          }
        });

      this.productservice.brandlist(dept.did)
        .subscribe({
          next: data => {
            this.brands = data;
            this.list()
          }
        });
      this.productservice.subcatlist(dept.did, '0')
        .subscribe({
          next: data => {
            this.subclass = data;
            this.list()
          }
        });

      this.productservice.grouplist(dept.did, '0')
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

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      // console.log('Switch is ON');
      this.selectedtype = 'PO';
    } else {
      // console.log('Switch is OFF');
      this.selectedtype = 'Catalog'
    }
    // console.log(brand);

    if (brand) {

    }
    else {

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


  sortProduct(products: Product[], column: string, direction: string): Product[] {
    if (direction === '' || column === '') {
      return products;
    } else {
      let res: number;
      return [...products].sort((a: any, b: any) => {
        if (column.indexOf('.') != -1) {
          let arrayType = column.split('.');
          if (arrayType.length === 2) { // for depth 2 . Need to write condition for depth 3
            res = this.compare(`${a[arrayType[0]][arrayType[1]]}`, `${b[arrayType[0]][arrayType[1]]}`);
          }
        } else {
          res = this.compare(`${a[column]}`, `${b[column]}`);
        }
        return direction === 'asc' ? res : -res;
      });
    }
  }

  compare(v1: string | number, v2: string | number): any {
    return (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);
  }

}
