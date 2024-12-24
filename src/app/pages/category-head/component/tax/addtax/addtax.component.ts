import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Tax } from '../../../models/purchaseorder';
import { TaxService } from '../../../services/tax.service';

@Component({
  selector: 'app-addtax',
  templateUrl: './addtax.component.html',
  styleUrls: ['./addtax.component.scss']
})
export class AddtaxComponent implements OnInit {
  @Input() data: any = {};
  @Output() refreshList = new EventEmitter<string>();
  formData!: FormGroup;
  submit: Boolean = false;
  statuses: Array<{ id: string; name: string }> = [];

  constructor(
    private taxservice: TaxService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private utilty: UtilsService
  ) {}
  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      id: [this.data.id],
      name: [this.data.name, [Validators.required]],
      percentage: [this.data.percentage, [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
      status: [this.data.status]
    });
    this.statuses = this.utilty.getStatus();
  }

  get form() {
    return this.formData.controls;
  }

  saveTax(): void {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.data.id != null) {
      this.taxservice.update(this.formData.value).subscribe({
        next: (resp) => {
          this.toast.success('Tax Updated Successfully');
          this.data = {};
          this.formData.reset();
          this.submit = false;
          this.refreshList.emit('refresh');
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    } else {
      this.taxservice.create(this.formData.value).subscribe({
        next: (resp) => {
          this.toast.success('Tax Created Successfully');
          this.data = {};
          this.formData.reset();
          this.refreshList.emit('refresh');
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
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
