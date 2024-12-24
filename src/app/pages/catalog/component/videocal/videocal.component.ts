import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { Store, StorePaginate } from '../../models/store';
import { StoreManagerService } from '../../services/store.service';
import { video, videoPaginate } from '../../models/videoModel';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-videocal',
  templateUrl: './videocal.component.html',
  styleUrls: ['./videocal.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SharedModule,
    NgSelectModule, RouterModule]
})

export class VideocalComponent {
  statusList: any = [
    {
      label: "Completed", value: 1,
    },
    {
      label: "Not Completed", value: 0,
    },
    {
      label: "InProgress", value: 2,
    }
  ]
  warehouses?: video[];
  departmentpaginate?: videoPaginate = {};
  currentWarehouse: Store = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  breadCrumbItems: Array<{}> = [];
  status: string = '';  // Default value for the status dropdown
  /// Paginate //////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  disputeForm!: FormGroup;
  currnetitem: any;
  submit: boolean = false;
  slots:any
  selectedSlot=''
  selectedDate: string = ''

  constructor(
    private warehouseservice: VideoService,
    private router: Router,
    private modelservice: NgbModal,
    private cdr: ChangeDetectorRef,
    private fbdisput: FormBuilder,
    private toast: ToastService,
    private utlis: UtilsService,
  ) { }

  ngOnInit(): void {
    this.warehouseservice.getslots().subscribe({
      next: (warehouses) => {
        this.slots = warehouses.data;
       
        this.cdr.detectChanges();
      },
      error: (error) => {
        // Handle error
      }
    });
    this.list();
    this.disputeForm = this.fbdisput.group({
      status: [0, Validators.required],
      comments: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.disputeForm.get('status')?.setValue(this.statusList[1].value);
  }

  get form() {
    return this.disputeForm.controls;
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  setActiveCategory(content: any, category: any, index: number): void {
    this.modelservice.open(content);
    this.currnetitem = category;
    this.currentIndex = index;
    this.addAction = false;
    this.viewAction = true;
  }

  getRequestParams(search: string, page: number, pageSize: number,  slot: string,date: string): any {
    let params = { 'search': '', 'page': page, 'size': pageSize, 'slot': '', 'date': '' };
    if (search) params['search'] = search;
    if (page) params['page'] = page - 1;
    if (pageSize) params['size'] = pageSize;
    if (date) params['date'] = date;
    if (slot) params['slot'] = slot;
    return params;
  }

  list(): void {
    const params = this.getRequestParams(this.search, this.page, this.pageSize,this.selectedSlot,this.selectedDate);
    this.warehouseservice.getAll(params).subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses.datas;
        this.count = warehouses.totalItems || 0;
        this.cdr.detectChanges();
        if (warehouses.totalItems) this.count = warehouses.totalItems;
      },
      error: (error) => {
        // Handle error
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

 

  changeStatus() {
    this.submit = true;
    if (this.disputeForm.invalid) {
      return;
    }
    this.warehouseservice.update(this.disputeForm.value, this.currnetitem.id).subscribe({
      next: (warehouses) => {
        // console.log(warehouses);
        this.toast.success('Status Changed');
        this.list();
        this.modelservice.dismissAll();
      },
      error: (error) => {
        // Handle error
      }
    });
  }

  changeSlot(vendor: any) {
    //console.log(vendor)
    if (vendor) {
      this.selectedSlot = vendor.id;
      //console.log(this.selectedVendor)
    }
    else {
      this.selectedSlot = ''
    }
    this.list()
  }
  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.list();
  } 
}
