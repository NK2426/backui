import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Categories } from '../../../models/categories';
import { Department } from '../../../models/department';
import { CategoriesService } from '../../../services/categories.service';
import { DepartmentsService } from '../../../services/departments.service';


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.scss']
})
export class AddCategoriesComponent implements OnInit {

  @Input() data:Categories = {};
  @Output() refreshList = new EventEmitter<string>();
  formData!: FormGroup;
  submit: Boolean = false;
  statuses: Array<{id: string, name: string}> = [];
  departments: Department[] = []

  constructor(private categoriesservice: CategoriesService,private departmentservice: DepartmentsService, private toast: ToastService, private formBuilder: FormBuilder, private utilty: UtilsService) {
  }
  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      uuid: [this.data.uuid],
      name: [this.data.name, [Validators.required, Validators.minLength(3)]],
      department_id: [this.data.department_id, [Validators.required]],
      description: [this.data.description],
      status:[this.data.status]
    });

    this.statuses = this.utilty.getStatus();
    this.departmentservice.findList()
      .subscribe({
        next: data => {
          this.departments = data;
        },
        error:() => {
          this.departments = []
        }
    });
    this.formData.get('department_id').setValue('3')
  }

  get form() {
    return this.formData.controls;
  }

  saveProductvariants(): void{
    this.submit = true;
    if (this.formData.invalid)
    {
      return;
    }
    if(this.data.uuid != null){
      this.categoriesservice.update(this.formData.value).subscribe({
        next: resp=>{
          this.toast.success('Category Updated Successfully');
          this.data = {};
          this.formData.reset();
          this.submit = false;
          this.refreshList.emit('refresh');   
        },error: err => {
          this.toast.failure(err);
          
        }
      })
    }else{
      this.categoriesservice.create(this.formData.value).subscribe({
        next:resp => {
          this.toast.success('Category Created Successfully');
          this.data = {}
          this.formData.reset();
          this.refreshList.emit('refresh');
        },error: err=>{
          this.toast.failure(err);
          
        }
      })
    }
  }
  cancelAction(): void{
    let type = 'cancel1';
    if(!this.data.uuid){
      type = '';
    }
    this.refreshList.emit(type);
  }

}
