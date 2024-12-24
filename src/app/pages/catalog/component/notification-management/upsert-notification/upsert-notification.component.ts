import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DateTimePickerComponent } from 'src/app/widgets/date-time-picker/date-time-picker.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { PUSHNOTIFICATION } from '../../../models/notification';
import { NotificationService } from '../../../services/notification.service';
import { WebteamService } from '../../../services/webteam.service';

@Component({
  selector: 'app-upsert-notification',
  templateUrl: './upsert-notification.component.html',
  styleUrls: ['./upsert-notification.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule, DateTimePickerComponent]
})
export class UpsertNotificationComponent implements OnInit {
  formData!: FormGroup;
  currentNotification!: PUSHNOTIFICATION.Notification;
  notificationID: string = '';
  currentImage: string = '';
  addfile: string = '';
  submit: boolean = false;
  show: boolean = false;
  statuses: Array<{ id: string; name: string }> = [];
  selectedLink: any = '';
  selectedType: string = '';
  linkitems: any[] = [];
  dateTimePickerLatest!: string;
  date!: { year: number; month: number };
  minDate = {};
  type = '';
  constructor(
    private formBuilder: FormBuilder, private cdr: ChangeDetectorRef,
    private router: Router,
    private webservice: WebteamService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private calendar: NgbCalendar
  ) {
    let todayDate = new Date();
    let minDate = { day: todayDate.getDate(), month: todayDate.getMonth() + 1, year: todayDate.getFullYear() }
    this.formData = this.formBuilder.group({});
    this.notificationID = this.route.snapshot.paramMap.get('notificationID') || '';
    if (this.notificationID !== '' && this.notificationID !== '0') {
      this.getTagDetail(this.notificationID);
    } else {
      this.show = true;
    }
  }

  get form() {
    return this.formData.controls;
  }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      path: [''],
      description: [''],
      type: [''],
      link: [''],
      scheduleAt: [new Date(new Date().getTime() + (1 * 60 * 60 * 1000)).toISOString()]//(new Date().getTime() + (1 * 60 * 60 * 1000))
    });
  }

  cancel() {
    this.show = false;
  }


  isRequired(formData: any, controlName: string) {
    return formData.get(controlName)?.errors?.required
  }

  isValid(formData: any, controlName: string) {
    return formData.get(controlName)?.errors?.isValid
  }
  saveNotification() {
    this.submit = true;
    this.dateTimePickerLatest = this.formData.get('scheduleAt')?.getRawValue();
    if (this.formData.invalid) {
      return;
    }
    this.upsertNotification();
  }

  getTagDetail(notificationID: string) {
    this.notificationService.getNotificationById(notificationID).subscribe({
      next: (resp) => {
        if (resp) {
          this.currentNotification = resp.data;
          this.currentImage = resp.data.path;
          this.formData = this.formBuilder.group({
            id: [this.currentNotification.id, [Validators.required]],
            title: [this.currentNotification.title, [Validators.required]],
            path: [this.currentNotification.path],
            description: [this.currentNotification.description],
            type: [this.currentNotification.type],
            link: [this.currentNotification.link],
            scheduleAt: [this.currentNotification.scheduleAt]
          });
          this.changeType(this.currentNotification.type)
          switch (this.currentNotification.type) {
            case 'Offer': {
              this.type = 'supersale/offeritems/';
              break;
            }
            case 'Supersale': {
              this.type = 'supersale/supersaleitems/';
              break;
            }
            case 'Group': {
              this.type = 'groups/view/';
              break;
            }
            case 'Tag': {
              this.type = 'tags/';
              break;
            }
          }
          // this.cdr.detectChanges();
          //this.type = this.currentNotification.type == 'Offer' ? 'supersale/offeritems/' : 'supersale/supersaleitems/'
        }
      },
      error: (err) => {
        //console.log(err);
      }
    });
  }

  changeType(type: string) {
    if (!this.currentNotification) {
      this.formData.get('link')?.setValue('');
      this.linkitems = [];
      this.selectedLink = '';
    }

    this.selectedType = type;
    if (type) {
      this.webservice.linkitemlist1(type, 0).subscribe({
        next: (data) => {
          this.linkitems = data;
          //console.log(this.linkitems)

          if (this.currentNotification && this.currentNotification?.link) {

            let linkitm = this.linkitems.find((x: any) => (x.uuid == this.currentNotification.link))
            this.selectedLink = linkitm
          }

        }
      });
    }
  }

  changeLink() {
    let finditem = this.linkitems.find((res) => res.uuid === this.formData.get('link')?.value);
    this.selectedLink = finditem && finditem.uuid;
  }

  upsertNotification() {
    const formd: any = new FormData();
    formd.append('title', this.formData.value.title);
    formd.append('description', this.formData.value.description);
    formd.append('type', this.selectedType);
    formd.append('link', this.selectedLink);
    formd.append('path', this.addfile);
    formd.append('scheduleAt', this.dateTimePickerLatest);
    this.notificationService.createNotification(formd).subscribe({
      next: (resp) => {
        if (resp && resp.status === 201) {
          this.addfile = '';
          this.submit = false;
          this.show = false;
          this.toast.success('Created Notification Successfully ');
          this.router.navigate(['/catalog/notifications']);
        }
      },
      error: (err) => {
        this.toast.failure(err.error.message);
      }
    });
    /* formd.append('path', this.addfile);
    let input = {
      title: this.formData.value.title,
      description: this.formData.value.description,
      type: this.selectedType,
      link: this.selectedLink
    }; */

  }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      let self = this;
      const file = event.target.files[0];
      if (!(file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'))) {
        self.formData.controls['path'].setValue('');
        self.toast.failure('Supports JPG, PNG format only');
        return;
      }
      const filesize = file.size / 1024; // in kb
      let ratio = '';
      var objectUrl = URL.createObjectURL(file);
      let img = new Image();
      img.onload = function () {
        ratio = (Number(img.width) / Number(img.height) + '').slice(0, 3);
        URL.revokeObjectURL(objectUrl);
        if (!self.validateImageBasedOnType(img.width, ratio, false, false, filesize, true)) {
          // check size of image
          self.formData.controls['path'].setValue('');
          self.toast.failure('Image size exceeds 500kb');
          return;
        }
        if (!self.validateImageBasedOnType(img.width, ratio, false, true)) {
          // check ratio
          self.formData.controls['path'].setValue('');
          self.toast.failure('Image ratio mismatch');
          return;
        }
        var mimeType = event.target.files[0].type;
        if (!mimeType.match('image.*')) {
          self.formData.controls['path'].setValue('');
          self.toast.failure('Upload Image only');
        } else {
          self.addfile = file;
        }
      };
      img.src = objectUrl;
    } else {
      this.currentImage = '';
    }
  }

  validateImageBasedOnType(
    imageWidth: any,
    ratio: string,
    checkWidth?: boolean,
    checkRatio?: boolean,
    imageSize?: number,
    checkSize?: boolean
  ) {
    if (checkWidth) {
      return Number(imageWidth) < 1200;
    } else if (checkSize) {
      return Number(imageSize) < 1000; // < 500kb
    } else if (checkRatio) {
      return ratio >= '1' || ratio <= '2';
    } else {
      return;
    }
  }
}
