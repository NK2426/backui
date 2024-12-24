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
import { NewsletterService } from '../../../services/newsletter.service';
import { Newsletter } from '../../../models/newsletter';
import { DateTimePickerComponent } from 'src/app/widgets/date-time-picker/date-time-picker.component';
import { EventService } from '../../../services/events.service';

@Component({
  selector: 'app-addnewsletter',
  templateUrl: './addnewsletter.component.html',
  styleUrls: ['./addnewsletter.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, NgSelectModule, RouterModule, NgbPaginationModule, NgxEditorModule, DateTimePickerComponent]
})
export class AddnewsletterComponent {
  @Input() data: Newsletter = {};
  editor: Editor;
  html$ = '';
  get html(): string {
    return this.html$;
  }
  linkitems: any;
  set html(html: string) {
    this.html$ = html;
    this.fixTentative = html.replace(/<p><\/p>/ig, '<p><br><\/p>');
  }
  fixTentative = '';
  formData!: FormGroup;
  warehouses: Newsletter[];
  submit: boolean = false;
  selectedFile: File | null = null;
  edit: boolean = false;
  stateImages: any;
  show_type = 'Web'
  showimage: boolean = false;
  minDate = {};
  types = [{ 'id': 'Group', 'label': 'Group' }, { 'id': 'Tag', 'label': 'Tag' }]
  constructor(
    private warehouseservice: NewsletterService,
    private eventservice: EventService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toast: ToastService,
    private formBuilder: FormBuilder
  ) { }
  ngOnInit(): void {
    this.editor = new Editor();
    let todayDate = new Date();
    let minDate = { day: todayDate.getDate(), month: todayDate.getMonth() + 1, year: todayDate.getFullYear() }
    this.formData = this.formBuilder.group({
      title: [this.data.title, [Validators.required, Validators.minLength(3), Validators.maxLength(150)]], // Set character limits here
      content: [this.data.content, [Validators.required, this.emptyContentValidator]],
      type: [this.data.type, [Validators.required]],
      link: [this.data.link, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      image: [this.data.image, [Validators.required]],
      date: [new Date(new Date().getTime() + (1 * 60 * 60 * 1000)).toISOString()],

      status: ['1']
    });
    this.stateImages = [];
  }

  get form() {
    return this.formData.controls;
  }

  isRequired(formData: any, controlName: string) {
    return formData.get(controlName)?.errors?.required
  }

  isValid(formData: any, controlName: string) {
    return formData.get(controlName)?.errors?.isValid
  }

  back() {
    this.router.navigate(['/catalog/news']);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]
    if (!(this.selectedFile.type.includes('jpeg') || this.selectedFile.type.includes('jpg') || this.selectedFile.type.includes('png'))) {
      this.toast.failure('Supports JPG, PNG format only');
      event.target.value=''
      this.formData.get('image')?.setValue('') 
      return;
    }
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  emptyContentValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value || '';
    // Remove HTML tags and check if the string is empty or only whitespace
    const strippedContent = value.replace(/<[^>]+>/g, '').trim();
    return strippedContent === '' ? { emptyContent: true } : null;
  }

  save() {
    this.submit = true;
    // console.log(this.formData.value);
    if (this.formData.get('content').value == "") {
      this.toast.failure("Add content")
    }
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }
    else {
      if (this.customCheckBeforeSubmit()) {
        return; // Block the form submission
      }
    }

    const form_Data = new FormData();
    form_Data.append('title', this.formData.get('title')?.value);
    form_Data.append('content', this.formData.get('content')?.value);
    form_Data.append('link', this.formData.get('link')?.value);
    form_Data.append('type', this.formData.get('type')?.value);
    form_Data.append('date', this.formData.get('date')?.value);
    form_Data.append('status', this.formData.get('status')?.value);

    if (this.selectedFile) {
      form_Data.append('image', this.selectedFile, this.selectedFile.name);
    }

    // console.log(form_Data);

    this.warehouseservice.create(form_Data).subscribe({
      next: (warehouse: any) => {
        // console.log(warehouse);
        this.toast.success('Blog Created Successfully');
        this.router.navigate(['/catalog/news']);
      },
      error: (err: any) => {
        this.toast.failure(err);
      }
    });
  }

  changeType(event: any) {
    // console.log(event.target.value);
    this.eventservice.linkitemlist(event.target.value, this.show_type).subscribe({
      next: data => {
        this.linkitems = data;

        this.cdr.detectChanges();
      }
    })
  }

  customCheckBeforeSubmit(): boolean {
    const content = this.formData.get('content')?.value || '';
    const strippedContent = content.replace(/<[^>]*>/g, '').trim();
    if (strippedContent.includes('block')) {
      return true; // Block the submission
    }
    return false; // Allow submission
  }

}


