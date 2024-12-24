import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import { Store } from '../../../models/store';
import { StoreManagerService } from '../../../services/store.service';
import { State } from 'src/app/pages/category-head/models/vendor';

@Component({
  selector: 'app-addstore',
  templateUrl: './addstore.component.html',
  styleUrls: ['./addstore.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    RouterModule,
    QRCodeModule,
    ZXingScannerModule,
    NgbPaginationModule
  ]
})
export class AddstoreComponent implements OnInit {
  @Input() data: Store = {};

  formData!: FormGroup;
  warehouses: Store[];
  submit: boolean = false;
  selectedFile: File | null = null;
  selected_state_File: File | null = null;
  edit: boolean = false;
  states?: State[];
  stateImages: any;
  showimage: boolean = false;

  constructor(
    private warehouseservice: StoreManagerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toast: ToastService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      name: [this.data.name, [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(10), Validators.maxLength(10)]],
      address: [this.data.address, [Validators.required]],
      address1: [this.data.address1, [Validators.required]],
      address2: [this.data.address2, [Validators.required]],
      map: [this.data.map, [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(5), Validators.maxLength(6)]],
      image: [this.data.image, [Validators.required]],
      state_image: [this.data.state_image, [Validators.required]],
      state_id: [this.data.state_id, [Validators.required]],
      status: ['1']
    });

    this.warehouseservice.getStates().subscribe({
      next: (resp) => {
        this.states = resp.data;
        this.cdr.detectChanges();
      },
      error: (error) => { }
    });
    this.stateImages = [];
  }

  get form() {
    return this.formData.controls;
  }

  back() {
    this.router.navigate(['/catalog/stores']);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]
    if (!(this.selectedFile.type.includes('jpeg') || this.selectedFile.type.includes('jpg') || this.selectedFile.type.includes('png'))) {
      this.toast.failure('Supports JPG, PNG format only');
      return
    }
  }
  onStateFileSelected(event: any) {
    if (!(this.selected_state_File.type.includes('jpeg') || this.selected_state_File.type.includes('jpg') || this.selected_state_File.type.includes('png'))) {
      this.toast.failure('Supports JPG, PNG format only');
      return
    } else {
      if (this.selected_state_File !== null) this.selected_state_File = event.target.files[0];
    }

  }

  getstatename(event: any) {
    // console.log(event.target.value);
    let id = this.states.filter((e) => {
      if (e.name == event.target.value) return e.id;
    });
    this.formData.get('state_id').setValue(id[0].id);
    this.warehouseservice.state_image(id[0].id).subscribe({
      next: (data) => {
        this.stateImages = data;
        // console.log(data);

        if (this.stateImages.state_image === undefined)
          this.showimage = false;
        if (this.stateImages.state_image !== undefined)
          this.showimage = true;

        // console.log(this.stateImages,this.showimage);

        this.cdr.detectChanges();
        this.formData.get('state_image').setValue(data.state_image);
      },
      error: (err) => {
        console.log('error page');
        this.toast.failure(err);
      }
    });
    this.cdr.detectChanges();
  }
  save() {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }

    const form_Data = new FormData();
    form_Data.append('name', this.formData.get('name')?.value);
    form_Data.append('mobile', this.formData.get('mobile')?.value);
    form_Data.append('address', this.formData.get('address')?.value);
    form_Data.append('address1', this.formData.get('address1')?.value);
    form_Data.append('address2', this.formData.get('address2')?.value);
    form_Data.append('map', this.formData.get('map')?.value);
    form_Data.append('pincode', this.formData.get('pincode')?.value);
    form_Data.append('status', this.formData.get('status')?.value);
    form_Data.append('state_id', this.formData.get('state_id')?.value);

    if (this.selectedFile) {
      form_Data.append('image', this.selectedFile, this.selectedFile.name);
    }
    if (!this.stateImages) {
      form_Data.append('state_image', this.selected_state_File, this.selected_state_File.name);
    } else {
      form_Data.append('state_image', this.formData.get('state_image')?.value);
    }

    // console.log(form_Data);

    this.warehouseservice.create(form_Data).subscribe({
      next: (warehouse: any) => {
        // console.log(warehouse);
        this.toast.success('Store Created Successfully');
        this.router.navigate(['/catalog/stores']);
      },
      error: (err: any) => {
        this.toast.failure(err);
      }
    });
  }
}
