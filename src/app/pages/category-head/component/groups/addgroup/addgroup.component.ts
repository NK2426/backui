import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { Categories } from '../../../models/categories';
import { Department } from '../../../models/department';
import { Group } from '../../../models/groups';
import { Subcategories } from '../../../models/subcategories';
import { DepartmentsService } from '../../../services/departments.service';
import { GroupService } from '../../../services/groups.service';
import { ProductsService } from '../../../services/products.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';

@Component({
  selector: 'app-addgroup',
  templateUrl: './addgroup.component.html',
  styleUrls: ['./addgroup.component.scss']
})
export class AddgroupComponent implements OnInit {

  formData!: FormGroup;
  data: Group = {};

  active = 1;
  submit: boolean = false;
  breadCrumbItems: Array<{}> = [];
  edit: boolean = false;
  departments: Department[] = [];
  categories: Categories[] = []
  subcategories: Subcategories[] = []
  grpitemArray: any = [];
  statuses = [{ id: 1, name: 'Active' }, { id: 0, name: 'Inactive' }]

  constructor(
    private route: ActivatedRoute, private router: Router,
    private grpservice: GroupService, private toast: ToastService,
    private formBuilder: FormBuilder,
    private utiltiyservice: UtilsService,
    private departmentservice: DepartmentsService,
    private productservice: ProductsService
  ) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      //uuid: [this.data.uuid, [Validators.required, Validators.minLength(4)]],
      name: [this.data.name, [Validators.required, Validators.minLength(3)]],
      //sku: [this.data.sku, [Validators.required, Validators.minLength(3)]],
      department_id: [this.data.department_id, [Validators.required]],
      category_id: [this.data.category_id, [Validators.required]],
      subcategory_id: [this.data.subcategory_id, [Validators.required]],
      description: [this.data.description],
      // tags: [this.data.tags],
      grpitems: [''],
      status: [1],
    });
    this.formData.get('department_id').setValue('3')
    this.productservice.getlistall('3').subscribe({
      next: data => {
        this.categories = data.categories
        this.subcategories = [];
      },
      error: () => {
        //this.departments = []
      }
    });


    this.grpservice.findList()
      .subscribe({
        next: data => {
          this.departments = data;
          let uuid = this.route.snapshot.paramMap.get('uuid');
          if (uuid) {
            this.grpservice.find(uuid)
              .subscribe({
                next: data => {
                  this.data = data;
                  if (data.groupitems)
                    this.grpitemArray = data.groupitems.map((res: any) => res.item_id);
                  if (data.status == 'Publish') {
                    this.toast.failure('This product already published, so you could not edit this product.');
                    this.router.navigate(['/category-head/products']);
                  }
                  this.edit = true;
                  this.formData.setValue({
                    name: data.name,
                    department_id: data.department_id,
                    category_id: data.category_id,
                    subcategory_id: data.subcategory_id,
                    description: data.description || '',
                    // tags: data.tags || '',
                    status: data.status,
                    grpitems: this.grpitemArray
                  });
                  this.getSelectvalues('edit')
                  this.getSubclass('edit')
                },
                error: () => {
                }
              });
          }
        },
        error: () => {
          this.departments = []
        }
      });
  }
  get form() {
    return this.formData.controls;
  }
  getSelectvalues(edit = '') {
    let did = (this.formData.get('department_id')?.value)
    if (did) {
      this.productservice.getlistall(did).subscribe({
        next: data => {
          this.categories = data.categories
          this.subcategories = [];

          let cateid: any = '';
          let subcatid: any = '';
          if (edit === 'edit') {
            cateid = this.data.category_id || '';
            subcatid = this.data.subcategory_id || '';
          }

          this.formData.get("category_id")?.setValue(cateid);
          this.formData.get("subcategory_id")?.setValue(subcatid);
        },
        error: () => {
          //this.departments = []
        }
      });
    }
  }

  getSubclass(edit = '') {
    let did = (this.formData.get('category_id')?.value)
    if (did) {
      this.productservice.getcatlist(did).subscribe({
        next: data => {
          this.subcategories = data.subcategories

          let subcatid: any = '';
          if (edit === 'edit') {
            subcatid = this.data.subcategory_id || '';
            this.formData.get("subcategory_id")?.setValue(subcatid);
          }
          else
            this.formData.get("subcategory_id")?.setValue('');

        },
        error: () => {
          //this.departments = []
        }
      });
    }
  }

  saveGroup() {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.data.id != null) {
      let productdata = this.formData.value;
      productdata.id = this.data.id;
      this.grpservice.update(productdata).subscribe({
        next: resp => {
          this.toast.success('Group Updated Successfully');
          this.data = {};
          this.formData.reset();
          this.submit = false;
          this.router.navigate(['/category-head/groups']);
        }, error: err => {
          this.toast.failure(err);
        }
      })
    } else {
      //console.log(this.formData.value.grpitems)
      this.grpservice.creategroup(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('Group Created Successfully');
          this.data = {}
          this.formData.reset();
          this.router.navigate(['/category-head/groups']);
        }, error: err => {
          this.toast.failure(err);
        }
      })
    }
  }

}
