import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


import { Editor, NgxEditorModule } from 'ngx-editor';
import { Events } from '../../../models/events';
import { EventService } from '../../../services/events.service';

@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, NgSelectModule, RouterModule, NgbPaginationModule, NgxEditorModule]
})
export class AddeventComponent {
  @Input() data: Events = {};
  editor: Editor;
  html$ = '';
  linkitems: any;
  show_type = 'Web'
  get html(): string {
    return this.html$;
  }
  types = [{ 'id': 'Product', 'label': 'Product' }, { 'id': 'Group', 'label': 'Group' }, { 'id': 'Tag', 'label': 'Tag' }]
  set html(html: string) {
    this.html$ = html;
    this.fixTentative = html.replace(/<p><\/p>/ig, '<p><br><\/p>');
  }
  fixTentative = '';
  formData!: FormGroup;
  warehouses: Event[];
  submit: boolean = false;
  selectedFile: File | null = null;
  edit: boolean = false;
  stateImages: any;
  showimage: boolean = false;

  constructor(
    private warehouseservice: EventService,
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
      type: [this.data.type, [Validators.required]],
      name: [this.data.type, [Validators.required]],
      link: [this.data.link, [Validators.required]],
      status: ['1']
    });
    this.stateImages = [];
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

  back() {
    this.router.navigate(['/catalog/live-events']);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (!(this.selectedFile.type.includes('jpeg') || this.selectedFile.type.includes('jpg') || this.selectedFile.type.includes('png'))) {
      this.toast.failure('Supports JPG, PNG format only');
      this.selectedFile = null; // Reset the file selection if invalid
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(this.selectedFile);
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      if (width !== 400 || height !== 366) {
        this.toast.failure('Image must be 400x366 pixels');
        this.selectedFile = null; // Reset the file selection if resolution is incorrect
      }
    };
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

    const form_Data = new FormData();
    form_Data.append('title', this.formData.get('title')?.value);
    form_Data.append('content', this.formData.get('content')?.value);
    form_Data.append('slug', this.formData.get('slug')?.value);
    form_Data.append('status', this.formData.get('status')?.value);
    form_Data.append('link', this.formData.get('link')?.value);
    form_Data.append('type', this.formData.get('type')?.value);
    form_Data.append('name', this.formData.get('name')?.value);

    if (this.selectedFile) {
      form_Data.append('image', this.selectedFile, this.selectedFile.name);
    }

    // console.log(form_Data);

    this.warehouseservice.create(form_Data).subscribe({
      next: (warehouse: any) => {
        // console.log(warehouse);
        this.toast.success('Live Event Created Successfully');
        this.router.navigate(['/catalog/live-events']);
      },
      error: (err: any) => {
        this.toast.failure(err);
      }
    });
  }

  customCheckBeforeSubmit(): boolean {
    const content = this.formData.get('content')?.value || '';
    const strippedContent = content.replace(/<[^>]*>/g, '').trim();
    if (strippedContent.includes('block')) {
      return true; // Block the submission
    }
    return false; // Allow submission
  }

  changeType(event: any) {
    // console.log(event.target.value);
    this.warehouseservice.linkitemlist(event.target.value, this.show_type).subscribe({
      next: data => {
        this.linkitems = data;
        this.cdr.detectChanges();
      }
    })
  }

}
