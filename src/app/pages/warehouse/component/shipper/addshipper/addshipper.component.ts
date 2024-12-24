import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Shipper } from '../../../models/shipper';
import { ShipperService } from '../../../services/shipper.service';
@Component({
  selector: 'app-addshipper',
  templateUrl: './addshipper.component.html',
  styleUrls: ['./addshipper.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class AddshipperComponent implements OnInit {

  @Input() data: Shipper = {};
  @Output() refreshList = new EventEmitter<string>();
  formData!: FormGroup;
  submit: Boolean = false;
  statuses: Array<{ id: string, name: string }> = [];

  constructor(private shipperservice: ShipperService, private toast: ToastService, private formBuilder: FormBuilder, private utilty: UtilsService) {
  }
  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      name: [this.data.name, [Validators.required, Validators.minLength(4)]],
      location: [this.data.location, [Validators.required, Validators.minLength(3)]],
      status: [this.data.status]
    });
    this.statuses = this.utilty.getStatus()
  }

  get form() {
    return this.formData.controls;
  }

  saveDepartment(): void {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.data.id != null) {
      this.formData.value.id = this.data.id;
      this.shipperservice.update(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('Shipper Updated Successfully');
          this.refreshList.emit('refresh');
          this.data = {};
          this.formData.reset();
          this.submit = false;
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    } else {

      this.shipperservice.create(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('Shipper Created Successfully');
          this.refreshList.emit('refresh');
          this.data = {}
          this.formData.reset();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }
  cancelAction(): void {
    let type = 'cancel1';
    if (!this.data.id) {
      type = '';
    }
    this.refreshList.emit(type);
  }

}
