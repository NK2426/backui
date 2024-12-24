import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { vendorAgentService } from 'src/app/pages/hr/services/vendorAgent.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { vendoragent } from 'src/app/pages/hr/models/vendoragent';
import { VendorService } from '../../../services/vendor.service';
import { State, Vendor, Vendordetail } from '../../../models/vendor';

@Component({
  selector: 'app-viewagent',
  templateUrl: './viewagent.component.html',
  styleUrls: ['./viewagent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewagentComponent implements OnInit {
  @Input() selctvendor: vendoragent = new vendoragent();
  @Output() editRoles = new EventEmitter<vendoragent>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams: any = [];
  // states?: State[]=[];
  stateValue: any;
  state: any
  vendor: Vendordetail[] = []

  constructor(
    private agentservice: vendorAgentService,
    private ref: ChangeDetectorRef,
    private modelservice: NgbModal,
    private toast: ToastService,
    private userservice: VendorService,
    private vendorservice: vendorAgentService,
  ) { }

  ngOnInit(): void {
    // console.log('this.selctvendor.id', this.selctvendor.id);
    this.vendorservice.getvendor(this.selctvendor.id).subscribe({
      next: (resp) => {
        this.vendor = resp.data
        // console.log('resp', resp.data, typeof (resp));
        this.ref.detectChanges();
      },
      error: (error) => { }
    });
    this.userservice.getStateid(this.selctvendor.state_id).subscribe({
      next: (resp) => {
        this.stateValue = resp;
        this.stateValue = Object.values(this.stateValue)
      },
      error: (error) => { }
    });
  }

  editAction(agent: vendoragent): void {
    this.ref.detectChanges();
    this.editRoles.emit(agent);
  }


  deleteParameter(agent: vendoragent): void {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Agent Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then(
      (parameterResponse) => {
        this.agentservice.delete(agent).subscribe({
          next: (resp) => {
            this.toast.success('Vendor Agent Deleted Successfully');
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
        console.log(err);
      }
    );
  }
}
