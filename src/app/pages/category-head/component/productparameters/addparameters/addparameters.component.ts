import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { ProductparametersService } from '../../../services/productparameters.service';
import { Productparameters } from '../../../models/productparameters';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Department } from '../../../models/department';
import { DepartmentsService } from '../../../services/departments.service';
import { ProductsService } from '../../../services/products.service';
import { Categories } from '../../../models/categories';
import { Subcategories } from '../../../models/subcategories';
import { Group } from '../../../models/groups';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { ProductvariantsService } from '../../../services/productvariants.service';

@Component({
  selector: 'app-addparameters',
  templateUrl: './addparameters.component.html',
  styleUrls: ['./addparameters.component.scss']
})
export class AddparametersComponent implements OnInit {
  @Input() data: Productparameters = {};
  @Output() refreshList = new EventEmitter<string>();
  formData!: FormGroup;
  submit: Boolean = false;
  statuses: Array<{ id: string; name: string }> = [];
  types: Array<{ id: number; name: string }> = [
    { id: 0, name: 'String' },
    { id: 1, name: 'Number' }
  ];
  departments: Department[] = [];
  addValueForm!: FormGroup;
  categories: Categories[] = [];
  subcategories: Subcategories[] = [];
  subclassArray: any = [];
  edit: boolean = false
  model: any;
  searching = false;
  searchFailed = false;
  group?: Group = {};
  groups: Group = {};
  grpdata: any = []

  search: OperatorFunction<string, readonly Group[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.productservice.search(term).pipe(
          map((x: any) => {
            if (x.length > 0) {
              this.searchFailed = false;
              return x;
            } else {
              this.searchFailed = true;
              return ['No Results Found'];
            }
          }),
          tap(() => (this.searching = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );
  formatter = (x: any) => x.name;
  selectedClass: string;
  selectedSubclass: string;
  selectedBrand: string;
  class: any[];
  subclass: any[];
  selectedDept: any;

  constructor(
    private productparameters: ProductparametersService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private utilty: UtilsService,
    private departmentservice: DepartmentsService,
    private productservice: ProductsService,
    private productvariantsservice: ProductvariantsService
  ) { }
  ngOnInit(): void {
    //this.subclassArray=this.data?.subcategory_id?.split(',');
    // console.log(this.data);

    this.formData = this.formBuilder.group({
      uuid: [this.data.uuid],
      name: [this.data.name, [Validators.required, Validators.minLength(4)]],
      // group_id: [this.data.group_id, [Validators.required]],
      department_id: [this.data.department_id, [Validators.required]],
      category_id: [this.data.category_id, [Validators.required]],
      subcategory_id: [this.data.subcategory_id, [Validators.required]],
      type: [this.data.type || 0, [Validators.required]],
      description: [this.data.description],
      status: [this.data.status]
    });
    // console.log(this.data);

    if (this.data.uuid) {
      this.edit = true
      this.getSelectvalues('edit');
      this.getSubclass('edit');
      this.group = this.data.group;
      this.model = this.group?.id;
    }

    (this.addValueForm = this.formBuilder.group({
      formlist: this.formBuilder.array([])
    })),
      (this.statuses = this.utilty.getStatus());
    this.departmentservice.findList().subscribe({
      next: (data) => {
        this.departments = data;

        // console.log(this.departments[0].did);

      },
      error: () => {
        this.departments = [];
      }
    });
    this.formData.get('department_id').setValue('3')


    this.changeDepartment('3')
    if (this.data.productparametervalues && this.data.productparametervalues.length > 0) {
      this.data.productparametervalues.forEach((parameterval) => {
        this.formvalueData().push(this.field(parameterval.id, parameterval.value));
      });
    } else {
      this.formvalueData().push(this.field());
    }
  }

  itemSelected($event: any) {
    const groupval = $event.item;
    this.group = groupval;
    //console.log(this.group)
    if (groupval.id) {
      this.formData.get('department_id')?.setValue(groupval.department_id);
      this.formData.get('category_id')?.setValue(groupval.category_id);
      this.formData.get('subcategory_id')?.setValue(groupval.subcategory_id);
      // this.formData.get('group_id')?.setValue(groupval.id);

      //this.brandForm.get("department_id")?.setValue(groupval.department_id);

      this.getSelectvalues();
    }
  }

  get form() {
    return this.formData.controls;
  }

  getSelectvalues(edit = '') {
    let did = this.formData.get('department_id')?.value;
    if (did) {
      this.productservice.getlistall(did).subscribe({
        next: (data) => {
          // this.brands = data.brands

          this.class = data.categories;
          this.departments = data.department
          this.subcategories = data.subcategory
          this.grpdata = data.group
          // console.log(this.grpdata);

          //this.subcategories = [];
          this.formData.get('category_id').setValue(this.data.category.cid)
          this.formData.get('subcategory_id').setValue(this.data.subcategory.id)
          // this.formData.get('group_id')?.setValue(this.grpdata?.id);
          this.formData.get('department_id').setValue(this.data.department_id)


          // let brandid = '';
          let cateid: any = '';
          let subcatid: any = '';
          if (edit === 'edit') {
            // brandid = this.data.brand_id || '';
            cateid = this.data.category_id || '';
            //subcatid = this.data.subcategory_id || '';
          }
        },
        error: () => {
          //this.departments = []
        }
      });
    }
  }
  changeDepartment(dept: any) {
    this.selectedClass = '';
    this.selectedSubclass = '';
    this.selectedBrand = '';
    this.class = [];
    this.subclass = [];
    // console.log(dept);



    if (dept) {
      this.selectedDept = dept;
      this.productservice.catlist(dept).subscribe({
        next: (data) => {
          this.class = data;
        }
      });
    } else {
      this.selectedDept = '';
      // console.log('else part');
      // this.list()
    }
  }
  getSubclass(edit = '') {
    let did = this.formData.get('category_id')?.value;
    if (did) {
      this.productservice.getcatlist(did).subscribe({
        next: (data) => {
          this.subcategories = data.subcategories;
          // let docs:any = this.data?.subcategory_id?.split(',') || [];
          // let subclassArray = data.subcategories.filter((r1:any) => docs.some((r2:any) => r1.id == r2));
          // this.subclassArray=subclassArray.map((res:any) => res.id)
          // let subcatid:any = '';
          // if (edit === 'edit') {
          //   subcatid = this.subclassArray;
          //   this.formData.get("subcategory_id")?.setValue(subcatid);
          // }
          // else
          // this.formData.get("subcategory_id")?.setValue('');
        },
        error: () => {
          //this.departments = []
        }
      });
    }
  }

  changeSubCat(event: any) {
    // console.log(event);

    this.productvariantsservice.grouplist(this.formData.get('department_id')?.value, event.id).subscribe({
      next: (groups: any) => {
        this.grpdata = groups;
        // console.log('sub', this.groups);
      }
    });
  }

  saveProductparameters(): void {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.data.uuid != null) {
      this.productparameters.update(this.formData.value).subscribe({
        next: (resp) => {
          this.toast.success('Productparameter Updated Successfully');
          this.refreshList.emit('refresh');
          this.data = {};
          this.formData.reset();
          this.submit = false;
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    } else {
      this.productparameters.create(this.formData.value).subscribe({
        next: (resp) => {
          this.toast.success('Productparameter Created Successfully');
          this.refreshList.emit('refresh');
          this.data = {};
          this.formData.reset();
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    }
  }
  saveParameterValues(): void {
    this.submit = true;
    if (this.addValueForm.invalid) {
      return;
    }

    //console.log(this.addValueForm.value.formlist)

    this.productparameters.values(this.addValueForm.value.formlist, this.data.uuid).subscribe({
      next: (resp) => {
        this.toast.success('Product parameter Value Successfully Updated');
        this.refreshList.emit('refresh');
        this.data = {};
        this.formData.reset();
      },
      error: (err) => {
        this.toast.failure(err);
      }
    });
  }
  cancelAction(): void {
    let type = 'cancel1';
    if (!this.data.uuid) {
      type = '';
    }
    this.refreshList.emit(type);
  }

  formvalueData(): FormArray {
    return this.addValueForm.get('formlist') as FormArray;
  }
  removeField(i: number) {
    if (confirm('Are you sure you want to delete this element?')) {
      this.formvalueData().removeAt(i);
    }
  }
  addField(id = '', value = '') {
    this.formvalueData().push(this.field(id, value));
  }
  field(id = '', value = ''): FormGroup {
    return this.formBuilder.group({
      id: [id],
      parameter_id: [this.data.id],
      value: [value, [Validators.required]]
    });
  }
}
