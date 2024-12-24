import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Department } from '../../../models/department';
import { Group } from '../../../models/groups';
import { Productvariants, Productvariantsvalues } from '../../../models/productvariants';
import { DepartmentsService } from '../../../services/departments.service';
import { ProductsService } from '../../../services/products.service';
import { ProductvariantsService } from '../../../services/productvariants.service';
import { Categories } from '../../../models/categories';
import { Subcategories } from '../../../models/subcategories';

@Component({
  selector: 'app-addproductvariants',
  templateUrl: './add-productvariants.component.html',
  styleUrls: ['./add-productvariants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductvariantsComponent implements OnInit {
  @Input() data: Productvariants = {};
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
  fileName: any = '';
  addfile: string = '';
  baseurl: string = '';
  formVaraiantValueData!: FormGroup;
  variantsvalues: Productvariantsvalues[] = [];
  model: any;
  varients: any = [];
  searching = false;
  searchFailed = false;
  group?: Group = {};

  class: Categories[] = [];
  subclass: Subcategories[] = [];
  groups: Group[] = [];
  edit: boolean = false

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

  selectedDept = '';
  selectedBrand = '';
  selectedClass: any;
  selectedSubclass: any;
  selectedGroup = '';

  constructor(
    private productvariants: ProductvariantsService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private utilty: UtilsService,
    private departmentservice: DepartmentsService,
    private env: EnvService,
    private productservice: ProductsService,
    private cd: ChangeDetectorRef,
  ) { }
  ngOnInit(): void {
    this.baseurl = this.env.SITE_URL;
    this.fileName = this.data.refimg || '';

    this.formData = this.formBuilder.group({
      uuid: [this.data.uuid],
      name: [this.data.name, [Validators.required, Validators.minLength(4)]],
      displayname: [this.data.displayname, [Validators.required, Validators.minLength(4)]],
      // group_id: [this.data.group_id, [Validators.required]],
      category_id: [this.data.category_id, [Validators.required]],
      subcategory_id: [this.data.subcategory_id, [Validators.required]],
      department_id: [this.data.department_id, [Validators.required]],
      type: [this.data.type || 0, [Validators.required]],
      showtype: [this.data.showtype || 'Image', [Validators.required]],
      refimg: [''],
      reflabel: [this.data.reflabel || ''],
      description: [this.data.description || ''],
      status: [this.data.status || 1]
    });
    // console.log(this.data);

    this.formVaraiantValueData = this.formBuilder.group({
      id: [''],
      variant_id: [''],
      imgicon: [''],
      value: [''],
      ordering: ['']
    });
    if (this.data.uuid) {
      this.edit = true
      this.group = this.data.group;
      this.model = this.group?.id;
      // console.log('inside');
      // this.formData.setValue({
      //   category_id:this.data.category_id,
      //   subcategory_id:this.data.subcategory_id
      // })
      this.selectedClass = this.data.category_id;
      this.productvariants.subcatlist(this.data.department_id, this.selectedClass).subscribe({
        next: (subclass) => {
          this.subclass = subclass;
          let st = this.subclass.find((e) => e.id == this.data.subcategory_id);
          // this.formData.get('subcategory_id').setValue(st.id);
          this.formData.get('subcategory_id').patchValue(st.id);
          this.cd.detectChanges();
          // console.log(st);
        }
      });
    }

    (this.addValueForm = this.formBuilder.group({
      formlist: this.formBuilder.array([])
    })),
      (this.statuses = this.utilty.getStatus());
    this.departmentservice.findList().subscribe({
      next: (data) => {
        this.departments = data;
        // console.log(this.departments[0].did);
        this.changeDepartment(this.departments[0]);
        // this.changeDepartment(this.departments[0].did)
      },
      error: () => {
        this.departments = [];
      }
    });
    this.formData.get('department_id').setValue('3')

    if (this.data.productvariantvalues && this.data.productvariantvalues.length > 0) {
      this.data.productvariantvalues.forEach((variantval) => {
        this.formvalueData().push(this.field(variantval.id, variantval.value));
      });
    } else {
      this.formvalueData().push(this.field());
    }
  }

  changeDepartment(dept: any) {
    this.selectedClass = '';
    this.selectedSubclass = '';
    this.selectedBrand = '';
    this.class = [];
    this.subclass = [];

    if (dept) {
      this.selectedDept = dept.did;
      this.productvariants.catlist(dept.did).subscribe({
        next: (data) => {
          this.class = data;
          if (this.data.uuid) {
            // console.log(this.class, this.data);
            let ct = this.class.find((e) => e.cid === this.data.category.cid);
            // console.log(ct);
            this.formData.get('category_id').patchValue(ct.cid);
            this.cd.detectChanges();
            // this.formData.get('category_id').setValue(ct.cid)
          }
        }
      });
    } else {
      this.selectedDept = '';
      // console.log('else part');
      // this.list()
    }
  }

  changeCategory(category: any) {
    this.selectedSubclass = '';
    if (category) {
      this.productvariants.subcatlist(this.selectedDept, this.selectedClass).subscribe({
        next: (subclass) => {
          this.subclass = subclass;
          this.cd.detectChanges();
          // let subclassdata: Subcategories[] = []
          // if (subclass.length > 0) {
          //   vendors.forEach((val) => {
          //     if (val.user)
          //       vendordata.push({ id: val.vendor_id, name: val.user.name })
          //   })
          // }
        }
      });
    } else {
      this.selectedClass = '';
      this.productvariants.subcatlist(this.selectedDept, '0').subscribe({
        next: (subclass) => {
          // let subclassdata: Subcategories[] = []
          // if (subclass.length > 0) {
          //   vendors.forEach((val) => {
          //     if (val.user)
          //       vendordata.push({ id: val.vendor_id, name: val.user.name })
          //   })
          // }
          this.subclass = subclass;
          // console.log(this.subclass);
        }
      });
      this.productvariants.grouplist(this.selectedDept, '0').subscribe({
        next: (groups) => {
          this.groups = groups;
          // console.log(this.groups);
          this.cd.detectChanges();
        }
      });
    }
  }

  changeSubcategory(subcat: any) {
    this.groups = [];
    this.selectedGroup = '';
    if (subcat) {
      this.selectedSubclass = subcat.id;
      this.productvariants.grouplist(this.selectedDept, this.selectedSubclass).subscribe({
        next: (groups) => {
          this.groups = groups;
          this.cd.detectChanges();
          // console.log(this.groups);
        }
      });
    } else {
      this.selectedSubclass = '';
      this.productvariants.grouplist(this.selectedDept, '0').subscribe({
        next: (groups) => {
          this.groups = groups;
          // console.log(this.groups);
        }
      });
    }
  }

  changeGroup(group: any) {
    if (group) {
      this.selectedGroup = group.id;
      // console.log(this.selectedGroup);
    } else {
      this.selectedGroup = '';
    }
  }

  itemSelected($event: any) {
    const groupval = $event.item;
    this.group = groupval;
    // console.log(this.group);
    if (groupval.id) {
      this.formData.get('department_id')?.setValue(groupval.department_id);
      this.formData.get('category_id')?.setValue(groupval.category_id);
      this.formData.get('subcategory_id')?.setValue(groupval.subcategory_id);
      this.formData.get('group_id')?.setValue(groupval.id);

      //this.brandForm.get("department_id")?.setValue(groupval.department_id);

      //this.getSelectvalues()
    }
  }

  get form() {
    return this.formData.controls;
  }

  saveProductvariants(): void {
    this.submit = true;
    //console.log(this.formData)
    if (this.formData.invalid) {
      // console.log(this.formData.value);
      return;
    }
    if (this.data.uuid != null) {
      this.productvariants.update(this.formData.value).subscribe({
        next: (resp) => {
          this.toast.success('Productvarinat Updated Successfully');
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
      this.formVaraiantValueData.get('value').setValue('Base');
      this.productvariants.create(this.formData.value).subscribe({
        next: (resp) => {
          this.varients = resp;
          this.toast.success('Productvarient Created Successfully');
          this.refreshList.emit('refresh');
          this.data = {};
          // console.log(resp.id, typeof this.varients, this.varients.id, this.varients.uuid);
          this.formData.reset();
          this.productvariants.values(this.formVaraiantValueData.value, this.varients.uuid).subscribe({
            next: (res) => {
              this.submit = false;
              // this.toast.success('Successfully Saved');
              this.formVaraiantValueData.reset();
            },
            error: (err) => {
              this.toast.failure(err);
            }
          });
        },
        error: (err) => {
          this.toast.failure(err);
          // console.log('error msg');
        }
      });
    }
    //this.formData.value.file = this.fileName

    /*if (this.data.uuid != null) {
      if (this.formData.value.refimg == null) {
        this.productvariants.update(this.formData.value).subscribe({
          next: resp => {
            this.toast.success('Productvarinat Updated Successfully');
            this.refreshList.emit('refresh');
            this.data = {};
            this.formData.reset();
            this.submit = false;
          }, error: err => {
            this.toast.failure(err.error.message);
          }
        })
      }
      else
        this.newimage()
    } else {
      if (this.formData.value.refimg == null) {
        this.formData.value.file = this.fileName
        this.productvariants.create(this.formData.value).subscribe({
          next: resp => {
            this.toast.success('Productvarinat Created Successfully');
            this.refreshList.emit('refresh');
            this.data = {}
            this.formData.reset();
          }, error: err => {
            this.toast.failure(err.error.message);
          }
        })
      }
      else
        this.newimage()
    } */
  }

  newimage() {
    const formd: any = new FormData();
    formd.append('refimg', this.addfile);
    formd.append('name', this.formData.value.name);
    formd.append('displayname', this.formData.value.displayname);
    formd.append('group_id', this.formData.value.group_id);
    formd.append('department_id', this.formData.value.department_id);
    formd.append('type', this.formData.value.type);
    formd.append('showtype', this.formData.value.showtype);
    formd.append('reflabel', this.formData.value.reflabel);
    formd.append('description', this.formData.value.description != null ? this.formData.value.description : '');
    formd.append('status', this.formData.value.status);
    var msg = 'Created';
    if (this.data.uuid) {
      formd.append('uuid', this.data.uuid);
      msg = 'Updated';
    }
    // console.log(formd);
    this.productvariants.saveData(formd).subscribe({
      next: (resp) => {
        this.addfile = '';
        this.refreshList.emit('refresh');
        this.data = {};
        this.formData.reset();
        this.submit = false;
        this.toast.success('Product Variant Successfully ' + msg);
      },
      error: (err) => {
        this.toast.failure(err.error.message);
      }
    });
  }

  saveVariantValues(): void {
    this.submit = true;
    if (this.addValueForm.invalid) {
      return;
    }
    this.productvariants.values(this.addValueForm.value.formlist, this.data.uuid).subscribe({
      next: (resp) => {
        this.toast.success('Product Variant Value Successfully Updated');
        this.refreshList.emit('refresh');
        this.data = {};
        this.formData.reset();
      },
      error: (err) => {
        this.toast.failure(err.error.message);
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
      variant_id: [this.data.id],
      value: [value, [Validators.required]]
    });
  }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var mimeType = event.target.files[0].type;
      // console.log(mimeType);
      if (!mimeType.match('image.*')) {
        this.formData.controls['refimg'].setValue('');
        this.toast.failure('Upload Image only');
      } else this.addfile = file;
    }
  }
}
