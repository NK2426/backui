import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';


import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Expensetypes } from '../../../models/expensetypes';
import { ExpensetypesService } from '../../../services/expensetypes.service';

@Component({
  selector: 'app-add-expensetypes',
  templateUrl: './add-expensetypes.component.html',
  styleUrls: ['./add-expensetypes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddExpensetypesComponent implements OnInit {

  @Input() data: Expensetypes = {};
  @Output() refreshList = new EventEmitter<string>();
  formData!: FormGroup;
  submit: Boolean = false;
  statuses: Array<{ id: string, name: string }> = [];

  constructor(private expensetypesservice: ExpensetypesService, private toast: ToastService, private formBuilder: FormBuilder, private utilty: UtilsService, private cd: ChangeDetectorRef,) {
  }
  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      id: [this.data.id],
      name: [this.data.name, [Validators.required, Validators.minLength(4)]],
      description: [this.data.description],
      status: [this.data.status]
    });
    this.statuses = this.utilty.getStatus();

  }

  get form() {
    return this.formData.controls;
  }

  saveProductvariants(): void {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.data.id != null) {
      this.expensetypesservice.update(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('Expense type Updated Successfully');
          this.refreshList.emit('refresh');
          this.data = {};
          this.formData.reset();
          this.submit = false;
          // this.cd.detectChanges();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    } else {
      this.expensetypesservice.create(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('Expense type  Created Successfully');
          this.refreshList.emit('refresh');
          this.data = {}
          this.formData.reset();
          // this.cd.detectChanges();
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
