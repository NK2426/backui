import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { BlogService } from '../../../services/blog.service';
import { Blog } from '../../../models/blog';

import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-addblog',
  templateUrl: './addblog.component.html',
  styleUrls: ['./addblog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, NgSelectModule, RouterModule, NgbPaginationModule, NgxEditorModule]
})
export class AddblogComponent {
  @Input() data: Blog = {};
  editor: Editor;
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
  warehouses: Blog[];
  submit: boolean = false;
  selectedFile: File | null = null;
  edit: boolean = false;
  stateImages: any;
  showimage: boolean = false;

  constructor(
    private warehouseservice: BlogService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toast: ToastService,
    private formBuilder: FormBuilder
  ) { }
  ngOnInit(): void {
    this.editor = new Editor();
    this.formData = this.formBuilder.group({
      title: [this.data.title, [Validators.required, Validators.minLength(3), Validators.maxLength(150)]], // Set character limits here
      content: [this.data.content, [Validators.required, this.emptyContentValidator]],
      slug: [this.data.slug, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      image: [this.data.image, [Validators.required]],

      status: ['1']
    });

    this.stateImages = [];
  }

  get form() {
    return this.formData.controls;
  }

  back() {
    this.router.navigate(['/catalog/blogs']);
  }

  emptyContentValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value || '';
    // Remove HTML tags and check if the string is empty or only whitespace
    const strippedContent = value.replace(/<[^>]+>/g, '').trim();
    return strippedContent === '' ? { emptyContent: true } : null;
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

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  slugvariable(event: any) {
    // console.log(event.target.value);
    let slug = event.target.value.toLowerCase()
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/[^a-z-]/g, '')
    // console.log(slug);
    this.formData.get('slug').setValue(slug)
  }

  customCheckBeforeSubmit(): boolean {
    const content = this.formData.get('content')?.value || '';
    const strippedContent = content.replace(/<[^>]*>/g, '').trim();
    // Example condition: block submission if content contains the word 'block'
    if (strippedContent.includes('block')) {
      return true; // Block the submission
    }
    // Add more conditions here as per your requirement
    return false; // Allow submission
  }


  save() {
    this.submit = true;
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }
    else {
      if (this.customCheckBeforeSubmit()) {
        // console.log('Form submission blocked by business logic');
        return; // Block the form submission
      }
    }

    if (this.formData.get('content')?.value) {
      this.toast.failure('Add Content')
    }

    const form_Data = new FormData();
    form_Data.append('title', this.formData.get('title')?.value);
    form_Data.append('content', this.formData.get('content')?.value);
    form_Data.append('slug', this.formData.get('slug')?.value);
    form_Data.append('status', this.formData.get('status')?.value);

    if (this.selectedFile) {
      form_Data.append('image', this.selectedFile, this.selectedFile.name);
    }
    // console.log(form_Data);
    this.warehouseservice.create(form_Data).subscribe({
      next: (warehouse: any) => {
        // console.log(warehouse);
        this.toast.success('Blog Created Successfully');
        this.router.navigate(['/catalog/blogs']);
      },
      error: (err: any) => {
        this.toast.failure(err);
      }
    });
  }
}
