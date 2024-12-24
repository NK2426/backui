import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Subcategories } from '../../../models/subcategories';

import { SubcategoriesService } from '../../../services/subcategories.service';
import { CategoriesService } from '../../../services/categories.service';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


import { Department } from '../../../models/department';
import { Group } from '../../../models/inventory';
import { Productimage } from '../../../models/product';
import { InventoryService } from '../../../services/inventory.service';
import { WebteamService } from '../../../services/webteam.service';

import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TAGS } from '../../../models/tag';
import { Categories } from '../../../models/categories';

@Component({
  selector: 'app-viewcategory',
  templateUrl: './viewcategory.component.html',
  styleUrls: ['./viewcategory.component.scss'],
  // imports: [CommonModule,
  //   ReactiveFormsModule,
  //   FormsModule,
  //   NgbModule,
  //   NgSelectModule, RouterModule, NgbPaginationModule]
})
export class ViewcategoryComponent implements OnInit {
  formData!: FormGroup;
  selectedCategory: Categories = {};
  assignedparams: any = [];
  deleteaction = false;
  submit: boolean = false;
  show: boolean = false;
  statuses: Array<{ id: string; name: string }> = [];
  addfile: string = '';
  baseurl: string = '';
  fileName: any = '';
  currentItemSelectedInSection: any = {};
  currentEditLink = '';

  sectionitemForm: FormGroup;

  sections: any[] = [];
  fromressections: any[] = [];

  selectsection: any = {};
  types = [
    { id: 'Section', label: 'Section' },
    { id: 'List', label: 'List' },
    { id: 'Banner', label: 'Banner' },
    { id: 'Strip', label: 'Strip' },
    { id: 'Poster', label: 'Poster' }
  ];
  subtypes = [
    { id: 'Product', label: 'Product' },
    { id: 'Others', label: 'Others' }
  ];
  showcolumns = [
    { id: 2, label: 2 },
    { id: 3, label: 3 },
    { id: 4, label: 4 }
  ];
  status = [
    { id: 1, label: 'Active' },
    { id: 0, label: 'Inactive' }
  ];
  showtitle = [
    { id: 'Yes', label: 'Yes' },
    { id: 'No', label: 'No' }
  ];

  checkdept: boolean = false;
  departments: Department[] = [];
  groups: Group[] = [];
  images: Productimage[] = [];
  selectedimages: any[] = [];
  medselectedimages: any[] = [];
  addimage: any = '';
  selectedDept: any = '';
  selectedType: string = '';
  selectedLink: string = '';
  linkitems: any[] = [];
  lastselimg: any = {};
  pageid = 0;
  pageuuid = '';
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 30, 50, 100];
  type = 'Category';
  currentSelectedType!: string;
  isValidImage!: boolean;

  model: any;
  searching = false;
  searchFailed = false;
  tag?: TAGS.Tag;
  tags: TAGS.Tag[] = [];

  topleveltag?: TAGS.Tag;
  topleveltags: TAGS.Tag[] = [];

  tagsearch: OperatorFunction<string, readonly TAGS.Tag[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.webservice.search(term).pipe(
          map((x: any) => {
            if (x.length > 0) {
              this.searchFailed = false;
              return x;
            } else {
              this.searchFailed = true;
              return ['No Results Found'];
            }
          }),
          tap(() => (this.searching = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );
  formatter = (x: any) => x.name;

  constructor(
    private fb: FormBuilder, private cdr: ChangeDetectorRef,
    // private subcategoriesService: CategoriesService,
    private modalService: NgbModal,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private webservice: WebteamService,
    private utlis: UtilsService,
    private invservice: InventoryService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.sectionitemForm = this.fb.group({
      id: [''],
      page: ['Subcategory', [Validators.required]],
      title: ['', [Validators.required]],
      department_id: [''],
      type: ['', [Validators.required]],
      galleryimgid: [''],
      link: [''],
      path: [''],
      showtitle: [true],
      showoffer: [false],
      mrp: ['0'],
      price: ['0'],
      offer: ['0'],
      position: [0],
      status: [1]
    });
    this.baseurl = environment.CATALOG_URL;
    this.formData = this.formBuilder.group({});
    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.pageuuid = uuid;
      this.categoriesService.find(uuid).subscribe({
        next: (resp) => {
          this.selectedCategory = resp;
          // console.log(this.selectedCategory);
          // this.cdr.detectChanges();
          this.selectedDept = resp.department_id as any;
          this.fileName = this.selectedCategory.image;
          this.tags = this.selectedCategory.tags || [];
          this.topleveltags = this.selectedCategory.topleveltags || [];
          this.formData = this.formBuilder.group({
            name: [this.selectedCategory.name, [Validators.required, Validators.minLength(3)]],
            description: [this.selectedCategory.description],
            position: [this.selectedCategory.position, [Validators.required, Validators.minLength(1), Validators.min(0)]],
            imgpath: ['', this.fileName == '' ? [Validators.required] : ''],
            status: [this.selectedCategory.status, [Validators.required]],
            name_ta: [this.selectedCategory.name_ta],
            slug: [this.selectedCategory.slug, [Validators.required]]
          });
        },
        error: (err) => {
          //console.log(err);
        }
      });
      this.invservice.departments().subscribe({
        next: (departments) => {
          this.departments = departments;
        }
      });

      this.sectionlists();
      // below validation added to dynamically set required field validation on link dropdown based on type 
      this.sectionitemForm.get('type')?.valueChanges
        .subscribe(value => {
          if (value !== 'NoLink' && value !== '') {
            this.sectionitemForm.get('link')?.setValidators(Validators.required)
          } else {
            this.sectionitemForm.get('link')?.clearValidators();
          }
        }
        );
      // this.webservice.groups()
      //   .subscribe({
      //     next: groups => {
      //       this.groups = groups
      //       this.sectionlists()
      //     }
      //   })
    }
    this.statuses = [
      { id: '1', name: 'Active' },
      { id: '0', name: 'Inactive' }
    ];
  }

  itemSelected($event: any) {
    const tagval = $event.item;
    this.tag = tagval;

    let tagids = this.tags.map((x: any) => x.id);
    if (tagids.includes(tagval.id) == false) {
      this.tags.push(tagval);
    }
  }

  clear(i: any) {
    this.tags.splice(i, 1);
  }

  itemSelectedtoplevel($event: any) {
    const tagval = $event.item;
    this.topleveltag = tagval;

    let tagids = this.topleveltags.map((x: any) => x.id);
    if (tagids.includes(tagval.id) == false) {
      this.topleveltags.push(tagval);
    }
  }

  cleartoplevel(i: any) {
    this.topleveltags.splice(i, 1);
  }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      let self = this;
      const file = event.target.files[0];
      if (!(file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'))) {
        self.formData.controls['imgpath'].setValue('');
        self.toast.failure('Supports JPG, PNG format only');
        return;
      }
      const filesize = file.size / 1024; // in kb
      let ratio = '';
      var objectUrl = URL.createObjectURL(file);
      let img = new Image();
      img.onload = function () {
        ratio = (Number(img.width) / Number(img.height) + '').slice(0, 3);
        // console.log(ratio, Number(img.width), Number(img.height));

        URL.revokeObjectURL(objectUrl);
        if (!self.validateImageBasedOnType(img.width, ratio, 'choosetype', false, false, filesize, true)) {
          // check size of image
          self.formData.controls['imgpath'].setValue('');
          self.toast.failure('Image size exceeds 500kb');
          return;
        }
        if (!self.validateImageBasedOnType(img.width, ratio, 'choosetype', false, true)) {
          // check ratio
          self.formData.controls['imgpath'].setValue('');
          self.toast.failure('Image ratio mismatch');
          return;
        }
        var mimeType = event.target.files[0].type;
        if (!mimeType.match('image.*')) {
          self.formData.controls['imgpath'].setValue('');
          self.toast.failure('Upload Image only');
        } else {
          self.addfile = file;
        }
      };
      img.src = objectUrl;
    }
  }

  editdept() {
    this.show = true;
  }
  get cform() {
    return this.formData.controls;
  }

  saveDept() {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    this.savecategory();
  }
  errorFlag: boolean = false
  savecategory() {
    const formd: any = new FormData();
    formd.append('imgpath', this.addfile);
    formd.append('name', this.formData.value.name);
    formd.append('description', this.formData.value.description);
    formd.append('name_ta', this.formData.value.name_ta);
    formd.append('status', this.formData.value.status);
    formd.append('cid', this.selectedCategory.cid)
    formd.append('slug', this.formData.value.slug)
    // console.log(formd, this.formData.get('status').value);

    this.formData.get('status').value
    formd.append('position', this.formData.value.position);
    formd.append(
      'tags',
      this.tags.map((tag) => {
        return tag.id;
      })
    );
    formd.append(
      'topleveltags',
      this.topleveltags.map((tag) => {
        return tag.id;
      })
    );
    //console.log(this.topleveltags);
    var msg = 'Created';
    // if (this.categoriesService.id) {
    //   formd.append('cid', this.categoriesService.id);
    //   msg = 'Updated';
    // }
    this.categoriesService.updateimg(formd).subscribe({
      next: (resp) => {
        this.addfile = '';
        this.submit = false;
        this.show = false;
        this.fileName = resp.imgpath;
        this.selectedCategory = resp;
        this.toast.success('Category Successfully ' + msg);
        // location.reload();
        // this.cdr.detectChanges();
      },
      error: (err) => {

        this.toast.failure("Something went Wrong");
      }
    });
  }

  cancel() {
    this.show = false;
  }

  sectionlists() {
    let uuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.webservice.findPage(this.type, uuid).subscribe({
      next: (sections) => {
        this.fromressections = sections || [];
        this.sections = [];
        // this.cdr.detectChanges();
        sections.forEach((val: any) => {
          this.pageid = val.page_id;
          if (val)
            this.sections.push({
              id: val.id,
              title: val.title,
              page_id: val.page_id,
              type: val.type,
              subtype: val.subtype,
              columns: val.columns,
              showtitle: val.showtitle,
              sectionitems: val.sectionitems || [],
              ordering: val.ordering || 0,
              status: val.status || 0,

            });
        });
      }
    });
  }

  list(dept: any) {
    if (dept) {
      const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
      this.webservice.findimages(params, dept).subscribe({
        next: (data) => {
          this.images = data.datas;
          this.count = data.totalItems;
        }
      });
    } else {
      this.images = [];
    }
  }
  changeDept(dept: any) {
    this.images = [];
    if (dept) {
      let type = this.selectsection.subtype || 'Group';
      this.selectedDept = dept.did;
      this.changeType(type);
      this.checkdept = true;
      this.list(this.selectedDept);
    }
  }

  canEnableLink() {
    return this.sectionitemForm.get('type')?.getRawValue();
  }

  changeType(type?: any) {
    this.sectionitemForm.get('link')?.setValue('');
    this.linkitems = [];
    this.selectedLink = '';
    let typeval = this.sectionitemForm.get('type')?.value; //this.sectionitemForm.get('type')?.value;
    this.selectedDept = this.selectedCategory.department_id
    this.sectionitemForm.get('department_id')?.setValue(this.selectedDept);

    if (type && type.target) {
      typeval = type.target.value;
    }
    if (this.selectsection.subtype != 'Product') {
      typeval = this.sectionitemForm.get('type')?.value || 'Group';
      this.selectedDept = '0';
      this.list('0');
    }
    else {
      this.list(this.selectedDept)
    }
    if (typeval) {
      this.webservice.linkitemlist1(typeval, this.selectedDept).subscribe({
        next: (data) => {
          this.linkitems = data;
          if (this.currentEditLink) {
            // logic is handled this way to ensure when ever type is selected
            // we should bring the link dropdown if its already exist
            this.assignLink(this.currentEditLink);
          }
          // this.cdr.detectChanges();
        }
      });
    }
  }


  assignLink(link: string) {
    if (this.linkitems.length) {
      let linkObj = this.linkitems.find((res) => res.uuid === link);
      this.selectedLink = linkObj && linkObj.uuid;
    }
  }

  get form() {
    return this.sectionitemForm.controls;
  }

  saveSectionitem() {
    this.submit = true;
    if (this.sectionitemForm.invalid) {
      this.toast.failure('Please enter all input value');
      return;
    }
    if (this.sectionitemForm.value.path == '') {
      this.toast.failure('Please add the image');
      return;
    }
    let item = Object.assign({}, this.sectionitemForm.value);
    item.section_id = this.selectsection.id;
    item.type = this.sectionitemForm.get('type')?.value || 'Group';
    item.showtitle = item.showtitle === true ? 1 : 0;
    item.path = item.path;

    this.webservice.savesectionitem(item).subscribe({
      next: (resp) => {
        this.toast.success('Successfully Added');
        this.modalService.dismissAll();
        this.selectsection = {};
        this.sectionitemForm.reset();
        this.submit = false;
        location.reload();
      },
      error: (err) => {
        this.toast.failure(err.error.message);
      }
    });
  }

  saveSection(section: any) {
    this.submit = true;
    this.linkitems = [];
    if (section.title === '') {
      this.toast.failure('Please enter the title');
      return;
    } else if (!section.subtype || section.subtype === '') {
      this.toast.failure('Please select subtype');
      return;
    }
    if (section.sectionitems && section.sectionitems.length && this.currentSelectedType && section.type !== this.currentSelectedType) {
      this.toast.failure(`Items already added are of ${section.type}. Please remove the item and change the type`);
      section.type = this.currentSelectedType;
      return;
    } else {
      section.type = this.currentSelectedType || section.type;
    }
    section.page_id = this.pageid;
    section.page_link = this.pageuuid;
    section.page_type = this.type;
    this.webservice.savesection(section).subscribe({
      next: (resp) => {
        this.toast.success('Successfully Added');
        this.sectionlists();
        this.submit = false;
      },
      error: (err) => {
        this.toast.failure(err.error.message);
      }
    });
  }

  addSection() {
    this.sections.push({ title: '', showtitle: 'Yes', type: 'Section', link: '', columns: 2 });
  }
  moredatafield(id = '', title = '', link = '', type = '') {
    // this.moredetaildata().push(
    //   this.fb.group(
    //     {
    //       id: [id],
    //       title: [title],
    //       type: [type],
    //       link: [link],
    //     })
    // )
  }

  removeSection(i: number, section: any) {
    if (confirm('Are you sure you want to delete this section?')) {
      if (section.id) {
        this.webservice.removeSection(section.id).subscribe({
          next: (resp) => {
            this.toast.success('Successfully Removed');
            this.sections.splice(i, 1);
          }
        });
      } else {
        this.sections.splice(i, 1);
      }
    }
  }

  banner(content: any, i: number): void {
    //this.changeType();
    let section = this.fromressections[i] || {};
    this.currentSelectedType = section.type;
    //this.currentItemSelectedInSection = section;
    this.sectionitemForm.get('link')?.setValue('');
    this.sectionitemForm.get('title')?.setValue('');
    this.sectionitemForm.get('department_id')?.setValue('');
    this.sectionitemForm.get('type')?.setValue('');
    this.sectionitemForm.get('section_id')?.setValue(section.id);
    this.sectionitemForm.get('id')?.setValue('');
    this.sectionitemForm.get('galleryimgid')?.setValue('');
    this.sectionitemForm.get('showtitle')?.setValue(section.showtitle == 'No' ? false : true);
    this.selectedimages = []
    this.currentEditLink = '';
    //console.log(this.sectionitemForm)
    if (!section.id) {
      this.toast.failure('First save section and then add items');
    } else {
      this.sectionitemForm.get('position')?.setValue(parseInt(section.sectionitems.length + 1));
      this.selectsection = section;
      const modelref = this.modalService.open(content, { size: 'lg' });

      if (section.subtype === 'Others') {
        this.selectedDept = '0';
        this.changeType('Group')
      } else {
        this.sectionitemForm.get('type')?.setValue('Product');
        this.changeType('Product')
      }
    }
  }

  changeLink() {
    if (this.sectionitemForm.get('type')?.value === 'Product') {
      let finditem = this.linkitems.find((res) => res.uuid === this.sectionitemForm.get('link')?.value);

      //console.log(finditem);
      if (finditem) {
        this.selectedimages.push({ image_id: finditem.image_id + '', path: finditem.path || '' });

        this.sectionitemForm.get('galleryimgid')?.setValue(finditem.image_id || '');
        this.sectionitemForm.get('path')?.setValue(finditem.path || '');
      }
    }
  }

  openGallery(content: any): void {
    const modelref = this.modalService.open(content, { size: 'xl' });
  }

  onSelectedImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.addimage = file;
      this.newimage();
    }
  }

  newimage() {
    const formd: any = new FormData();
    formd.append('image', this.addimage);
    let img = new Image();
    img.src = window.URL.createObjectURL(this.addimage);
    img.onload = () => {
      const filesize = this.addimage.size / 1024 / 1024;
      const ratio = (Number(img.width) / Number(img.height) + '').slice(0, 3);
      if (filesize > 3) {
        this.toast.failure('File not upload.. Please upload below 3 MB file');
        return;
      } else {
        const formd: any = new FormData();
        formd.append('image', this.addimage);
        this.webservice.savebanner(formd, this.selectedDept).subscribe({
          next: (resp) => {
            this.addimage = '';
            this.images.unshift(resp);
            //resp.select = true;
            this.selectedimages.push(resp);
            this.toast.success('Successfully Updated');
          },
          error: (err) => {
            this.toast.failure(err.error.message);
          }
        });
      }
    };
  }

  popupclose() {
    this.modalService.dismissAll();
  }

  addImageProcess(src: any, index: number) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  validateImage(idx: number, file: File, selimg: any) {
    this.isValidImage = true;
    // let img = document.createElement('img');
    // img.src = URL.createObjectURL(file);
    this.addImageProcess(file.name, idx).then((img: any) => {
      const filesize = file.size / 1024 / 1024;
      const ratio = (Number(img.width) / Number(img.height) + '').slice(0, 3);
      // console.log(ratio, Number(img.width), Number(img.height));
      if (!this.validateImageBasedOnType(img.width, ratio, this.currentSelectedType, true, false)) {
        this.toast.failure('Image width mismatch');
        this.isValidImage = false;
        return;
      } else if (!this.validateImageBasedOnType(img.width, ratio, this.currentSelectedType, false, true)) {
        this.toast.failure('Image ratio mismatch');
        this.isValidImage = false;
        return;
      } else {
        this.isValidImage = true;
      }
      this.canProceed(selimg);
    });
  }

  validateImageBasedOnType(
    imageWidth: any,
    ratio: string,
    type: string,
    checkWidth?: boolean,
    checkRatio?: boolean,
    imageSize?: number,
    checkSize?: boolean
  ) {
    if (type.toLowerCase() === 'banner') {
      // for banner
      if (checkWidth) {
        return Number(imageWidth) > 1000;
      } else if (checkRatio) {
        return ratio === '1.5';
      } else {
        return;
      }
    } else if (type.toLowerCase() === 'poster') {// for poster
      if (checkWidth) {
        return Number(imageWidth) > 1000;
      } else if (checkRatio) {
        return ratio === '1';
      } else {
        return;
      }

    } else if (type.toLowerCase() === 'strip') {// for strip
      ratio = parseInt(ratio) + '';
      if (checkWidth) {
        return Number(imageWidth) > 700;
      } else if (checkRatio) {
        return ratio === '4';
      } else {
        return;
      }
    } else if (type.toLowerCase() === 'section') {
      // for section
      if (checkWidth) {
        return Number(imageWidth) > 300;
      } else if (checkRatio) {
        return ratio === '1';
      } else {
        return;
      }
    } else if (type.toLowerCase() === 'choosetype') {
      // for section
      if (checkSize) {
        return Number(imageSize) < 500; // < 500kb
      } else if (checkRatio) {
        return ratio === '1';
      } else {
        return;
      }
    } else {
      // for list
      if (checkWidth) {
        return Number(imageWidth) < 800;
      } else if (checkRatio) {
        return ratio === '0.6';
      } else {
        return;
      }
    }
  }

  selectimage(i: number) {
    let pageindex = 0;
    if (this.page > 0) {
      pageindex = this.page - 1 * (this.page > 1 ? this.pageSize : 0) + i;
    }
    if (this.images[i]) {
      let selimg = this.images[i];
      let selImagePath = selimg.path as string;
      let blob = new Blob();
      let type = selImagePath.slice(selImagePath.lastIndexOf('.') + 1);
      if (type === 'jpg') {
        type = 'jpeg';
      }
      const file = new File([blob], selImagePath, {
        type: `image/${type}`
      });
      this.validateImage(i, file, selimg);
    }
  }

  canProceed(selimg: any) {
    let indexval = this.selectedimages.findIndex((res) => res.id === selimg.id);

    if (this.selectedimages.length == 0 && indexval == -1) {
      selimg.select = true;
      this.selectedimages.push(selimg);
      this.lastselimg = selimg;
    } else if (this.selectedimages.length > 0 && indexval == -1) {
      delete this.lastselimg.select;
      this.selectedimages = [];
      selimg.select = true;
      this.selectedimages.push(selimg);
      this.lastselimg = selimg;
    }

    this.sectionitemForm.get('galleryimgid')?.setValue(this.selectedimages[0]?.id);
    this.sectionitemForm.get('path')?.setValue(this.selectedimages[0]?.path);
    //this.sectionitemForm.value.galleryimgid = this.selectedimages[0]?.id;
    //this.sectionitemForm.value.path = this.selectedimages[0]?.path;
  }

  onTypeChange(dropDownWholeModel: any) {
    this.currentSelectedType = dropDownWholeModel.id;
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.list(this.selectedDept);
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.list(this.selectedDept);
  }

  /*Edit Item*/
  editSelectedItem(event: MouseEvent | any, selectedItemId: number, content: any, itemIndex: number, sectionIndex: number) {
    event.stopPropagation();
    if (confirm('Are you sure you want to edit this section?')) {
      //console.log(this.linkitems)
      if (selectedItemId) {
        let currentSection = this.fromressections[sectionIndex] || {};
        this.selectsection = currentSection;
        this.currentSelectedType = currentSection.type; // eg : Banner
        let currentItemSelectedInSection = currentSection.sectionitems[itemIndex];
        this.currentItemSelectedInSection = currentItemSelectedInSection;
        if (currentItemSelectedInSection) {
          this.selectsection.subtype = currentSection.subtype;

          this.sectionitemForm.get('link')?.patchValue(currentItemSelectedInSection.link);
          this.currentEditLink = currentItemSelectedInSection.link;
          this.sectionitemForm.get('title')?.patchValue(currentItemSelectedInSection.title);
          this.sectionitemForm.get('type')?.patchValue(currentItemSelectedInSection.type);
          this.changeType(currentItemSelectedInSection.type);
          this.sectionitemForm.get('position')?.patchValue(currentItemSelectedInSection.position);
          this.sectionitemForm.get('path')?.setValue(currentItemSelectedInSection.path || '');
          this.sectionitemForm.get('id')?.setValue(currentItemSelectedInSection.id);
          this.sectionitemForm.get('section_id')?.setValue(currentItemSelectedInSection.section_id);
          this.selectedimages = []
          this.selectedimages.push({ image_id: currentItemSelectedInSection.galleryimgid + '', path: currentItemSelectedInSection.path || '' });
          //console.log(this.selectedimages)

          ////console.log(this.sectionitemForm)
          /*  setTimeout(() => {
             this.assignLink(currentSection.sectionitems[itemIndex].link);
           }, 500) */
        }

        const modelref = this.modalService.open(content, { size: 'lg' });
        /* this.webservice.editsectionitem({}, selectedItemId).subscribe({
          next: resp => {
            this.toast.success('Updated Successfully');
          }
        }) */
      } else {
      }
    }
  }

  cancelAction(): void {
    let type = 'cancel1';
    //this.refreshList.emit(type);
  }

  removeimage(id: number) {
    if (confirm('Are you sure you want to delete this banner?')) {
      this.webservice.removeBanner(id).subscribe({
        next: (resp) => {
          this.toast.success('Successfully removed');
          this.sectionlists();
        }
      });

      // if (this.banners[i]) {
      //   let selban = this.banners[i];

      //   let indexval = this.banners.findIndex(res => res.id === selban.id)
      //   if (indexval >= 0) {
      //     this.banners.splice(indexval, 1)

      //   }
      // }
    }
  }

}
