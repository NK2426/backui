import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Leaves, Leavespaginate } from 'src/app/pages/purchaser/models/leaves';
import { Leaves, Leavespaginate } from '../../models/leaves';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
// import { LeaveService } from 'src/app/pages/purchaser/services/leave.service';
import { LeaveService } from '../../services/leave.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';


@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeavesComponent implements OnInit {
  users?: Leaves[];
  userpaginate?: Leavespaginate = {};
  currentUser: Leaves = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  breadCrumbItems: Array<{}> = [];
  roles: Array<{ id: number, name: string }> = [{ id: 1, name: 'HR' }, { id: 2, name: 'Category Head' }, { id: 3, name: 'Purchaser' }, { id: 4, name: 'Purchase Head' }, { id: 5, name: 'Warehouse Operator' }];

  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize: any = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(private userservice: LeaveService, private modelservice: NgbModal, private toast: ToastService, private utlis: UtilsService, private router: Router, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    // this.breadCrumbItems = [{ label: 'view', url: '/hr/leaves' }, { label: 'Users', active: true }];
    this.list();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.userservice.getAll(params)
      .subscribe({
        next: users => {
          this.users = users.datas;
          //console.log(this.users);
          if (users.totalItems) {
            this.count = users.totalItems;
          }
          this.cd.detectChanges()
        }, error: error => {
          //this.authRedirect.next(error)
        }
      })
    this.cd.detectChanges()
  }
  handlePageChange(event: any): void {
    this.page = event;
    this.list();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.list();
  }

  findRole(id: any) {
    const role: any = this.roles.find(res => res.id === parseInt(id))
    return role.name ? role.name : '';
  }

  deleteUser(user: Leaves): void {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Leave Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then((parameterResponse) => {
      this.userservice.delete(user).subscribe({
        next: resp => {
          this.toast.success('Leave Deleted Successfully');
          this.list();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
      this.cd.detectChanges()
    }, err => {
      this.toast.failure('Something went wrong.. User does not delete.');
    });
  }

  getstatus(status: any): any {
    if (status == 0) {
      return 'Request';
    }
    else if (status == 1) {
      return 'Approved';
    }
    else if (status == 2) {
      return 'Rejected';
    }
  }

  viewEdit(link: string) {
    //console.log("view edit fc");
    //console.log(link);
    if (link === 'view') {
      //console.log("inside view");
      this.router.navigate(['view'])
    }
  }
}
