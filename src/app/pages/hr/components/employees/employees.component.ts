import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
// import { Userpaginate, User } from 'src/app/pages/purchaser/models/user';
import { Userpaginate, User } from '../../models/user';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { DatePipe } from '@angular/common';
import { NgbPagination, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
// import { UsersService } from 'src/app/_helpers/users.service';
import { UsersService } from '../../services/users.service';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';

import _from from 'lodash';
import _ from 'lodash';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-employees',
  // standalone: true,
  // imports: [DatePipe, NgbTypeaheadModule, NgbPagination],
  providers: [DatePipe],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesComponent implements OnInit {
  apiResponce: any = [];
  dataSource: any;
  users?: User[];
  userpaginate?: Userpaginate = {};
  currentUser: User = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  breadCrumbItems: Array<{}> = [];
  roles: Array<{ id: number, name: string }> = [{ id: 1, name: 'HR' }, { id: 2, name: 'Category Head' }, { id: 3, name: 'Purchaser' }, { id: 4, name: 'Purchase Head' }, { id: 5, name: 'Warehouse Operator' }, { id: 6, name: 'Vendor' }, { id: 7, name: 'Web Team' }, { id: 8, name: 'Finance' }, { id: 9, name: 'Content Writer' }, { id: 10, name: 'Customer Support' }, { id: 11, name: 'Content Manager' }, { id: 12, name: 'Picker' }, { id: 13, name: 'Packer' }];
  type: any = ''
  title: any = 'ALL Employees';
  selected: any;

  /// Paginate ////
  search = '';
  searcht: any;
  page = 1;
  count = 0;
  pageSize: any = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(private modelservice: NgbModal, private toast: ToastService, private utlis: UtilsService, private route: ActivatedRoute, private router: Router, private cd: ChangeDetectorRef, private userservice: UsersService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', url: '/app/dashboard' }, { label: 'Users', active: true }];
    let type = this.route.snapshot.paramMap.get('status') || '';
    this.type = type;
    //if(type)
    //type = type[0].toUpperCase() + type.slice(1);

    this.list();
    let labels: any = { '0': 'Blacklisted' }

    this.title = labels[type] || 'Employees';
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.userservice.getAll(params, this.type)
      .subscribe({
        next: users => {
          //console.log("user inside");
          //console.log(users.datas);
          // console.log(users);
          this.count = users.totalItems || 0;
          this.cd.detectChanges();
          this.users = users.datas;
          // console.log(this.users);
          this.apiResponce = users.datas;
          this.dataSource = new MatTableDataSource(users.datas);


          if (users.totalItems) {
            //console.log('detection');;
            this.count = users.totalItems;
            //console.log(this.count);
            this.cd.detectChanges();
          }
          this.cd.detectChanges();
        }, error: error => {
          //console.log('error inside');
          // this.authRedirect.next(error)
        }
      })
  }

  onSelect(str: any) {
    //console.log(str);
    if (str === 'active') {
      this.users = this.users.filter(x => x.status);
      //console.log(this.selected);
      //console.log(this.users);
    }
    if (str === 'inactive') {
      //console.log("inactive inside")
      this.users = this.users.filter(x => x.status);
    }
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }
  searchF(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();

    //console.log(event);
    // if (event === 'active') {
    //   this.users = this.users.filter(x => x.status);
    //   //console.log(this.selected);
    //   //console.log(this.users);
    // }
    // if (event === 'inactive') {
    //   //console.log("inactive inside")
    //   this.users = this.users.filter(x => x.status);
    // }
  }

  handlePageChange(event: any): void {
    //console.log('insode', event);
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

  deleteUser(user: User): void {
    //console.log(user);
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'User Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then((parameterResponse) => {
      this.userservice.delete(user).subscribe({
        next: resp => {
          this.toast.success('User Deleted Successfully');
          this.list();
          this.cd.detectChanges()
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }, err => {
      //this.toast.failure('Something went wrong.. User does not delete.');
    });
  }

  viewEdit(link: string, id: any) {
    //console.log(link);

    if (link === "edit") {
      //console.log('edit', id);
      this.router.navigate(['/hr/edit/' + id], { state: { data: id } });
    }
    if (link === "view") {
      //console.log('insode', id);
      // //console.log(this.router.navigate);

      this.router.navigate(['/hr/view/' + id]);
    }
  }

  onChange($event: any) {
    // //console.log($event);
    // this.search = ($event.target as HTMLInputElement).value;
    // //console.log(this.search)
    // this.list();
    //console.log($event.value);
    let data = $event.value;
    //console.log(this.apiResponce);
    this.searcht = ($event.target as HTMLInputElement).value;
    // var filterData: any;
    this.searcht = _.filter(this.apiResponce, (item) => {
      //console.log(item);
      // //console.log(filterData);
      return item.status.toLowerCase() == $event.value.toLowerCase();
    })
    this.dataSource = new MatTableDataSource(this.searcht);
  }
}
