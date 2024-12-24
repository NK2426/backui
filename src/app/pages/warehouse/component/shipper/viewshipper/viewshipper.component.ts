import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Shipper } from '../../../models/shipper';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { ShipperService } from '../../../services/shipper.service';

@Component({
  selector: 'app-viewshipper',
  templateUrl: './viewshipper.component.html',
  styleUrls: ['./viewshipper.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class ViewshipperComponent implements OnInit {

  @Input() selectedDepartment: Shipper = new Shipper;
  @Output() editDepartment = new EventEmitter<Shipper>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams: any = [];
  deleteaction = false;
  constructor(private shipperservice: ShipperService, private modelservice: NgbModal, private toast: ToastService) { }


  ngOnInit(): void {

  }

  editAction(department: Shipper): void {
    this.editDepartment.emit(department);
  }

  deleteParameter(department: Shipper): void {
    if (confirm('Shipper Delete Confirmation . Do you want to delete?')) {

      this.shipperservice.delete(department).subscribe({
        next: resp => {
          if (resp.status == 200)
            this.toast.success(resp?.message);
          else
            this.toast.failure(resp?.message);
          this.refreshList.emit('refresh');
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }

}
