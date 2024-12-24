import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
// import { Roles } from 'src/app/pages/purchaser/models/roles';
import { Roles } from '../../../models/roles';
// import { LeaveTypesService } from 'src/app/pages/purchaser/services/leave-types.service';
import { LeaveTypeService } from '../../../services/leave-types.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';

@Component({
  selector: 'app-view-leavetype',
  templateUrl: './view-leavetype.component.html',
  styleUrls: ['./view-leavetype.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewLeavetypeComponent implements OnInit {
  @Input() selectedDepartment: Roles = new Roles();
  @Output() editRoles = new EventEmitter<Roles>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams: any = [];

  constructor(
    private categoriesservice: LeaveTypeService,
    private ref: ChangeDetectorRef,
    private modelservice: NgbModal,
    private toast: ToastService
  ) {}

  ngOnInit(): void {}

  editAction(department: Roles): void {
    this.ref.detectChanges();
    this.editRoles.emit(department);
  }

  deleteParameter(department: Roles): void {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Leave Type Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then(
      (parameterResponse) => {
        this.categoriesservice.delete(department).subscribe({
          next: (resp) => {
            this.toast.success('Leave type Deleted Successfully');
            this.refreshList.emit('refresh');
            this.ref.detectChanges();
          },
          error: (err) => {
            this.toast.failure(err.error.message);
          }
        });
        this.ref.detectChanges();
      },
      (err) => {
        //console.log(err);
      }
    );
  }
}
