import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { LeavesType, Leavespaginate } from 'src/app/pages/purchaser/models/leavetypes';
import { LeavesType, Leavespaginate } from '../../models/leavetypes';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
// import { LeaveTypesService } from 'src/app/pages/purchaser/services/leave-types.service';
import { LeaveTypeService } from '../../services/leave-types.service';

@Component({
  selector: 'app-leaves-types',
  templateUrl: './leaves-types.component.html',
  styleUrls: ['./leaves-types.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeavesTypesComponent implements OnInit {
  roles?: LeavesType[];
  rolespaginate?: Leavespaginate = {};
  currentRoles: LeavesType = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  breadCrumbItems: Array<{}> = [];
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize: any = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(
    private RoleServiceService: LeaveTypeService,
    private modalService: NgbModal,
    private toast: ToastService,
    private utlis: UtilsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/app/dashboard' },
      { label: 'Departments', active: true }
    ];
    this.list();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
    this.RoleServiceService.getAll(params).subscribe({
      next: (roles) => {
        this.roles = roles.datas;
        this.count = roles.totalItems || 0;
        if (roles.totalItems) {
          this.count = roles.totalItems;
        }
        this.cd.detectChanges();
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });
    this.cd.detectChanges();
  }

  handlePageChange(event: any): void {
    // //console.log('insode', event);
    this.page = event;
    this.list();
  }
  handlePageSizeChange(event: any): void {
    // //console.log('insode size', event);
    this.pageSize = event.target.value;
    this.page = 1;
    this.list();
  }

  setActiveRoles(content: any, department: LeavesType, index: number): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentRoles = department;
    this.addAction = false;
    this.viewAction = true;
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
  addRoles(content: any): void {
    this.modalService.open(content);
    this.addAction = true;
    this.viewAction = false;
    this.currentIndex = -1;
    this.currentRoles = {};
  }
  editRoles(roles: LeavesType): void {
    this.addAction = true;
    this.viewAction = false;
    let role = Object.assign({}, roles);
    this.currentRoles = role;
  }
}
