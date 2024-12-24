import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ToastService } from 'src/app/_helpers/toast.service';
// import { LeaveService } from 'src/app/pages/purchaser/services/leave.service';
import { LeaveService } from '../../../services/leave.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
// import { Leaves } from 'src/app/pages/purchaser/models/leaves';
import { Leaves } from '../../../models/leaves';
import { ActivatedRoute, Router } from '@angular/router';
// import { LeavesType } from 'src/app/pages/purchaser/models/leavetypes';
import { LeavesType } from '../../../models/leavetypes';

@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddLeaveComponent implements OnInit {
  formData!: FormGroup;
  data: Leaves = {};

  statuses: Array<{ id: string, name: string }> = [{ id: '1', name: 'Active' }, { id: '0', name: 'Inactive' }];

  active = 1;
  submit: boolean = false;
  breadCrumbItems: Array<{}> = [];
  edit: boolean = false;
  passwordvalidate: boolean = true;
  leavetypes: LeavesType[] = [];

  constructor(
    private route: ActivatedRoute, private router: Router,
    private leaveService: LeaveService, private toast: ToastService,
    private formBuilder: FormBuilder,
    private utiltiyservice: UtilsService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      uuid: [this.data.uuid, ''],
      leavetype_id: [this.data.leavetype_id, [Validators.required]],
      description: [this.data.description, [Validators.required, Validators.minLength(3)]],
      leavedate: [this.data.leavedate, [Validators.required]],
      status: ['1'],
    })
    this.findLeavetypes()
    if (history.state.uuid) {
      this.leaveService.find(history.state.uuid)
        .subscribe({
          next: data => {
            this.edit = true;
            this.formData.setValue({
              uuid: data.uuid,
              leavetype_id: data.leavetype_id,
              description: data.description,
              leavedate: data.leavedate,
              status: data.status || '0',

            })
            this.cd.detectChanges()
          }
        })
    }
    this.cd.detectChanges()
  }

  get form() {
    return this.formData.controls;
  }

  findLeavetypes() {
    this.leaveService.getParams().subscribe({
      next: resp => {
        this.leavetypes = resp.data;
        this.cd.detectChanges()
      },
      error: err => {
        //console.log(err)
      }
    })
    this.cd.detectChanges()
  }

  saveUser(): void {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.edit) {
      this.leaveService.update(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('Leave Updated Successfully');
          this.data = {};
          this.formData.reset();
          this.submit = false;
          this.router.navigate(['/hr/leaves']);
          this.cd.detectChanges()
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
      this.cd.detectChanges()
    } else {
      this.leaveService.create(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('Leave Created Successfully');
          this.data = {}
          this.formData.reset();
          this.router.navigate(['/hr/leaves']);
          this.cd.detectChanges()
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
      this.cd.detectChanges()
    }
  }

  onNavChange($event: any): void {

  }

  setactive($event: any): void {
    this.active = $event;
  }

}
