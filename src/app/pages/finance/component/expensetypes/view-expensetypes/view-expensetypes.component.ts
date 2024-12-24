import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Expensetypes } from '../../../models/expensetypes';
import { ExpensetypesService } from '../../../services/expensetypes.service';

@Component({
  selector: 'app-view-expensetypes',
  templateUrl: './view-expensetypes.component.html',
  styleUrls: ['./view-expensetypes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewExpensetypesComponent implements OnInit {


  @Input() selectedExpensetype: Expensetypes = new Expensetypes;
  @Output() editExpensetype = new EventEmitter<Expensetypes>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams: any = [];
  constructor(private expensetypesservice: ExpensetypesService, private modelservice: NgbModal, private toast: ToastService,
    private cd: ChangeDetectorRef) { }


  ngOnInit(): void {
  }

  editAction(expensetype: Expensetypes): void {
    this.editExpensetype.emit(expensetype);
  }

  deleteParameter(expensetype: Expensetypes): void {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Expensetype Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then((parameterResponse) => {
      this.expensetypesservice.delete(expensetype).subscribe({
        next: resp => {
          this.toast.success('Deleted Successfully');
          this.refreshList.emit('refresh');
          // this.cd.detectChanges();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }, err => {
      console.log(err);
    });
  }

}
