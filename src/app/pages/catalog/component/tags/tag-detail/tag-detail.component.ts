import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/_helpers/toast.service';
import { TAGS } from '../../../models/tag';
import { TagService } from '../../../services/tag.service';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-tag-detail',
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class TagDetailComponent implements OnInit {
  formData!: FormGroup;
  currentTag!: TAGS.Tag;
  tagItems!: TAGS.TagItem[];
  tagUUID: string = '';
  currentImage: string = '';
  addfile: string = '';
  submit: boolean = false;
  show: boolean = false;
  statuses: Array<{ id: string; name: string }> = [];
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toast: ToastService,
    private route: ActivatedRoute,
    private tagService: TagService
  ) {
    this.formData = this.formBuilder.group({});
    this.tagUUID = this.route.snapshot.paramMap.get('tagID') || '';
    if (this.tagUUID !== '' && this.tagUUID !== '1') {
      this.getTagDetail(this.tagUUID);
    } else {
      this.show = true;
    }
  }

  get form() {
    return this.formData.controls;
  }

  ngOnInit(): void {
    this.statuses = [
      { id: '1', name: 'Active' },
      { id: '0', name: 'Inactive' }
    ];
    this.formData = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      name_ta: [''],
      group_id: [1, [Validators.required]],
      path: ['', [Validators.required]],
      status: [1, [Validators.required]],
      slug: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  getTagDetail(tagUUID: string) {
    this.tagService.getTagById(tagUUID).subscribe({
      next: (resp) => {
        if (resp) {
          this.currentTag = resp.data;
          if (this.currentTag && this.currentTag.tagitems && this.currentTag.tagitems.length) {
            this.tagItems = this.currentTag.tagitems;

          }
          this.currentImage = resp.data.path;
          // this.cdr.detectChanges();
          this.formData = this.formBuilder.group({
            name: [this.currentTag.name, [Validators.required, Validators.minLength(3)]],
            name_ta: [this.currentTag.name_ta],
            group_id: [1, this.currentTag.group_id === 1 ? [Validators.required] : ''],
            path: ['', (this.currentImage == '') ? [Validators.required] : ''],
            status: [1, this.currentTag.status === 1 ? [Validators.required] : ''],
            slug: [this.currentTag.slug, [Validators.required, Validators.minLength(3)]],
          });
        }
      },
      error: (err) => {
        //console.log(err);
      }
    });
  }

  editTag() {
    this.show = true;
  }

  cancel() {
    this.show = false;
    this.router.navigate(['/catalog/tags'])
  }

  saveTag() {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    this.upsertTag();
  }

  upsertTag() {
    const formd: any = new FormData();
    formd.append('name', this.formData.value.name);
    /*  formd.append('name_ta', this.formData.value.name_ta); */
    formd.append('path', this.addfile);
    formd.append('group_id', this.formData.value.group_id);
    formd.append('status', this.formData.value.status);
    formd.append('slug', this.formData.value.slug);
    if (this.currentTag && this.currentTag.id) {
      this.tagService.updateTag(this.tagUUID, formd).subscribe({
        next: (resp) => {
          if (resp && resp.data) {
            this.addfile = '';
            this.submit = false;
            this.show = false;
            this.currentTag = resp.data;
            this.currentImage = resp.data.path;
            this.toast.success('Updated Tag Successfully ');
            location.reload();
          }
        },
        error: (err) => {
          this.toast.failure(err.error.message);
        }
      });
    } else {
      this.tagService.createTag(formd).subscribe({
        next: (resp) => {
          if (resp && resp.data) {
            this.addfile = '';
            this.submit = false;
            this.show = false;
            this.currentTag = resp.data;
            this.currentImage = resp.data.path;
            this.toast.success('Created Tag Successfully ');
            this.router.navigate(['/catalog/tags']);
          }
        },
        error: (err) => {
          this.toast.failure(err.error.message);
        }
      });
    }
  }

  removeTag() {
    if (confirm('Are you sure you want to delete this tag?')) {
      if (this.tagUUID) {
        this.tagService.deleteTag(this.tagUUID).subscribe({
          next: (resp) => {
            this.toast.success('Successfully Removed the tag');
            this.router.navigate(['/catalog/tags']);
          }
        });
      }
    }
  }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      let self = this;
      const file = event.target.files[0];
      if (!(file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'))) {
        self.formData.controls['path'].setValue('');
        self.toast.failure('Supports JPG, PNG format only');
        return;
      }
      const filesize = file.size / 1024; // in kb
      let ratio = '';
      var objectUrl = URL.createObjectURL(file);
      let img = new Image();
      img.onload = function () {
        ratio = (Number(img.width) / Number(img.height) + '').slice(0, 3);
        URL.revokeObjectURL(objectUrl);
        if (!self.validateImageBasedOnType(img.width, ratio, false, false, filesize, true)) {
          // check size of image
          self.formData.controls['path'].setValue('');
          self.toast.failure('Image size exceeds 500kb');
          return;
        }
        if (!self.validateImageBasedOnType(img.width, ratio, false, true)) {
          // check ratio
          self.formData.controls['path'].setValue('');
          self.toast.failure('Image ratio mismatch');
          return;
        }
        var mimeType = event.target.files[0].type;
        if (!mimeType.match('image.*')) {
          self.formData.controls['path'].setValue('');
          self.toast.failure('Upload Image only');
        } else {
          self.addfile = file;
        }
      };
      img.src = objectUrl;
    } else {
      this.currentImage = '';
    }
  }

  validateImageBasedOnType(
    imageWidth: any,
    ratio: string,
    checkWidth?: boolean,
    checkRatio?: boolean,
    imageSize?: number,
    checkSize?: boolean
  ) {
    if (checkWidth) {
      return Number(imageWidth) < 1200;
    } else if (checkSize) {
      return Number(imageSize) < 500; // < 500kb
    } else if (checkRatio) {
      return ratio >= '1' || ratio <= '2';
    } else {
      return;
    }
  }
}
