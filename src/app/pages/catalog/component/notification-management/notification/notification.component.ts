import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { PUSHNOTIFICATION } from '../../../models/notification';
import { NotificationService } from '../../../services/notification.service';
import { SharedModule } from 'src/app/_themes/shared/shared.module';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule,SharedModule]
})
export class NotificationComponent implements OnInit {


  notifications?: PUSHNOTIFICATION.Notification[];
  notificationPagination!: PUSHNOTIFICATION.NotificationsPaginate;
  currentTag!: PUSHNOTIFICATION.Notification;
  currentIndex = -1;

  // Pagination and search config
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  constructor(private notificationService: NotificationService, private cdr: ChangeDetectorRef, private router: Router, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.getNotificationList();
  }


  getNotificationList(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.notificationService.getNotificaionList(params)
      .subscribe({
        next: notifications => {
          this.notifications = notifications.datas;
          this.count = notifications.totalItems || 0;
          // this.cdr.detectChanges();
          if (notifications.totalItems) {
            this.canEnableNotification();
            this.count = notifications.totalItems;
          }
        }, error: error => {
          this.toast.failure('Error retriving the list, Try again!')
        }
      })
  }

  createNotification() {
    this.router.navigate(['/catalog/notifications/0']);
  }

  disableNotification(id: string) {
    this.notificationService.disableNotification(id)
      .subscribe({
        next: notification => {
          if (notification.status === 200) {
            this.toast.success(`Notification disabled successfully`)
          }
        }, error: error => {
          this.toast.failure('Error disabling notification, Try again!')
        }
      })
  }

  canEnableNotification() {
    // show disable action option only when the date is future but not past
    this.notifications?.map((notification) => {
      if (notification && notification.scheduleAt) {
        let timeInMs = new Date(notification.scheduleAt.slice(0, -1)).getTime();
        if (timeInMs > new Date().getTime()) notification.enableNotification = true;
      } else {
        notification.enableNotification = false;
      }
    })
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.getNotificationList();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getNotificationList();
  }


}
