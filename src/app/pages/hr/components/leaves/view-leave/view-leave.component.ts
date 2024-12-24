import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
// import { Leaves } from 'src/app/pages/purchaser/models/leaves';
import { Leaves } from '../../../models/leaves';
// import { LeaveService } from 'src/app/pages/purchaser/services/leave.service';
import { LeaveService } from '../../../services/leave.service';

@Component({
  selector: 'app-view-leave',
  templateUrl: './view-leave.component.html',
  styleUrls: ['./view-leave.component.scss']
})
export class ViewLeaveComponent implements OnInit {
  viewuser: Leaves = {};
  roles: Array<{ id: number, name: string }> = [{ id: 1, name: 'HR' }, { id: 2, name: 'Category Head' }, { id: 3, name: 'Purchaser' }, { id: 4, name: 'Purchase Head' }, { id: 5, name: 'Warehouse Operator' }];
  breadCrumbItems: Array<{}> = [];

  constructor(
    private route: ActivatedRoute, private router: Router,
    private leaveservice: LeaveService, private toast: ToastService
  ) { }

  ngOnInit(): void {
    let uuid = this.route.snapshot.paramMap.get('uuid');
    // if(history.state.uuid ){
    this.leaveservice.find(history.state.uuid || uuid)
      .subscribe({
        next: data => {
          this.viewuser = data;
        },
        error: (err) => {
          //console.log("error inside")
          // this.router.navigate(['/hr/leaves']);
        }
      })
    // }else{
    //   this.router.navigate(['/app/leaves']);
    // }
  }

  findRole(id: number) {
    const role: any = this.roles.find(res => res.id === id)
    return role.name ? role.name : '';
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

  save(status: any) {
    let statval = 1;
    if (status == 'reject') {
      this.router.navigate(['/hr/leaves']);
    }
    statval = 2;
    let data = { status: statval, uuid: this.viewuser.uuid }
    this.leaveservice.approve(data).subscribe({
      next: resp => {
        if (statval == 1)
          this.toast.success('Leave request Approved');
        else
          this.toast.success('Leave request Rejected');
        this.router.navigate(['/hr/leaves']);
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    })
  }

}
