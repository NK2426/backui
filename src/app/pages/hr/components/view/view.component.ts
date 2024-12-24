import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
// import { User } from 'src/app/pages/purchaser/models/user';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
// import { UsersService } from 'src/app/_helpers/users.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit {
  viewuser: User = {};
  roles: Array<{ id: number; name: string }> = [
    { id: 1, name: 'HR' },
    { id: 2, name: 'Category Head' },
    { id: 3, name: 'Purchaser' },
    { id: 4, name: 'Purchase Head' },
    { id: 5, name: 'Warehouse Operator' },
    { id: 6, name: 'Vendor' },
    { id: 7, name: 'Web Team' },
    { id: 8, name: 'Finance' }
  ];
  breadCrumbItems: Array<{}> = [];

  constructor(private route: ActivatedRoute, private router: Router, private userservice: UsersService, private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    let uuid = this.route.snapshot.paramMap.get('uuid');
    //console.log(uuid);
    if (uuid) {
      this.userservice.find(uuid)
        .subscribe({
          next: data => {
            this.viewuser = {
              uuid: data.uuid,
              firstname: data.name,
              lastname: data.lastname || '',
              username: data.username,
              email: data.email,
              mobile: data.mobile,
              role: this.findRole(parseInt(data.roleID)),
              dateofbirth: data.dateofbirth || '',
              dateofjoin: data.dateofjoin || '',
              salary: data.salary || '',
              address: data.address || '',
              status: data.status,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              warehouse: data.warehouse
            }
            //console.log(data);
            this.ref.detectChanges();
          },
          error: (err) => {
            //console.log('error page');
            this.router.navigate(['/hr/employees']);
          }
        })
    } else {
      //console.log('if error');
      // this.router.navigate(['/hr/view/']);
    }
  }
  findRole(id: number) {
    const role: any = this.roles.find((res) => res.id === id);
    return role.name ? role.name : '';
  }
}
