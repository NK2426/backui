import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreManagerService } from '../../../services/store.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { State } from 'src/app/pages/category-head/models/vendor';
import { Store } from '../../../models/store';

@Component({
  selector: 'app-editstore',
  templateUrl: './editstore.component.html',
  styleUrls: ['./editstore.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditstoreComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('stateFileInput') stateFileInput!: ElementRef;

  formData!: FormGroup;
  data: Store = {};
  id: any;
  edit: boolean = false;
  selected_state_File: File | null = null;
  selectedFile: File | null = null;
  submit: boolean = false;
  states?: State[];
  stateImages: any;
  showimage: boolean = false;
  statuses: Array<{ id: string, name: string }> = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private warehouservice: StoreManagerService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.statuses = [{ id: '1', name: 'Active' }, { id: '0', name: 'Inactive' }];
    this.formData = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      address1: ['', [Validators.required, Validators.minLength(6)]],
      map: ['', [Validators.required, Validators.minLength(6)]],
      slug: ['', [Validators.required, Validators.minLength(6)]],
      address2: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.minLength(6)]],
      image: [''],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(10), Validators.maxLength(10)]],
      status: [''],
      state_image: [''],
      state_id: ['', [Validators.required]]
    });
    this.warehouservice.getStates().subscribe({
      next: (resp) => {
        this.states = resp.data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.warehouservice.view(this.id).subscribe({
        next: (data) => {
          this.data = data;
          this.edit = true;
          this.formData.patchValue({
            id: data.id,
            name: data.name,
            state_id: data.state_id,
            address: data.address,
            address1: data.address1,
            address2: data.address2,
            map: data.map,
            slug: data.slug,
            mobile: data.mobile,
            pincode: data.pincode,
            status:data.status
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
        }
      });
      this.cdr.detectChanges();
    }
    
    this.cdr.detectChanges();
  }

  get form() {
    return this.formData.controls;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && (file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'))) {
      this.selectedFile = file;
    } else {
      this.toast.failure('Supports JPG, PNG format only');
      this.selectedFile = null; // Reset file selection if invalid
      this.fileInput.nativeElement.value = ''; // Clear the file input
    }
  }

  onStateFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && (file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'))) {
      this.selected_state_File = file;
    } else {
      this.toast.failure('Supports JPG, PNG format only');
      this.selected_state_File = null; // Reset file selection if invalid
      this.stateFileInput.nativeElement.value = ''; // Clear the state file input
    }
  }

  getstatename(event: any) {
    const selectedState = this.states.find((state) => state.name === event.target.value);
    if (selectedState) {
      this.formData.get('state_id').setValue(selectedState.id);
    }
  }

  saveUser() {
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
    form_Data.append('slug', this.formData.get('slug')?.value);
    form_Data.append('state_id', this.formData.get('state_id')?.value);

    if (this.selectedFile) {
      form_Data.append('image', this.selectedFile, this.selectedFile.name);
    }
    if (this.selected_state_File) {
      form_Data.append('state_image', this.selected_state_File, this.selected_state_File.name);
    } else if (this.formData.get('state_image')?.value) {
      form_Data.append('state_image', this.formData.get('state_image')?.value);
    }

    if (this.edit) {
      this.warehouservice.update(form_Data, this.data.id).subscribe({
        next: (resp) => {
          this.toast.success('Store Updated Successfully');
          this.router.navigate(['/catalog/stores']);
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    }
  }
}
