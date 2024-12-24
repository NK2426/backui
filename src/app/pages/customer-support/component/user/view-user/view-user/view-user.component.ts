import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../../../../_helpers/toast.service';
import { UtilsService } from '../../../../../../_helpers/utils.service';
import { USER } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
  users?: USER.UserDetail[];
  userPagination!: USER.UserPagination;
  currentUser!: USER.UserDetail;
  currentIndex = -1;

  // Pagination and search config
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  constructor(private userService: UserService, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.getUsersList();
  }



  getUsersList(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.userService.getUsersList(params)
      .subscribe({
        next: (users :any)=> {
          this.users = users.datas;
          if (users.totalItems)
            this.count = users.totalItems;
        }, error: (error:any) => {
          //this.authRedirect.next(error)
        }
      })
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.getUsersList();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getUsersList();
  }

}
