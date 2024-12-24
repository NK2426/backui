import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgbDatepickerModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { environment } from 'src/environments/environment';
import { Department } from '../../models/department';
import { Product, Productpaginate } from '../../models/product';
import { Productvariants } from '../../models/productvariants';
import { Brands, Categories, Subcategories, Vendor } from '../../models/purchaseorder';
import { DepartmentsService } from '../../services/departments.service';

import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { ProductsService } from '../../services/products.service';
import { MapvariantComponent } from '../mapvariant/mapvariant.component';
import { VendormappingComponent } from '../vendormapping/vendormapping.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    CommonModule,
    RouterModule,
    MapvariantComponent,
    VendormappingComponent,
    NgSelectModule,
    SharedModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {
  baseurl = '';
  products?: Product[];
  productsPaginate?: Productpaginate;
  departments: Department[] = [];
  searchdepart = 0;
  currentProduct: Product = {};
  vendors: Vendor[] = [];
  variants: Productvariants[] = [];

  addAction = false;
  viewAction = false;
  viewValue = false;
  currentIndex = -1;

  /// Paginate ////
  search: any = '';
  psearch = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  brands: Brands[] = [];
  class: Categories[] = [];
  subclass: Subcategories[] = [];
  selectedDept = '';
  selectedBrand = '';
  selectedClass = '';
  selectedSubclass = '';
  selectedVendor = '';

  constructor(
    private productservice: ProductsService,
    private modelservice: NgbModal,
    private utlis: UtilsService,
    private departmentservice: DepartmentsService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.baseurl = environment.CATEGORY_HEAD_SITE_URL;
    this.list();

    this.departmentservice.findList().subscribe({
      next: (data: any) => {
        this.departments = data.filter((d: any) => d.did === 3);
        // this.selectedDept = this.departments[0].did + '';
        this.changeDepartment(this.departments[0]);
      },
      error: () => {
        this.departments = [];
      }
    });

    this.productservice.vendorlist().subscribe({
      next: (vendors: any) => {
        //console.log(vendors)
        this.vendors = vendors.filter((v: any) => v.name.toString().toLowerCase())
        //console.log(this.vendors)
      }
    });
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.getRequestParams(
      this.search,
      this.selectedDept,
      this.selectedBrand,
      this.selectedClass,
      this.selectedSubclass,
      this.selectedVendor,
      this.psearch,
      this.page,
      this.pageSize
    );
    this.productservice.getAll(params).subscribe({
      next: (products: any) => {
        this.products = products.datas;
        this.count = products.totalItems || 0;
        if (products.totalItems) {
          this.count = products.totalItems;
        }
        this.cd.detectChanges();
      },
      error: (error: any) => {
        //this.authRedirect.next(error)
      }
    });

    this.productservice.brandlist(this.selectedDept || 0).subscribe({
      next: (data: any) => {
        this.brands = data;
        // this.cd.detectChanges();
      }
    });
  }

  getRequestParams(
    search: string,
    dept: string,
    brand: string,
    cat: string,
    subcat: string,
    vendor: string,
    psearch: string,
    page: number,
    pageSize: number
  ): any {
    let params = { search: '', dept: '', brand: '', cat: '', subcat: '', vendor: '', psearch: '', page: page, size: pageSize };
    if (search) params['search'] = search;
    if (psearch) params['psearch'] = psearch;
    if (dept) params['dept'] = dept;
    if (brand) params['brand'] = brand;
    if (cat) params['cat'] = cat;
    if (subcat) params['subcat'] = subcat;
    if (vendor) params['vendor'] = vendor;
    if (page) params['page'] = page - 1;
    if (pageSize) params['size'] = pageSize;

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
    if (confirm('Are you sure you want to delete this Product?')) {
      this.productservice.delete(Product).subscribe({
        next: (resp: any) => {
          // console.log(resp);
          this.toast.success('Product Deleted Successfully');
          this.list();
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    }
  }

  refreshList(type: any): void {
    this.addAction = false;
    if (type == 'cancel') {
      this.viewAction = true;
    } else {
      this.modalService.dismissAll();
      if (type == 'refresh') this.list();
      this.currentIndex = -1;
    }
  }
  editProduct(product: any, value = ''): void {
    this.addAction = true;
    this.viewAction = false;
    let eproduct = Object.assign({}, product);
    this.currentProduct = eproduct;
  }

  setActiveProduct(content: any, product: Product, index: number, value = ''): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentProduct = product;
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

      this.productservice.catlist(dept.did).subscribe({
        next: (data: any) => {
          this.class = data;
          this.list();
        }
      });
    } else {
      this.selectedDept = '';
      this.list();
    }
  }

  changeCategory(category: any) {
    this.subclass = [];
    this.selectedSubclass = '';
    if (category) {
      this.selectedClass = category.cid;
      this.productservice.subcatlist(this.selectedClass).subscribe({
        next: (subclass: any) => {
          this.subclass = subclass;
          // this.cd.detectChanges();
        }
      });
    } else {
      this.selectedClass = '';
    }
    this.list();
  }

  changeVendor(vendor: any) {
    if (vendor) {
      this.selectedVendor = vendor.uid;
    } else {
      this.selectedVendor = '';
    }

    //console.log(this.selectedVendor)
    this.list()
  }

  changeBrand(brand: any) {
    if (brand) {
      this.selectedBrand = brand.bid;
    } else {
      this.selectedBrand = '';
    }
    this.list();
  }

  changeSubcategory(subcat: any) {
    if (subcat) {
      this.selectedSubclass = subcat.id;
    } else {
      this.selectedSubclass = '';
    }
    this.list();
  }

  src: string;
  showFullImage(event: any, image: any) {
    // console.log(event, event.target, event.target.src);
    this.modalService.open(image, { size: 'lg' });
    this.src = event.target.src;
  }
}
