import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/events.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Events } from '../../../models/events';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-editevent',
  templateUrl: './editevent.component.html',
  styleUrls: ['./editevent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditeventComponent implements OnInit {

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
  data: Events = {};
  stateImages: any;
  showimage: boolean = false;
  id: any;
  selectedLink: string = '';
  currentEditLink = '';
  statuses: Array<{ id: string, name: string }> = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: EventService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
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
      name: ['', [Validators.required]],
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
          this.blogService.linkitemlist(this.data.type, this.show_type).subscribe({
            next: data => {
              this.linkitems = data;
              let linkObj = this.linkitems.find((res: any) => res.uuid === this.data.link);
              this.selectedLink = linkObj && linkObj.uuid;
              // console.log(this.selectedLink);
              this.cdr.detectChanges();
            }
          })
          this.formData.patchValue({
            id: data.id,
            title: data.title,
            content: data.content,
            link: data.link,
            type: data.type,
            name: data.link_name,
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
      console.log(this.data.type);
    }
  }

  get form() {
    return this.formData.controls;
  }

  emptyContentValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value || '';
    // Remove HTML tags and check if the string is empty or only whitespace
    const strippedContent = value.replace(/<[^>]+>/g, '').trim();
    return strippedContent === '' ? { emptyContent: true } : null;
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

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file && (file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'))) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        if (img.width === 400 && img.height === 366) {
          this.selectedFile = file;
        } else {
          this.toast.failure('Image resolution must be 400x366 pixels');
          this.selectedFile = null; // Reset file selection if resolution is incorrect
          this.fileInput.nativeElement.value = ''; // Clear the file input
        }
        URL.revokeObjectURL(objectUrl); // Clean up the object URL
      };

      img.src = objectUrl; // Trigger the onload event
    } else {
      this.toast.failure('Supports JPG, PNG format only');
      this.selectedFile = null; // Reset file selection if invalid
      this.fileInput.nativeElement.value = ''; // Clear the file input
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
    if (this.formData.status == "INVALID") {
      // console.log("Invalid----------")
      // console.log(this.formData.value);
      this.formData.markAllAsTouched();
      return
    }
    else {
      if (this.customCheckBeforeSubmit()) {
        return; // Block the form submission
      }
    }
    // console.log(this.formData);

    if (this.formData.get('title')?.value == '' ||
      this.formData.get('content')?.value == '' ||
      this.formData.get('status')?.value == '' ||
      this.formData.get('slug')?.value == '' ||
      (this.formData.get('link')?.value == '' || !this.formData.get('link')?.value) ||
      this.formData.get('type')?.value == '' ||
      this.formData.get('name')?.value == '') {
      this.toast.failure("Fill all required fields");
      return;
    }


    const form_Data = new FormData();
    form_Data.append('id', this.formData.get('id')?.value);
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

    if (this.edit) {
      this.blogService.update(form_Data, this.data.id).subscribe({
        next: (resp) => {
          this.toast.success('Live Event Updated Successfully');
          this.router.navigate(['/catalog/live-events']);
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
    this.blogService.linkitemlist(selectedType, this.show_type).subscribe({
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
