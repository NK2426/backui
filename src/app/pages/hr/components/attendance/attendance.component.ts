import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Attendance, Attendancepaginate } from 'src/app/pages/purchaser/models/attendance';
import { Attendance, Attendancepaginate } from '../../models/attendance';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
// import { AttendanceService } from 'src/app/pages/purchaser/services/attendance.service';
import { AttendanceService } from '../../services/attendance.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceComponent implements OnInit {
  attendances?: Attendance[];
  userpaginate?: Attendancepaginate = {};
  currentUser: Attendance = {};
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

  // paginator
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(
    private attendanceservice: AttendanceService,
    private modelservice: NgbModal,
    private toast: ToastService,
    private utlis: UtilsService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/app/dashboard' },
      { label: 'Attendance', url: '/app/users/user/attendance' }
    ];
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
    this.attendanceservice.getAll(params).subscribe({
      next: (attendance) => {
        this.attendances = attendance.datas;
        //console.log(this.attendances);
        this.cd.detectChanges();
        //console.log(this.cd.detectChanges());
        if (attendance.totalItems) this.count = attendance.totalItems;
      },
      error: (error) => {
        //console.log('attendance error');
        //this.authRedirect.next(error)
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

  findRole(id: any) {
    const role: any = this.roles.find((res) => res.id === parseInt(id));
    return role.name ? role.name : '';
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  viewAtt(link: string) {
    if (link === 'view') {
      //console.log(link);
      this.router.navigate(['/hr/attendance/view']);
    }
  }

  view() {
    this.router.navigate(['/hr/view']);
  }
}
