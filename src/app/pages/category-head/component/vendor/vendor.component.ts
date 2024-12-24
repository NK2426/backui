import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';

import { NgbDatepickerModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { State, Vendor, Vendorpaginate } from '../../models/vendor';
import { VendorService } from '../../services/vendor.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss'],
  standalone: true,
  imports: [FormsModule, NgbPaginationModule, NgbDatepickerModule, CommonModule, RouterModule, NgSelectModule, SharedModule]
})
export class VendorComponent implements OnInit {
  vendors?: Vendor[];
  vendorpaginate?: Vendorpaginate = {};
  currentVendor: Vendor = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  breadCrumbItems: Array<{}> = [];
  roles: Array<{ id: number; name: string }> = [
    { id: 1, name: 'HR' },
    { id: 2, name: 'Category Head' },
    { id: 3, name: 'Purchaser' },
    { id: 4, name: 'Purchase Head' },
    { id: 5, name: 'Warehouse Operator' }
  ];

  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  //deleteaction = false;

  states?: State[];
  public user = JSON.parse(sessionStorage.getItem('token') || '{}');

  constructor(
    private vendorservice: VendorService,
    private cd: ChangeDetectorRef,
    private modelservice: NgbModal,
    private toast: ToastService,
    private utlis: UtilsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/app/dashboard' },
      { label: 'Vendors', active: true }
    ];
    this.list();
    this.vendorservice.getStates().subscribe({
      next: (resp) => {
        this.states = resp.data;
      },
      error: (error) => {}
    });
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }
  searchState(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
    this.vendorservice.getAll(params).subscribe({
      next: (vendors) => {
        this.vendors = vendors.datas;
        this.count = vendors.totalItems || 0;
        if (vendors.totalItems) this.count = vendors.totalItems;
        // this.cd.detectChanges();
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });

    // this.vendorservice.findvenassoc(this.currentVendor.id).subscribe({
    //   next:resp=>{
    //     if(resp.data.length==0)
    //     this.deleteaction = true;
    //   },error:err=>{
    //     //console.log(err);
    //   }
    // })
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
  edit(id: any) {
    this.router.navigate(['/category-head/vendor/edit/'+id])
  }
  findRole(id: any) {
    const role: any = this.roles.find((res) => res.id === parseInt(id));
    return role && role.name ? role.name : '';
  }

  deleteVendor(vendor: Vendor): void {
    if (confirm('Are you sure you want to delete ?')) {
      this.vendorservice.delete(vendor).subscribe({
        next: (resp) => {
          if (resp.status == 200) this.toast.success('Vendor Deleted Successfully');
          else this.toast.failure(resp.message);
          this.list();
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    }
  }
}
