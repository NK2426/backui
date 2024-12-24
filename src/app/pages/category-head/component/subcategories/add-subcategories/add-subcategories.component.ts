import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Categories } from '../../../models/categories';
import { Department } from '../../../models/department';
import { Subcategories } from '../../../models/subcategories';
import { DepartmentsService } from '../../../services/departments.service';
import { ProductsService } from '../../../services/products.service';
import { SubcategoriesService } from '../../../services/subcategories.service';



@Component({
  selector: 'app-add-subcategories',
  templateUrl: './add-subcategories.component.html',
  styleUrls: ['./add-subcategories.component.scss']
})
export class AddSubcategoriesComponent implements OnInit {

  @Input() data:Subcategories = {};
  @Output() refreshList = new EventEmitter<string>();
  formData!: FormGroup;
  submit: Boolean = false;
  statuses: Array<{id: string, name: string}> = [];
  departments: Department[] = [];
  categories: Categories[]=[];

  constructor(private subcategoriesservice: SubcategoriesService, private toast: ToastService, private formBuilder: FormBuilder, private utilty: UtilsService,private departmentservice: DepartmentsService, private productservice: ProductsService) {
  }
  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      uuid: [this.data.uuid],
      name: [this.data.name, [Validators.required, Validators.minLength(3)]],
      department_id: [this.data.department_id, [Validators.required]],
      category_id: [this.data.category_id, [Validators.required]],
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
    // this.productservice.getlistall('3').subscribe({
    //   next: data => {
    //     this.categories = data.categories


    //   },
    //   error: () => {
    //     //this.departments = []
    //   }
    // });
    this.formData.get('department_id').setValue('3')
    if(this.data.uuid)
    {
      this.getSelectvalues('edit');
    }else{
      this.getSelectvalues()
    }
  }

  getSelectvalues(edit = '') {
    let did = (this.formData.get('department_id')?.value)
    if (did) {
      this.productservice.getlistall(did).subscribe({
        next: data => {
          this.categories = data.categories

          let cateid:any = '';
          if (edit === 'edit') {
            cateid = this.data.category_id || '';
            this.formData.get("category_id")?.setValue(cateid);
          }
          else
          this.formData.get("category_id")?.setValue('');


        },
        error: () => {
          //this.departments = []
        }
      });
    }
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
      this.subcategoriesservice.update(this.formData.value).subscribe({
        next: resp=>{
          this.toast.success('Subcategory Updated Successfully');
          this.refreshList.emit('refresh');        
          this.data = {};
          this.formData.reset();
          this.submit = false;
        },error: err => {
          this.toast.failure(err);
        }
      })
    }else{
      this.subcategoriesservice.create(this.formData.value).subscribe({
        next:resp => {
          this.toast.success('Subcategory Created Successfully');
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
