import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/events.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Events } from '../../../models/events';
import { Editor } from 'ngx-editor';
import { Newsletter } from '../../../models/newsletter';
import { NewsletterService } from '../../../services/newsletter.service';

@Component({
  selector: 'app-editnewsletter',
  templateUrl: './editnewsletter.component.html',
  styleUrls: ['./editnewsletter.component.scss']
})
export class EditnewsletterComponent {
  editor: Editor;
  html$ = '';
  linkitems: any;
  show_type = 'Web'
  @ViewChild('fileInput') fileInput!: ElementRef;
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
  data: Newsletter = {};
  stateImages: any;
  showimage: boolean = false;
  id: any;
  selectedLink: string = '';
  currentEditLink = '';
  minDate = {};
  statuses: Array<{ id: string, name: string }> = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: NewsletterService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private eventservice: EventService,
  ) { }

  ngOnInit(): void {
    this.editor = new Editor();
    this.formData = this.formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      content: ['', [Validators.required, this.emptyContentValidator]],
      image: [''],
      type: ['', [Validators.required]],
      link: ['', [Validators.required]],
      date: ['', [Validators.required]],
      status: ['1']
    });
    this.statuses = [{ id: '1', name: 'Active' }, { id: '0', name: 'Inactive' }];
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.blogService.view(this.id).subscribe({
        next: (data: any) => {
          this.data = data;
          this.edit = true;
          this.eventservice.linkitemlist(this.data.type, this.show_type).subscribe({
            next: data => {
              this.linkitems = data;
              let linkObj = this.linkitems.find((res: any) => res.slug === this.data.link);
              this.selectedLink = linkObj && linkObj.uuid;
              // console.log(this.selectedLink);
              this.cdr.detectChanges();
            }
          })
          this.formData.patchValue({
            id: data.id,
            title: data.title,
            content: data.content,
            link: this.selectedLink,
            type: data.type,
            date: data.date,
            status: data.status,
            image: data.image,
          });
          this.formData.get('link').setValue(data.link)
        },
        error: (err) => {
          console.log(err);
        }
      });
      // console.log(this.data.type);
    }
  }

  emptyContentValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value || '';
    // Remove HTML tags and check if the string is empty or only whitespace
    const strippedContent = value.replace(/<[^>]+>/g, '').trim();
    return strippedContent === '' ? { emptyContent: true } : null;
  }

  isRequired(formData: any, controlName: string) {
    return formData.get(controlName)?.errors?.required
  }

  isValid(formData: any, controlName: string) {
    return formData.get(controlName)?.errors?.isValid
  }
  get form() {
    return this.formData.controls;
  }
  assignLink(link: string) {
    if (this.linkitems.length) {
      let linkObj = this.linkitems.find((res: any) => res.uuid === link)
      this.selectedLink = linkObj && linkObj.uuid;
    }
    // console.log('link', this.selectedLink);
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  
  //   // Check if file is of a valid format
  //   if (file && (file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'))) {
  //     const img = new Image();
  //     const objectUrl = URL.createObjectURL(file);
      
  //     img.onload = () => {
  //       // Check for the correct image resolution (400x366 pixels)
  //       if (img.width === 400 && img.height === 366) {
  //         this.selectedFile = file;
  //       } else {
  //         this.toast.failure('Image resolution must be 400x366 pixels');
  //         this.selectedFile = null; 
  //         this.fileInput.nativeElement.value = ''; 
  //       }
  //       URL.revokeObjectURL(objectUrl); 
  //     };
  
  //     img.src = objectUrl; 
  //   } else {
  //     this.toast.failure('Supports JPG, PNG format only');
  //     this.selectedFile = null; 
  //     this.fileInput.nativeElement.value = ''; 
  //   }
  // }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]
    if (!(this.selectedFile.type.includes('jpeg') || this.selectedFile.type.includes('jpg') || this.selectedFile.type.includes('png'))) {
      this.toast.failure('Supports JPG, PNG format only');
      event.target.value=''
      this.formData.get('image')?.setValue('') 
      return;
    }
  }
  slugvariable(event: any) {
    let slug = event.target.value.toLowerCase();
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/[^a-z-]/g, '');
    this.formData.get('slug').setValue(slug);
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
    if (this.formData.status == 'INVALID') {
      // console.log('invalid data---------------', this.formData.value);
      this.formData.markAllAsTouched(); // Mark all fields to show errors
      return;
    }
    else {
      if (this.customCheckBeforeSubmit()) {
        return; // Block the form submission
      }
    }
    // console.log(this.formData.value);
    if (this.formData.get('title')?.value == '' ||
      this.formData.get('content')?.value == "" ||
      this.formData.get('status')?.value == '' ||
      (this.formData.get('link')?.value == '') ||
      this.formData.get('type')?.value == ''
    ) {
      this.toast.failure("Fill all required fields");
      // console.log('inside return statememt--------------', this.formData.value);
      return;
    }

    const form_Data = new FormData();
    form_Data.append('id', this.formData.get('id')?.value);
    form_Data.append('title', this.formData.get('title')?.value);
    form_Data.append('content', this.formData.get('content')?.value);

    form_Data.append('status', this.formData.get('status')?.value);
    form_Data.append('link', this.formData.get('link')?.value);
    form_Data.append('type', this.formData.get('type')?.value);


    if (this.selectedFile) {
      form_Data.append('image', this.selectedFile, this.selectedFile.name);
    }

    if (this.edit) {
      this.blogService.update(form_Data, this.data.id).subscribe({
        next: (resp) => {
          this.toast.success(' Updated Successfully');
          this.router.navigate(['/catalog/news']);
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    }
  }

  changeType(event: any) {
    const selectedType = event.target.value;

    this.linkitems = []
    this.eventservice.linkitemlist(selectedType, this.show_type).subscribe({
      next: data => {
        this.linkitems = data;

        // Assuming linkitems is an array with an object that has 'link' and 'name' properties.
        const selectedLinkItem = this.linkitems.find((item: any) => item.type === selectedType);
        if (selectedLinkItem) {
          this.formData.patchValue({
            link: selectedLinkItem.link
          });
        }

        this.cdr.detectChanges();
      }
    });
  }
}
