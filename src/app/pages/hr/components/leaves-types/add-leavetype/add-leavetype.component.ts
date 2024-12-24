import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastService } from 'src/app/_helpers/toast.service';
// import { Roles } from 'src/app/pages/purchaser/models/roles';
import { Roles } from '../../../models/roles';
// import { LeaveTypesService } from 'src/app/pages/purchaser/services/leave-types.service';
import { LeaveTypeService } from '../../../services/leave-types.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-leavetype',
  templateUrl: './add-leavetype.component.html',
  styleUrls: ['./add-leavetype.component.scss']
})
export class AddLeavetypeComponent implements OnInit {
  @Input() data: Roles = {};
  @Output() refreshList = new EventEmitter<string>();
  formData!: FormGroup;
  submit: Boolean = false;
  constructor(private rolesservices: LeaveTypeService, private toast: ToastService, private formBuilder: FormBuilder) {
  }
  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      uuid: [this.data.uuid],
      name: [this.data.name, [Validators.required]],

    });
  }

  get form() {
    return this.formData.controls;
  }

  saveProductvariants(): void {
    //console.log('inside form save');
    this.submit = true;
    if (this.formData.invalid) {
      //console.log("invalid data");
      return;
    }
    if (this.data.uuid != null) {
      //console.log("valid uuid");
      this.rolesservices.update(this.formData.value).subscribe({
        next: resp => {
          //console.log("resp data");
          //console.log(resp);
          this.toast.success('LeaveType Updated Successfully');
          this.refreshList.emit('refresh');
          this.data = {};
          this.formData.reset();
          this.submit = false;
        }, error: err => {
          //console.log("error data");
          if(err == undefined ){
            this.toast.failure('LeavesType already exists');
          }else{
            this.toast.failure(err);
          }
        }
      })
    } else {
      //console.log("else part");
      this.formData.value.range_from = this.formData.value.range_from == null ? 0 : this.formData.value.range_from;
      this.formData.value.range_to = this.formData.value.range_to == null ? 0 : this.formData.value.range_to;
      this.rolesservices.create(this.formData.value).subscribe({
        next: resp => {
          //console.log("else resp ok");
          this.toast.success('LeaveType Created Successfully');
          this.refreshList.emit('refresh');
          this.data = {}
          this.formData.reset();
        }, error: err => {
          //console.log("else error");
          if(err == undefined ){
            this.toast.failure('LeavesType already exists');
          }else{
            this.toast.failure(err);
          }
         
        }
      })
    }
  }
  cancelAction(): void {
    let type = 'cancel1';
    if (!this.data.uuid) {
      type = '';
    }
    this.refreshList.emit(type);
  }
}
