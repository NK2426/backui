import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Grn } from '../../../models/grn';
import { Vendor } from '../../../models/purchaseorder';
import { BundleService } from '../../../services/bundle.service';
import { PurchaseorderService } from '../../../services/purchaseorder.service';
import { Categories, Subcategories } from '../../../models/product';

import { ProductvariantsService } from 'src/app/pages/category-head/services/productvariants.service';
import { Group } from 'src/app/pages/category-head/models/groups';
import { Department } from '../../../models/department';
import { DepartmentsService } from '../../../services/departments.service';

// import { Categories, Subcategories } from '../../../models/product';
// import { ProductvariantsService } from 'src/app/pages/category-head/services/productvariants.service';
// import { Group } from 'src/app/pages/category-head/models/groups';
// import { Department } from '../../../models/department';
// import { DepartmentsService } from '../../../services/departments.service';

@Component({
  selector: 'app-inwardgrnforqc',
  templateUrl: './inwardgrnforqc.component.html',
  styleUrls: ['./inwardgrnforqc.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule]
})
export class InwardgrnforqcComponent implements OnInit {

  grns!: Grn[];
  comments = '';
  fromstatus = 'Create';
  tostatus = 'Process';
  status: Array<{ id: string, name: string }> = [{ id: 'Accepted', name: 'Accepted' }, { id: 'Declined', name: 'Declined' }, { id: 'Approved', name: 'New' }, { id: 'Reject', name: 'Reject' }];
  headapprove = { status: '', halt: '', comments: '' };
  actionreason = false;
  vendors: Vendor[] = []; selectedVendor = '';
  title: any = 'Stock QC';
  type = ''
  changestatus: any = { '': 'New', 'Approved': 'New', 'Vendor_revise': 'Revised', 'Decline': 'Declined', 'Accept': 'Accepted' };
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  bundlereceivedarr: any = []; discrepancyarr: any = [];
  bundlereceivedarritm: any = []; discrepancyarritm: any = [];
  productquantity: any = [];

  departments: Department[] = []
  class: Categories[] = [];
  subclass: Subcategories[] = [];
  groups: Group[] = [];

  selectedDept = ''; selectedBrand = ''; selectedClass = ''; selectedSubclass = ''; selectedGroup = '';

  constructor(
    private route: ActivatedRoute, private router: Router,
    private bundleservice: BundleService, private toast: ToastService,
    private modelservice: NgbModal, private cdr: ChangeDetectorRef,
    private porderservice: PurchaseorderService, private productvariantsservice: ProductvariantsService, private departmentservice: DepartmentsService
  ) { }

  ngOnInit(): void {
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
    const params = this.getRequestParams(this.search, this.selectedVendor, this.page, this.pageSize, this.selectedDept, this.selectedClass, this.selectedSubclass, this.selectedGroup,)
    this.bundleservice.getGrn(params)
      .subscribe({
        next: resp => {
          this.grns = resp.datas || [];
          // console.log(resp.totalItems,this.grns);
          
          this.count = resp.totalItems && resp.totalItems || 0;
          this.cdr.detectChanges();
        },
        error: () => {
          this.toast.failure('Error retriving data! Try again')
        }
      });
    this.porderservice.vendorlist().subscribe({
      next: vendors => {
        this.vendors = vendors
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

  getInteger(num: any) {
    return parseInt(num);
  }

  getRequestParams(search: string, vendor: string, page: number, pageSize: number, dept: string, cat: string, subcat: string, group: string,): any {
    let params = { 'search': '', 'vendor': '', 'page': page, 'size': pageSize, 'dept': '', 'cat': '', 'subcat': '', 'group': '', };
    if (search)
      params['search'] = search;
    if (vendor)
      params['vendor'] = vendor;
    if (page)
      params['page'] = page - 1;
    if (pageSize)
      params['size'] = pageSize;
    if (cat)
      params['cat'] = cat;
    if (subcat)
      params['subcat'] = subcat;
    if (group)
      params['group'] = group;
    if (dept)
      params['dept'] = dept;

    return params;
  }

  changeVendor(vendor: any) {
    if (vendor) {
      this.selectedVendor = vendor.uid;
    }
    else {
      this.selectedVendor = ''
    }
    this.list()
  }

  novarient(content: any) {
    this.modelservice.open(content);
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
      // console.log('error');
    }
  }

  changeCategory(category: any) {
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


