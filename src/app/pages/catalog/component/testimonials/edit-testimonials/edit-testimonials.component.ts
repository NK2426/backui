import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
import { TestimonialsService } from '../../../services/testimonials.service';
import { Testimonials } from '../../../models/testimonials';

@Component({
  selector: 'app-edit-testimonials',
  templateUrl: './edit-testimonials.component.html',
  styleUrls: ['./edit-testimonials.component.scss']
})
export class EditTestimonialsComponent implements OnInit {

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
  data: Testimonials = {};
  id: any;
  edit: boolean = false;
  selectedFile: File | null = null;
  submit: boolean = false;
  statuses: Array<{ id: string, name: string }> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: TestimonialsService,
    private toast: ToastService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.formData = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      image: ['', [Validators.required]],
      status: ['1']
    });
    this.statuses = [{ id: '1', name: 'Active' }, { id: '0', name: 'Inactive' }];
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.blogService.view(this.id).subscribe({
        next: (data) => {
          this.data = data;
          this.edit = true;

          this.formData.get('id').setValue(data.id)
          this.formData.get('name').setValue(data.name)
          this.formData.get('status').setValue(data.status)
          this.formData.get('content').setValue(data.content)
          this.formData.get('image').setValue(this.data.image)

        },
        error: (err) => {
          console.log(err);
        }
      });
    }
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
      // Clear the file input by setting its value to an empty string
      this.fileInput.nativeElement.value = '';
    }
  }


  saveUser() {
    this.submit = true;
    // console.log(this.formData);

    // console.log(this.formData.get('image').value);

    if (this.formData.get('name').value == '' ||
      this.formData.get('status').value == '' ||
      this.formData.get('content').value == '' ||
      this.formData.get('image').value == '' ||
      this.formData.get('id').value == '') {
      return
    }

    const form_Data = new FormData();

    form_Data.append('id', this.formData.get('id')?.value);
    form_Data.append('name', this.formData.get('name')?.value);
    form_Data.append('content', this.formData.get('content')?.value);

    form_Data.append('status', this.formData.get('status')?.value);

    if (this.selectedFile) {
      form_Data.append('image', this.selectedFile, this.selectedFile.name);
    }
    // else{
    //   form_Data.append('image', this.formData.get('image')?.value);
    // }

    // console.log(form_Data);

    if (this.edit) {
      this.blogService.update(form_Data, this.data.id).subscribe({
        next: (resp) => {
          this.toast.success('Testimonials Updated Successfully');
          this.router.navigate(['/catalog/testimonials']);
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    }
  }
}
