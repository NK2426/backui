import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { CRATEMANAGEMENT } from '../../../models/crate';
import { CrateService } from '../../../services/crate.service';

@Component({
  selector: 'app-upsertcrate',
  templateUrl: './upsertcrate.component.html',
  styleUrls: ['./upsertcrate.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class UpsertcrateComponent implements OnInit {
  @Input() data!: CRATEMANAGEMENT.Crate;
  @Output() refreshList = new EventEmitter<string>();

  submit: Boolean = false;
  gsubmit: Boolean = false;
  formData!: FormGroup; typeForm!: FormGroup;
  modelref: any = '';
  crateSize: any = [{ name: 'Small', type: 'Small' }, { name: 'Medium', type: 'Medium' }, { name: 'Large', type: 'Large' }, { name: 'Extra Large', type: 'Extra Large' }];

  get form() {
    return this.formData.controls;
  }

  get typeform() {
    return this.typeForm.controls;
  }

  constructor(private crateService: CrateService, private toast: ToastService, private formBuilder: FormBuilder, private modelservice: NgbModal) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      id: [this.data.id],
      uuid: [this.data.uuid],
      name: [this.data.name, [Validators.required]],
      type: [this.data.type, [Validators.required]],
      status: [this.data.status]
    });
  }



  saveCrate(): void {
    this.submit = true;
    if (this.formData.invalid) {
      //console.log(this.formData);
      return;
    }
    if (this.data.id != null) {
      this.crateService.update(this.formData.value).subscribe({
        next: resp => {
          if (resp.status == 'failure') {
            this.toast.failure(resp.message);
          }
          else {
            this.toast.success('Crate Updated Successfully');
            this.refreshList.emit('refresh');
            this.data = {} as any;
            this.formData.reset();
            this.submit = false;
          }
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    } else {

      this.crateService.create(this.formData.value).subscribe({
        next: resp => {
          if (resp.status == 'failure') {
            this.toast.failure(resp.message);
          }
          else {
            this.toast.success('Crate Created Successfully');
            this.refreshList.emit('refresh');
            this.data = {} as any;
            this.formData.reset();
          }
        }, error: err => {
          if (typeof err === 'string') {
            this.toast.failure(err);
            return
          }
          this.toast.failure(err.error.message);
        }
      })
    }
  }


  viewType(content: any): void {
    this.modelref = this.modelservice.open(content, { size: 'md' });
  }

  cancelAction(): void {
    let type = 'cancel1';
    if (!this.data.id) {
      type = '';
    }
    this.refreshList.emit(type);
  }


}
