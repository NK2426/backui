import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ToastService } from 'src/app/_helpers/toast.service';
import { GroupService } from '../../../services/group.service';


import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from 'src/environments/environment';
import { Group } from '../../../models/groups';
import { Productparameters, Productparametersvalues } from '../../../models/productparameters';


@Component({
  selector: 'app-viewgroup',
  templateUrl: './viewgroup.component.html',
  styleUrls: ['./viewgroup.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class ViewgroupComponent implements OnInit {

  formData!: FormGroup;
  selectedDepartment: Group = {};
  productParameters!: Productparameters[];
  selectedRowIndex!: number;
  showProductParameterValues!: boolean;
  productParameterValues!: Productparametersvalues[];

  // @Output() editDepartment = new EventEmitter<Department>();
  // @Output() refreshList = new EventEmitter<string>();
  assignedparams: any = [];
  submit: boolean = false;
  show: boolean = false;
  statuses: Array<{ id: string, name: string }> = [];
  addfile: string = '';
  baseurl: string = '';
  fileName: any = '';
  groupUUID!: string;
  supercoins: Array<{ key: number, value: number }> = [];


  constructor(private groupService: GroupService, private cdr: ChangeDetectorRef, private modelservice: NgbModal, private toast: ToastService, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.baseurl = environment.CATALOG_URL;;
    this.formData = this.formBuilder.group({});
    this.groupUUID = this.route.snapshot.paramMap.get('uuid') || '';
    if (this.groupUUID) {
      this.getGroups(this.groupUUID);

    }
    this.statuses = [{ id: '1', name: 'Active' }, { id: '0', name: 'Inactive' }]

    // this.departmentservice.finddepassoc(this.selectedDepartment.did).subscribe({
    //   next:resp=>{
    //     if(resp.data.length==0)
    //     this.deleteaction = true;
    //   },error:err=>{
    //console.log(err);
    //   }
    // })

    for (let coins = 0; coins <= 3.1; coins = coins + 0.1) {
      this.supercoins.push({ key: coins, value: this.toFloat(coins) })
    }
  }
  toFloat(x: any) {
    let xyz = parseInt(x) === x ? x : parseFloat(x).toFixed(2)
    return Number(xyz);
  }
  getGroups(group_uuid: string) {
    this.groupService.find(group_uuid).subscribe({
      next: resp => {
        if (resp) {
          this.selectedDepartment = resp;

          this.fileName = this.selectedDepartment.image;
          if (resp.productparameters) {
            this.productParameters = resp.productparameters;
            // console.log(this.productParameters);

            this.showProductParamTable(this.productParameters[0], 0);
          }
          this.formData = this.formBuilder.group({
            name: [this.selectedDepartment.name, [Validators.required, Validators.minLength(3)]],
            description: [this.selectedDepartment.description],
            position: [this.selectedDepartment.position, [Validators.required, Validators.minLength(1), Validators.min(0)]],
            name_ta: [this.selectedDepartment.name_ta],
            imgpath: ['', (this.fileName == '') ? [Validators.required] : ''],
            supercoins: [this.selectedDepartment.supercoins],
            status: [this.selectedDepartment.status, [Validators.required]],
            slug: [this.selectedDepartment.slug, [Validators.required]],
          });
          // this.cdr.detectChanges();
        }

      },
      error: err => {
        //console.log(err);
      }
    })

  }
  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      let self = this;
      const file = event.target.files[0];
      if (!(file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'))) {
        self.formData.controls['imgpath'].setValue('');
        self.toast.failure('Supports JPG, PNG format only');
        return;
      }
      const filesize = file.size / 1024; // in kb 
      let ratio = '';
      var objectUrl = URL.createObjectURL(file);
      let img = new Image();
      img.onload = function () {
        ratio = ((Number(img.width) / Number(img.height)) + '').slice(0, 3)
        URL.revokeObjectURL(objectUrl);
        if (!self.validateImageBasedOnType(img.width, ratio, 'choosetype', false, false, filesize, true)) { // check size of image
          self.formData.controls['imgpath'].setValue('');
          self.toast.failure('Image size exceeds 500kb');
          return;
        }
        if (!self.validateImageBasedOnType(img.width, ratio, 'choosetype', false, true)) { // check ratio
          self.formData.controls['imgpath'].setValue('');
          self.toast.failure('Image ratio mismatch');
          return;
        }
        var mimeType = event.target.files[0].type;
        if (!mimeType.match('image.*')) {
          self.formData.controls['imgpath'].setValue('');
          self.toast.failure("Upload Image only");
        }
        else {
          self.addfile = file
        }
      };
      img.src = objectUrl;

    }
  }

  editdept() {
    this.show = true;
  }

  get form() {
    return this.formData.controls;
  }

  saveDept() {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    this.newimage();
  }

  newimage() {
    const formd: any = new FormData();
    formd.append('imgpath', this.addfile);
    formd.append('name', this.formData.value.name);
    formd.append('name_ta', this.formData.value.name_ta);
    formd.append('position', this.formData.value.position);
    formd.append('description', this.formData.value.description);
    formd.append('supercoins', this.formData.value.supercoins);
    formd.append('status', this.formData.value.status);
    formd.append('slug', this.formData.value.slug);
    var msg = 'Created';
    if (this.selectedDepartment.id) {
      formd.append('id', this.selectedDepartment.id);
      msg = 'Updated';
    }
    this.groupService.updateimg(formd).subscribe({
      next: resp => {
        this.addfile = '';
        this.submit = false;
        this.show = false;
        this.fileName = resp.image;
        this.selectedDepartment = resp;
        this.toast.success('Group Successfully ' + msg);
        location.reload();
        // this.cdr.detectChanges();
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    });
  }

  cancel() {
    this.show = false;
  }

  showProductParamTable(param: Productparameters, index: number) {
    if (param && param.productparametervalues) {
      this.showProductParameterValues = true;
      this.selectedRowIndex = index;
      this.productParameterValues = param.productparametervalues;
      this.cdr.detectChanges();
    }
  }

  validateImageBasedOnType(imageWidth: any, ratio: string, type: string, checkWidth?: boolean, checkRatio?: boolean, imageSize?: number, checkSize?: boolean) {
    if (type.toLowerCase() === 'banner') {// for banner
      if (checkWidth) {
        return Number(imageWidth) > 1000;
      } else if (checkRatio) {
        return ratio === '2';
      } else {
        return;
      }

    } else if (type.toLowerCase() === 'poster') {// for poster
      if (checkWidth) {
        return Number(imageWidth) > 1000;
      } else if (checkRatio) {
        return ratio === '1.3';
      } else {
        return;
      }

    } else if (type.toLowerCase() === 'strip') {// for strip
      ratio = parseInt(ratio) + '';
      if (checkWidth) {
        return Number(imageWidth) > 700;
      } else if (checkRatio) {
        return ratio === '4';
      } else {
        return;
      }
    } else if (type.toLowerCase() === 'section') {// for section
      if (checkWidth) {
        return Number(imageWidth) > 300;
      } else if (checkRatio) {
        return ratio === '1';
      } else {
        return;
      }
    } else if (type.toLowerCase() === 'choosetype') {// for section
      if (checkSize) {
        return Number(imageSize) < 500; // < 500kb
      } else if (checkRatio) {
        return ratio === '1';
      } else {
        return;
      }
    } else {// for list
      if (checkWidth) {
        return Number(imageWidth) < 800;
      } else if (checkRatio) {
        return ratio === '0.6';
      } else {
        return;
      }
    }

  }


  toggleCheck(uuid: string, toggleValue: number, changeToggle?: boolean, productParam_ta?: string) {
    if (toggleValue === 1 && changeToggle) {
      toggleValue = 0;
    } else if (toggleValue == 0 && changeToggle) {
      toggleValue = 1;
    } else {
      toggleValue = toggleValue;
    }
    this.groupService.toggleProductParamFilter(uuid, toggleValue, productParam_ta).subscribe({
      next: resp => {
        if (resp) {
          this.getGroups(this.groupUUID);
        }
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    });
  }

  OnProductParamValueBlur(id: string, productParamValue_ta?: string) {

    this.groupService.updateProductParamFilterValue(id, productParamValue_ta).subscribe({
      next: resp => {
        if (resp) {
          this.getGroups(this.groupUUID);
        }
        // this.cdr.detectChanges();
      }, error: err => {
        if (typeof err === 'string') {
          this.toast.failure(err);
        } else {
          this.toast.failure(err.error.message);
        }
      }
    });
  }

}
