import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/pages/purchaser/services/attendance.service';
import { Attendance } from 'src/app/pages/purchaser/models/attendance';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.scss']
})
export class ViewAttendanceComponent implements OnInit {
  viewattendance: Attendance = {};
  breadCrumbItems: Array<{}> = [];

  constructor(
    private route: ActivatedRoute, private router: Router,
    private userservice: AttendanceService
  ) { }

  ngOnInit(): void {
    if (history.state.id) {
      this.userservice.find(history.state.id)
        .subscribe({
          next: data => {
            this.viewattendance = data
          },
          error: (err) => {
            // this.router.navigate(['/app/users/attendance']);
          }
        })
    } else {
      // this.router.navigate(['/app/users/attendance']);
    }
  }

}
