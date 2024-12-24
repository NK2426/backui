import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Group } from '../../../models/inventory';
import { Packages } from '../../../models/packages';
import { Packagetypes } from '../../../models/packagetypes';
import { PackageService } from '../../../services/package.service';
@Component({
  selector: 'app-addpackages',
  templateUrl: './addpackages.component.html',
  styleUrls: ['./addpackages.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class AddpackagesComponent implements OnInit {

  @Input() data: Packages = {};
  @Output() refreshList = new EventEmitter<string>();
  formData!: FormGroup; typeForm!: FormGroup;
  submit: Boolean = false;
  gsubmit: Boolean = false;
  rowvalues: any = []
  columnvalues: any = [];
  categories: any[] = [];
  subcategories: any[] = [];

  model: any;
  searching = false;
  searchFailed = false;
  group?: Group = {}
  packagetypes: Packagetypes[] = [];
  modelref: any = '';

  // search: OperatorFunction<string, readonly Group[]> = (text$: Observable<string>) =>
  //   text$.pipe(
  //     debounceTime(300),
  //     distinctUntilChanged(),
  //     tap(() => this.searching = true),
  //     switchMap(term =>
  //       this.packageservice.search(term).pipe(
  //         map((x: any) => {
  //           if (x.length > 0) {
  //             this.searchFailed = false;
  //             return x;
  //           } else {
  //             this.searchFailed = true;
  //             return ["No Results Found"];
  //           }
  //         }),
  //         tap(() => this.searching = false),
  //         catchError(() => {
  //           this.searchFailed = true;
  //           return of([]);
  //         }))
  //     ),
  //     tap(() => this.searching = false)
  //   );
  // formatter = (x: any) => x.name;

  constructor(private packageservice: PackageService, private toast: ToastService, private formBuilder: FormBuilder, private modelservice: NgbModal) {
  }
  ngOnInit(): void {

    this.formData = this.formBuilder.group({
      id: [this.data.id],
      uuid: [this.data.uuid],
      name: [this.data.name, [Validators.required]],
      description: [this.data.description],
      type_id: [this.data.type_id, [Validators.required]],
      length: [this.data.length, [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
      width: [this.data.width, [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
      height: [this.data.height, [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
      group_id: [this.data.group_id || 0, [Validators.required,]],
      department_id: [this.data.department_id || 0, [Validators.required]],
      category_id: [this.data.category_id || 0, [Validators.required]],
      subcategory_id: [this.data.subcategory_id || 0, [Validators.required]],
      status: [1],
    });
    // if (this.data.id) {
    //   this.group = this.data.group;
    // }

    this.typeForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      status: [1]
    })

    this.packageservice.getPackagetypes().subscribe({
      next: resp => {
        this.packagetypes = resp.data;
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    })
  }

  // itemSelected($event: any) {
  //   const groupval = $event.item
  //   this.group = groupval
  //   if (groupval.id) {
  //     this.formData.get("department_id")?.setValue(groupval.department_id);
  //     this.formData.get("category_id")?.setValue(groupval.category_id);
  //     this.formData.get("subcategory_id")?.setValue(groupval.subcategory_id);
  //     this.formData.get("group_id")?.setValue(groupval.id);

  //   }

  // }

  get form() {
    return this.formData.controls;
  }

  get typeform() {
    return this.typeForm.controls;
  }

  savePackage(): void {
    this.submit = true;
    if (this.formData.invalid) {
      //console.log(this.formData);
      return;
    }
    if (this.data.id != null) {
      this.packageservice.update(this.formData.value).subscribe({
        next: resp => {
          if (resp.status == 'failure') {
            this.toast.failure(resp.message);
          }
          else {
            this.toast.success('Package Updated Successfully');
            this.refreshList.emit('refresh');
            this.data = {};
            this.formData.reset();
            this.submit = false;
          }
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    } else {

      this.packageservice.create(this.formData.value).subscribe({
        next: resp => {
          if (resp.status == 'failure') {
            this.toast.failure(resp.message);
          }
          else {
            this.toast.success('Package Created Successfully');
            this.refreshList.emit('refresh');
            this.data = {}
            this.formData.reset();
          }
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

  viewType(content: any): void {
    this.modelref = this.modelservice.open(content, { size: 'md' });
  }

  savetypes() {
    this.gsubmit = true;
    if (this.typeForm.invalid) {
      return;
    }
    this.packageservice.savetype(this.typeForm.value).subscribe({
      next: resp => {
        if (resp.status == 'failure') {
          this.toast.failure(resp.message);
        }
        else {
          this.modelref.close();
          this.toast.success('Package type Created Successfully');
          this.packagetypes = [...this.packagetypes, resp]
          this.typeForm.reset();
          this.gsubmit = false;
        }
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    })
  }

}
