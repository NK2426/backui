import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';

import { Department } from '../../../models/department';
import { Group } from '../../../models/inventory';
import { Item } from '../../../models/item';
import { DepartmentsService } from '../../../services/departments.service';
import { WebteamService } from '../../../services/webteam.service';


@Component({
  selector: 'app-addgroup',
  templateUrl: './addgroup.component.html',
  styleUrls: ['./addgroup.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class AddgroupComponent implements OnInit {

  formData!: FormGroup;
  data: Group = {};

  active = 1;
  submit: boolean = false;
  breadCrumbItems: Array<{}> = [];
  edit: boolean = false;
  departments: Department[] = [];
  items: Item[] = [];
  grpitemArray: any[] = [];
  statuses = [{ id: 1, name: 'Active' }, { id: 0, name: 'Inactive' }]

  supercoins: any[] = [];

  constructor(
    private route: ActivatedRoute, private router: Router,
    private productservice: WebteamService, private toast: ToastService,
    private formBuilder: FormBuilder,
    private utiltiyservice: UtilsService,
    private departmentservice: DepartmentsService, private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      //uuid: [this.data.uuid, [Validators.required, Validators.minLength(4)]],
      name: [this.data.name, [Validators.required, Validators.minLength(3)]],
      //sku: [this.data.sku, [Validators.required, Validators.minLength(3)]],
      department_id: [this.data.department_id],
      description: [this.data.description, [Validators.required]],
      tags: [this.data.tags, [Validators.required]],
      grpitems: [''],
      status: [1],
    });

    this.productservice.allitems().subscribe({
      next: data => {
        this.items = data;
        // this.cdr.detectChanges();
      }
    })

    this.productservice.findList()
      .subscribe({
        next: data => {
          this.departments = data;

          let uuid = this.route.snapshot.paramMap.get('uuid');
          if (uuid) {
            this.productservice.find(uuid)
              .subscribe({
                next: data => {
                  this.data = data;
                  if (data.groupitems)
                    this.grpitemArray = data.groupitems.map((res: any) => res.item_id);
                  if (data.status == 'Publish') {
                    this.toast.failure('This product already published, so you could not edit this product.');
                    this.router.navigate(['/app/products']);
                  }
                  this.edit = true;
                  this.formData.setValue({
                    name: data.name,
                    department_id: data.department_id,
                    description: data.description || '',
                    tags: data.tags || '',
                    status: data.status,
                    grpitems: this.grpitemArray
                  });
                  // this.cdr.detectChanges();
                },
                error: () => {
                }
              });
          }
          // this.cdr.detectChanges();
        },
        error: () => {
          this.departments = []
        }
      });


  }
  get form() {
    return this.formData.controls;
  }

  saveGroup() {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.data.id != null) {
      let productdata = this.formData.value;
      productdata.id = this.data.id;
      this.productservice.update(productdata).subscribe({
        next: resp => {
          this.toast.success('Group Updated Successfully');
          this.data = {};
          this.formData.reset();
          this.submit = false;
          this.router.navigate(['/catalog/groups']);
          // this.cdr.detectChanges();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    } else {
      //console.log(this.formData.value.grpitems)
      this.productservice.creategroup(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('Group Created Successfully');
          this.data = {}
          this.formData.reset();
          this.router.navigate(['/catalog/groups']);
          // this.cdr.detectChanges();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }

}
