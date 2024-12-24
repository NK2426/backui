import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastService } from 'src/app/_helpers/toast.service';
import { CRATEMANAGEMENT } from '../../../models/crate';
import { CrateService } from '../../../services/crate.service';


@Component({
  selector: 'app-viewcrate',
  templateUrl: './viewcrate.component.html',
  styleUrls: ['./viewcrate.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule, NgbPaginationModule]
})
export class ViewcrateComponent {
  @Input() selectedCrate!: CRATEMANAGEMENT.Crate;
  @Output() editCrate = new EventEmitter<CRATEMANAGEMENT.Crate>();
  @Output() refreshList = new EventEmitter<string>();

  assignedparams: any = [];



  constructor(private crateService: CrateService, private modelservice: NgbModal, private toast: ToastService) { }

  editAction(crate: CRATEMANAGEMENT.Crate): void {
    this.editCrate.emit(crate);
  }

  deleteCrate(crate: CRATEMANAGEMENT.Crate): void {
    if (confirm('Crate Delete Confirmation . Do you want to delete?')) {

      this.crateService.delete(crate).subscribe({
        next: resp => {
          this.toast.success('Crate Deleted Successfully');
          this.refreshList.emit('refresh');
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }

}
