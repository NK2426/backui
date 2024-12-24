import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Blog } from '../../../models/blog';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-editblog',
  templateUrl: './editblog.component.html',
  styleUrls: ['./editblog.component.scss'],

})
export class EditblogComponent implements OnInit {
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
  @ViewChild('fileInput') fileInput!: ElementRef;
  formData!: FormGroup;
  data: Blog = {};
  id: any;
  edit: boolean = false;
  selectedFile: File | null = null;
  submit: boolean = false;
  statuses: Array<{ id: string, name: string }> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private toast: ToastService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.editor = new Editor();
    this.formData = this.formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      content: ['', [Validators.required, this.emptyContentValidator]],
      image: [''],
      slug: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      status: ['1']
    });
    this.statuses = [{ id: '1', name: 'Active' }, { id: '0', name: 'Inactive' }];
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.blogService.view(this.id).subscribe({
        next: (data) => {
          this.data = data;
          this.edit = true;
          this.formData.patchValue({
            id: data.id,
            title: data.title,
            content: data.content,
            status: data.status,
            slug: data.slug,
            image: data.image,

          });
          this.formData.get('slug').setValue(data.slug)
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  emptyContentValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value || '';
    // Remove HTML tags and check if the string is empty or only whitespace
    const strippedContent = value.replace(/<[^>]+>/g, '').trim();
    return strippedContent === '' ? { emptyContent: true } : null;
  }


  get form() {
    return this.formData.controls;
  }
  ngOnDestroy(): void {
    this.editor.destroy();
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

  saveUser() {
    this.submit = true;
    if (this.formData.get('title')?.value == '' || this.formData.get('content')?.value == '' || this.formData.get('status')?.value == '' || this.formData.get('slug')?.value == '') {
      this.toast.failure("Fill all required fields")
      return;
    }

    if (this.formData.status == 'INVALID') {
      // console.log('invalid data---------------', this.formData.value);
      this.formData.markAllAsTouched(); // Mark all fields to show errors
      return;
    }
    else {
      if (this.customCheckBeforeSubmit()) {
        // console.log('Form submission blocked by business logic');
        return; // Block the form submission
      }
    }

    const form_Data = new FormData();
    form_Data.append('id', this.formData.get('id')?.value);
    form_Data.append('title', this.formData.get('title')?.value);
    form_Data.append('content', this.formData.get('content')?.value);
    form_Data.append('slug', this.formData.get('slug')?.value);
    form_Data.append('status', this.formData.get('status')?.value);

    if (this.selectedFile) {
      form_Data.append('image', this.selectedFile, this.selectedFile.name);
    }

    if (this.edit) {
      this.blogService.update(form_Data, this.data.id).subscribe({
        next: (resp) => {
          this.toast.success('Blog Updated Successfully');
          this.router.navigate(['/catalog/blogs']);
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    }
  }
}
