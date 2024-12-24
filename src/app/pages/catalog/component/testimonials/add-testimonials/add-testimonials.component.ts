import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Testimonials } from '../../../models/testimonials';
import { TestimonialsService } from '../../../services/testimonials.service';

@Component({
  selector: 'app-add-testimonials',
  templateUrl: './add-testimonials.component.html',
  styleUrls: ['./add-testimonials.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, NgSelectModule, RouterModule, NgbPaginationModule]
})
export class AddTestimonialsComponent {
  @Input() data: Testimonials = {};

  html$ = '';
  get html(): string {
    return this.html$;
  }
  set html(html: string) {
    this.html$ = html;
    this.fixTentative = html.replace(/<p><\/p>/ig, '<p><br><\/p>');
  }
  fixTentative = '';
  formData!: FormGroup;
  warehouses: Testimonials[];
  submit: boolean = false;
  selectedFile: File | null = null;
  edit: boolean = false;
  stateImages: any;
  showimage: boolean = false;

  constructor(
    private warehouseservice: TestimonialsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toast: ToastService,
    private formBuilder: FormBuilder
  ) { }
  ngOnInit(): void {

    this.formData = this.formBuilder.group({
      name: [this.data.name, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]], // Set character limits here
      content: [this.data.content, [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      image: [this.data.image, [Validators.required]],
      status: ['1']
    });

    this.stateImages = [];
  }

  get form() {
    return this.formData.controls;
  }

  back() {
    this.router.navigate(['/catalog/testimonials']);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (!(this.selectedFile.type.includes('jpeg') || this.selectedFile.type.includes('jpg') || this.selectedFile.type.includes('png'))) {
      this.toast.failure('Supports JPG, PNG format only');
      this.selectedFile = null; // Clear the selected file

      // Reset the form control associated with the file input
      this.formData.get('image').setValue(''); // Replace 'fileControlName' with your actual form control name

      return;
    }
  }



  save() {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }

    const form_Data = new FormData();
    form_Data.append('name', this.formData.get('name')?.value);
    form_Data.append('content', this.formData.get('content')?.value);
    form_Data.append('status', this.formData.get('status')?.value);

    if (this.selectedFile) {
      form_Data.append('image', this.selectedFile, this.selectedFile.name);
    }

    // console.log(form_Data);
    this.warehouseservice.create(form_Data).subscribe({
      next: (warehouse: any) => {
        // console.log(warehouse);
        this.toast.success('Testimonials Created Successfully');
        this.router.navigate(['/catalog/testimonials']);
      },
      error: (err: any) => {
        this.toast.failure(err);
      }
    });
  }
}
