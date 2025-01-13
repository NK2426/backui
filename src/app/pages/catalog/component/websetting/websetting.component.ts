import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Department } from '../../models/department';
import { Group } from '../../models/inventory';
import { Productimage } from '../../models/product';
import { TAGS } from '../../models/tag';
import { InventoryService } from '../../services/inventory.service';
import { WebteamService } from '../../services/webteam.service';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbHighlight, NgbModal, NgbModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { title } from 'process';

@Component({
  selector: 'app-websetting',
  templateUrl: './websetting.component.html',
  styleUrls: ['./websetting.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule, NgbTypeaheadModule, NgbHighlight]
})
export class WebsettingComponent {
  @Output() refreshList = new EventEmitter<string>();

  position!: number;
  recentlyViewed!: number;
  submit: boolean = false; checkdept: boolean = false;
  currentSelectedType!: string;
  departments: Department[] = [];
  groups: Group[] = [];
  images: Productimage[] = [];
  selectedimages: any[] = [];
  medselectedimages: any[] = [];
  addimage: any = ''
  baseurl: string = ''
  isValidImage!: boolean;
  selectedDept: string = '3'; selectedType: string = ''; selectedLink: string = '';
  linkitems: any[] = []; lastselimg: any = {}
  pageid = 1;
  pageuuid = 'web';
  //banners: Banner[] = [];
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 30, 50, 100];
  type = 'Web';
  currentEditLink = '';

  sectionitemForm: FormGroup;

  sections: any[] = []
  fromressections: any[] = []


  selectsection: any = {};
  types = [
    { 'id': 'Section', 'label': 'Division' },
    { 'id': 'Banner', 'label': 'Banner' },
    { 'id': 'Tag', 'label': 'Tag' },
    // { 'id': 'Blog', 'label': 'Blog' },
    // { 'id': 'Event', 'label': 'Event' },
    { 'id': 'List', 'label': 'List' },
    { 'id': 'Poster', 'label': 'Poster' }
    // { 'id': 'Video', 'label': 'Video' }
  ]
  subtypes = [{ 'id': 'Product', 'label': 'Product' }, { 'id': 'Others', 'label': 'Others' }]
  // types = [ { 'id': 'Banner', 'label': 'Banner' },
  //   //  { 'id': 'Poster', 'label': 'Poster' }
  //   ]

  showcolumns = [{ 'id': 2, 'label': 2 }, { 'id': 3, 'label': 3 }, { 'id': 4, 'label': 4 }]

  status = [{ 'id': 1, 'label': 'Active' }, { 'id': 0, 'label': 'Inactive' }]
  showtitle = [{ 'id': 'Yes', 'label': 'Yes' }, { 'id': 'No', 'label': 'No' }]
  previousIndex!: number;
  currentItemSelectedInSection: any = {}

  model: any;
  searching = false;
  searchFailed = false;
  tag?: TAGS.Tag
  blog: any
  blogs: any
  tags: TAGS.Tag[] = []
  show_type = 'Web'

  isvideo: boolean = false
  event: any;
  events: any = []
  eventres: any = []

  tagsearch: OperatorFunction<string, readonly TAGS.Tag[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.webservice.search(term).pipe(
          map((x: any) => {
            if (x.length > 0) {
              this.searchFailed = false;
              return x;
            } else {
              this.searchFailed = true;
              return ["No Results Found"];
            }
          }),
          tap(() => this.searching = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    );
  formatter = (x: any) => x.name;


  blogsearch: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.webservice.searchblog(term).pipe(
          map((x: any) => {
            if (x.length > 0) {
              this.searchFailed = false;
              return x;
            } else {
              this.searchFailed = true;
              return ["No Results Found"];
            }
          }),
          tap(() => this.searching = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    );
  formatterblog = (x: any) => x.title;

  eventsearch: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.webservice.searchevent(term).pipe(
          map((x: any) => {
            if (x.length > 0) {
              this.searchFailed = false;
              return x;
            } else {
              this.searchFailed = true;
              return ["No Results Found"];
            }
          }),
          tap(() => this.searching = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    );
  formatterevent = (x: any) => x.title;
  tagfalg: boolean = false;


  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private modalService: NgbModal, private invservice: InventoryService, private webservice: WebteamService, private toast: ToastService, private utlis: UtilsService, private route: ActivatedRoute, private router: Router,) { }

  ngOnInit(): void {
    this.sectionitemForm = this.fb.group({
      id: [''],
      page: ['home', [Validators.required]],
      title: [''],
      department_id: [''],
      type: ['', [Validators.required]],
      galleryimgid: [''],
      link: [''],
      path: [''],
      section_id: [''],
      showtitle: [true],
      showoffer: [false],
      mrp: ['0'],
      price: ['0'],
      offer: ['0'],
      position: [0],
      status: [1]
    });
    this.selectedimages = []
    this.baseurl = environment.CATALOG_URL;
    this.invservice.departments()
      .subscribe({
        next: departments => {
          this.departments = departments
          // this.cdr.detectChanges();
        }
      })
    this.sectionlists()
    this.changeDept('3')

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

  }
  blogres: any = {};
  tagsall: any = {};
  tagress: any = [];
  blogress: any = [];
  sectionlists() {
    let uuid = this.route.snapshot.paramMap.get('type');
    if (uuid) {
      if (uuid == 'department') {
        this.type = 'department';
        this.pageid = 2;
        this.pageuuid = uuid
        this.webservice.getPagetags(this.type, uuid).subscribe({
          next: selectedtags => {
            this.tags = selectedtags
            // this.cdr.detectChanges();
          }
        })
        this.webservice.getBlogPage().subscribe({
          next: selectedblogs => {
            this.blogs = selectedblogs
            // this.cdr.detectChanges();
          }
        })
        this.webservice.getallTag().subscribe({
          next: selectedblogs => {
            this.tagsall = selectedblogs
            // this.cdr.detectChanges();
          }
        })
        this.webservice.getallEvent().subscribe({
          next: selectedblogs => {
            this.events = selectedblogs
            // this.cdr.detectChanges();
          }
        })
      } else if (uuid == 'web') {
        this.type = 'web';
        this.pageid = 7;
        this.pageuuid = uuid
        this.webservice.getallTag().subscribe({
          next: selectedtags => {
            this.tags = selectedtags;
            // console.log("tag list page----------->", this.tags)
            // this.cdr.detectChanges();
          }
        })
        this.webservice.getBlogPage().subscribe({
          next: selectedblogs => {
            this.blogs = selectedblogs
            // this.cdr.detectChanges();
          }
        })
        this.webservice.getallEvent().subscribe({
          next: selectedblogs => {
            this.events = selectedblogs
            // this.cdr.detectChanges();
          }
        })
        this.webservice.getallTag().subscribe({
          next: selectedblogs => {
            this.tagsall = selectedblogs
            // this.cdr.detectChanges();
          }
        })
      } else if (uuid == 'category') {
        this.type = 'category';
        this.pageid = 3;
        this.pageuuid = uuid
        this.webservice.getPagetags(this.type, uuid).subscribe({
          next: selectedtags => {
            this.tags = selectedtags
            // this.cdr.detectChanges();
          }
        })
        this.webservice.getBlogPage().subscribe({
          next: selectedblogs => {
            this.blogs = selectedblogs
            // this.cdr.detectChanges();
          }
        })
        this.webservice.getallTag().subscribe({
          next: selectedblogs => {
            this.tagsall = selectedblogs
            // this.cdr.detectChanges();
          }
        })
        this.webservice.getallEvent().subscribe({
          next: selectedblogs => {
            this.events = selectedblogs
            // this.cdr.detectChanges();
          }
        })
      } else {
        // for subcategory
        this.type = 'subcategory';
        this.pageid = 4;
        this.pageuuid = uuid
        this.webservice.getPagetags(this.type, uuid).subscribe({
          next: selectedtags => {
            this.tags = selectedtags
            // this.cdr.detectChanges();
          }
        })
        this.webservice.getBlogPage().subscribe({
          next: selectedblogs => {
            this.blogs = selectedblogs
            // this.cdr.detectChanges();
          }
        })
        this.webservice.getallEvent().subscribe({
          next: selectedblogs => {
            this.events = selectedblogs
            // this.cdr.detectChanges();
          }
        })
      }
      this.webservice.findWebPage(this.type, uuid).subscribe({
        next: selectpage => {

          let sections = selectpage.data || []
          this.fromressections = sections || []
          // console.log('sectioion', this.fromressections);
          this, this.fromressections.forEach(e => {
            if (e.type === 'Video') {
              this.isvideo = true
            }
          })
          // console.log('sectioion', this.isvideo);
          let postion = selectpage.position.split(',')
          this.position = postion[0] || 10;
          this.recentlyViewed = postion[1] || 11;
          // this.cdr.detectChanges();
          this.sections = []
          sections.forEach((val: any) => {
            this.pageid = val.page_id
            if (val)
              this.sections.push({ id: val.id, title: val.title, page_id: val.page_id, type: val.type, subtype: val.subtype, columns: val.columns, showtitle: val.showtitle, sectionitems: val.sectionitems || [], ordering: val.ordering || 0, status: val.status || 0 })
          });

        }
      })
    } else {
      this.router.navigate(['/catalog/']);
    }

  }

  itemSelected($event: any) {
    const tagval = $event.item
    this.tag = tagval

    let tagids = this.tags.map((x: any) => x.id);
    if (tagids.includes(tagval.id) == false) {
      this.tags.push(tagval);
    }

  }
  tagSelected($event: any) {
    const tagval = $event.item
    this.tag = tagval;
    // console.log(this.tags);
    let tagids = this.tags.map((x: any) => x.id);
    // console.log(tagids);

    if (tagids.includes(tagval.id)) {
      this.tagress.push(tagval);
    }
    // console.log(this.tagress);
    this.cdr.detectChanges();
  }

  eventselected(section: any, $event: any) {
    const tagval = $event.item
    this.event = tagval
    let tagids = this.events.map((x: any) => x.id);
    // console.log(tagids);

    if (tagids.includes(tagval.id)) {
      this.eventres.push(tagval);
    }

    // console.log(this.blogress);
    this.cdr.detectChanges();
  }
  blogselected(section: any, $event: any) {

    const tagval = $event.item
    this.blog = tagval
    let tagids = this.blogs.map((x: any) => x.id);
    // console.log(tagids);

    if (tagids.includes(tagval.id)) {
      this.blogress.push(tagval);
    }
    this.cdr.detectChanges()
    // console.log(this.blogress);
    this.cdr.detectChanges();
  }

  clear(i: any) {
    this.tags.splice(i, 1);
  }
  clearblog(i: any) {
    this.blogress.splice(i, 1);
    this.cdr.detectChanges();
  }


  list(dept: any) {
    if (dept) {
      const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
      this.webservice.findimages(params, dept)
        .subscribe({
          next: data => {
            this.images = data.datas;
            // console.log(data.datas);
            this.count = data.totalItems || 0;
            this.cdr.detectChanges();
          }
        });
    }
    else {
      this.images = [];
    }
  }
  changeDept(dept: any) {
    // console.log(dept);
    this.images = [];
    if (dept) {
      let type = this.selectsection.subtype || 'Group';
      this.selectedDept = dept;
      this.changeType(type)
      this.checkdept = true;
      this.list(this.selectedDept);
    }
  }
  canEnableLink() {
    return this.sectionitemForm.get('type')?.getRawValue();
  }

  changeType(type: any) {
    // console.log(this.selectedDept);
    this.sectionitemForm.get('link')?.setValue('')
    this.linkitems = [];
    this.selectedLink = '';
    let typeval = this.sectionitemForm.get('type')?.value;  //this.sectionitemForm.get('type')?.value;
    // console.log('this.selectedDept');
    if (type.target) {
      typeval = type.target.value;
    }
    if (this.selectsection.subtype != 'Product') {
      typeval = this.sectionitemForm.get('type')?.value || 'Group';
      // this.selectedDept = '0';
      this.list('0');
    }
    if (typeval) {
      this.webservice.linkitemlist(typeval, this.selectedDept, this.show_type).subscribe({
        next: data => {
          this.linkitems = data;
          // console.log(this.linkitems)
          if (this.currentEditLink) {
            // logic is handled this way to ensure when ever type is selected 
            // we should bring the link dropdown if its already exist
            this.assignLink(this.currentEditLink);
          }
          this.cdr.detectChanges();
        }
      })
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
    item.setting = 'web'
    this.webservice.savesectionitem(item).subscribe({
      next: resp => {
        this.toast.success('Successfully Added');
        this.modalService.dismissAll();
        this.selectsection = {}
        this.sectionitemForm.reset();
        this.submit = false;
        location.reload()
        // this.cdr.detectChanges();
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    });
    this.cdr.detectChanges();
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
    section.page_id = this.pageid
    section.page_link = this.pageuuid;
    section.page_type = this.type
    this.webservice.savesectionweb(section).subscribe({
      next: resp => {
        this.toast.success('Successfully Added');
        this.sectionlists()
        this.submit = false;
        // this.cdr.detectChanges();
      }, error: err => {
        this.toast.failure('Only one video is allowed');
      }
    });
  }

  addSection() {
    this.sections.push({ title: '', showtitle: 'Yes', type: 'Section', subtype: '', link: '', columns: 2, ordering: 0 })
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
          next: resp => {
            this.toast.success('Successfully Removed');
            this.sections.splice(i, 1);
            // this.cdr.detectChanges();
          }
        })
      } else {
        this.sections.splice(i, 1);
      }
    }
  }

  /*Add item*/
  banner(content: any, i: number): void {
    this.currentEditLink = '';
    let section = this.fromressections[i] || {};
    this.currentSelectedType = section.type;
    this.sectionitemForm.get('link')?.setValue('')
    this.sectionitemForm.get('title')?.setValue('')
    this.sectionitemForm.get('department_id')?.setValue('')
    this.sectionitemForm.get('type')?.setValue('')
    this.sectionitemForm.get('section_id')?.setValue(section.id);
    this.sectionitemForm.get('id')?.setValue('');
    this.sectionitemForm.get('galleryimgid')?.setValue('');
    this.sectionitemForm.get('showtitle')?.setValue(section.showtitle == 'No' ? false : true);
    this.selectedimages = []
    // console.log("dribble =>", this.fromressections)
    if (!section.id) {
      this.toast.failure('First save section and then add items')
    } else {
      this.sectionitemForm.get('position')?.setValue(parseInt(section.sectionitems.length + 1))
      this.selectsection = section;
      const modelref = this.modalService.open(content, { size: 'lg' });

      if (section.subtype === 'Others') {
        this.selectedDept = '0';
        this.changeType('Group')
      } else {
        this.sectionitemForm.get('type')?.setValue('Product')
        this.changeType('Product')
      }
    }
  }


  /*Edit Item*/
  editSelectedItem(event: MouseEvent | any, selectedItemId: number, content: any, itemIndex: number, sectionIndex: number) {
    event.stopPropagation();
    if (confirm('Are you sure you want to edit this section?')) {
      if (selectedItemId) {
        let currentSection = this.fromressections[sectionIndex] || {};
        this.selectsection = currentSection;
        this.currentSelectedType = currentSection.type; // eg : Banner
        let currentItemSelectedInSection = currentSection.sectionitems[itemIndex]
        this.currentItemSelectedInSection = currentItemSelectedInSection
        if (currentItemSelectedInSection) {
          this.selectsection.subtype = currentSection.subtype;
          this.selectedDept = currentItemSelectedInSection.department_id

          this.sectionitemForm.get('link')?.patchValue(currentItemSelectedInSection.link);
          this.currentEditLink = currentItemSelectedInSection.link;
          // console.log(currentItemSelectedInSection)
          this.sectionitemForm.get('title')?.patchValue(currentItemSelectedInSection.title);
          this.sectionitemForm.get('type')?.patchValue(currentItemSelectedInSection.type);
          this.changeType(currentItemSelectedInSection.type);
          this.sectionitemForm.get('position')?.patchValue(currentItemSelectedInSection.position);
          this.sectionitemForm.get('path')?.setValue(currentItemSelectedInSection.path || '');
          this.sectionitemForm.get('id')?.setValue(currentItemSelectedInSection.id);
          this.sectionitemForm.get('department_id')?.setValue(currentItemSelectedInSection.department_id);

          this.selectedimages = []
          this.selectedimages.push({ image_id: currentItemSelectedInSection.galleryimgid + '', path: currentItemSelectedInSection.path || '' });
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
      this.cdr.detectChanges();
    }
  }

  assignLink(link: string) {
    // console.log(link)
    // console.log(this.linkitems)
    if (this.linkitems.length) {
      let linkObj = this.linkitems.find(res => res.slug === link)
      // console.log(linkObj);
      this.selectedLink = linkObj && linkObj.uuid;
      // this.selectedLink = link;
      // console.log('selected Link=============>', this.selectedLink)
    }
    this.cdr.detectChanges();
  }

  onTypeChange(dropDownWholeModel: any) {
    this.currentSelectedType = dropDownWholeModel.id;
    if (dropDownWholeModel.id === 'Tag') {
      this.tagfalg = true
    }
  }



  changeLink() {
    if (this.sectionitemForm.get('type')?.value === 'Product') {
      let finditem = this.linkitems.find(res => res.uuid === this.sectionitemForm.get('link')?.value)

      if (finditem) {
        this.selectedimages = [];
        this.selectedimages.push({ image_id: finditem.image_id + '', path: finditem.path || '' })

        this.sectionitemForm.get('galleryimgid')?.setValue(finditem.image_id || '')
        this.sectionitemForm.get('path')?.setValue(finditem.path || '')
      }
    }
  }

  openGallery(content: any): void {
    const modelref = this.modalService.open(content, { size: 'xl' });
  }

  onSelectedImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.addimage = file
      this.newimage()
    }
  }

  newimage() {
    const formd: any = new FormData();
    formd.append('image', this.addimage);
    let img = new Image()
    img.src = window.URL.createObjectURL(this.addimage)
    img.onload = () => {
      const filesize = this.addimage.size / 1024 / 1024
      const imageWidth = img.width;
      const ratio = ((Number(imageWidth) / Number(img.height)) + '').slice(0, 3)
      // console.log(ratio, (Number(imageWidth) / Number(img.height)));
      //console.log(filesize, imageWidth, ratio)
      if (filesize > 3) {
        this.toast.failure('File not upload.. Please upload below 3 MB file');
        return;
      }
      //  else if (!this.validateImageBasedOnType(imageWidth, ratio, this.currentSelectedType, true, false)) {
      //   this.toast.failure('Please upload the image width greater than expected');
      //   return;
      // }
      // else if (!this.validateImageBasedOnType(imageWidth, ratio, this.currentSelectedType, false, true)) {
      //   this.toast.failure('Image ratio mismatch');
      //   return;
      // }
      else {
        const formd: any = new FormData();
        formd.append('image', this.addimage);
        this.webservice.savebanner(formd, this.selectedDept).subscribe({
          next: resp => {
            this.addimage = '';
            this.images.unshift(resp)
            //resp.select = true;
            this.selectedimages.push(resp)
            this.toast.success('Successfully Updated');
            // this.cdr.detectChanges();
          }, error: err => {
            this.toast.failure(err.error.message);
          }
        });
      }
    }
  }

  validateImageBasedOnType(imageWidth: any, ratio: string, type: string, checkWidth?: boolean, checkRatio?: boolean) {


    if (type.toLowerCase() === 'banner') {// for banner
      if (checkWidth) {
        return Number(imageWidth) > 3000;
      } else if (checkRatio) {
        return ratio === '2';
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

    }
    else if (type.toLowerCase() === 'strip') {// for strip
      ratio = parseInt(ratio) + '';
      if (checkWidth) {
        return Number(imageWidth) > 700;
      } else if (checkRatio) {
        return ratio === '4';
      } else {
        return;
      }
    }
    else if (type.toLowerCase() === 'section') {// for section
      if (checkWidth) {

        return Number(imageWidth) > 300;
      } else if (checkRatio) {
        return ratio === '1';
      } else {
        return;
      }
    } else {// for list
      if (!checkWidth) {
        return Number(imageWidth) < 300;
      } else if (!checkRatio) {
        return ratio === '0.6' || ratio === '1';
      } else {
        return;
      }
    }

  }


  popupclose() {
    this.modalService.dismissAll()
  }

  addImageProcess(src: any, index: number) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  validateImage(idx: number, file: File, selimg: any) {
    this.isValidImage = true;
    // let img = document.createElement('img');
    // img.src = URL.createObjectURL(file);
    this.addImageProcess(file.name, idx).then((img: any) => {
      const filesize = file.size / 1024 / 1024
      const ratio = ((Number(img.width) / Number(img.height)) + '').slice(0, 3)
      ////console.log(ratio)
      // if (!this.validateImageBasedOnType(img.width, ratio, this.currentSelectedType, true, false)) {
      //   this.toast.failure('Image width mismatch');
      //   this.isValidImage = false;
      //   return;
      // }
      // else if (!this.validateImageBasedOnType(img.width, ratio, this.currentSelectedType, false, true)) {
      //   this.toast.failure('Image ratio mismatch');
      //   this.isValidImage = false;
      //   return;
      // } 
      // else {
      //   this.isValidImage = true;
      // }
      this.isValidImage = true;
      this.canProceed(selimg);
    })
  }

  selectimage(i: number) {
    let pageindex = 0;
    if (this.page > 0) {
      pageindex = this.page - 1 * ((this.page > 1) ? this.pageSize : 0) + i;
    }
    if (this.images[i]) {
      let selimg = this.images[i];
      let selImagePath = selimg.path as string;
      let blob = new Blob()
      let type = selImagePath.slice(selImagePath.lastIndexOf('.') + 1)
      if (type === 'jpg') {
        type = 'jpeg';
      }
      const file = new File([blob], selImagePath, {
        type: `image/${type}`,
      });

      this.validateImage(i, file, selimg);
    }
  }

  canProceed(selimg: any) {
    let indexval = this.selectedimages.findIndex(res => res.id === selimg.id)
    if (this.selectedimages.length == 0 && indexval == -1) {
      selimg.select = true;
      this.selectedimages.push(selimg)
      this.lastselimg = selimg;
    }
    else if (this.selectedimages.length > 0 && indexval == -1) { // single select logic
      delete this.lastselimg.select;
      this.selectedimages = [];
      selimg.select = true;
      this.selectedimages.push(selimg)
      this.lastselimg = selimg;
    }

    this.sectionitemForm.get('galleryimgid')?.setValue(this.selectedimages[0]?.id)
    this.sectionitemForm.get('path')?.setValue(this.selectedimages[0]?.path)
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

  cancelAction(): void {
    let type = 'cancel1';
    this.refreshList.emit(type);
  }

  removeimage(id: number) {
    if (confirm('Are you sure you want to delete this banner?')) {


      this.webservice.removeBanner(id).subscribe({
        next: resp => {
          this.toast.success('Successfully removed')
          this.sectionlists()
          // this.cdr.detectChanges();
        }
      });
    }
  }
  removeblog(item: any) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.webservice.removeBlog(item.id).subscribe({
        next: resp => {
          this.toast.success('Successfully removed')
          this.sectionlists()
          // this.cdr.detectChanges();
        }
      });
    }
  }
  savetags() {
    const formtag: any = {};
    formtag.tags = this.tags;
    formtag.type = this.type;
    formtag.position = this.position + ',' + this.recentlyViewed;

    this.webservice.savetags(formtag).subscribe({
      next: resp => {
        this.toast.success('Tags saved successfully');
        // this.cdr.detectChanges();
      }
    })
  }
  blogcontent(content: any, i: number): void {
    this.currentEditLink = '';
    let section = this.fromressections[i] || {};
    this.currentSelectedType = section.type;
    this.sectionitemForm.get('link')?.setValue('')
    this.sectionitemForm.get('title')?.setValue('')
    this.sectionitemForm.get('department_id')?.setValue('')
    this.sectionitemForm.get('type')?.setValue('')
    this.sectionitemForm.get('section_id')?.setValue(i);
    this.sectionitemForm.get('id')?.setValue('');
    this.sectionitemForm.get('galleryimgid')?.setValue('');
    this.sectionitemForm.get('showtitle')?.setValue(section.showtitle == 'No' ? false : true);
    this.selectedimages = []
    // console.log("dribble =>", this.fromressections)

    this.sectionitemForm.get('position')?.setValue(parseInt(section.sectionitems.length + 1))
    this.selectsection = section;
    const modelref = this.modalService.open(content, { size: 'lg' });

  }
  eventcontent(content: any, i: number): void {
    this.currentEditLink = '';
    let section = this.fromressections[i] || {};
    this.currentSelectedType = section.type;
    this.sectionitemForm.get('link')?.setValue('')
    this.sectionitemForm.get('title')?.setValue('')
    this.sectionitemForm.get('department_id')?.setValue('')
    this.sectionitemForm.get('type')?.setValue('')
    this.sectionitemForm.get('section_id')?.setValue(i);
    this.sectionitemForm.get('id')?.setValue('');
    this.sectionitemForm.get('galleryimgid')?.setValue('');
    this.sectionitemForm.get('showtitle')?.setValue(section.showtitle == 'No' ? false : true);
    this.selectedimages = []
    // console.log("dribble =>", this.fromressections)

    this.sectionitemForm.get('position')?.setValue(parseInt(section.sectionitems.length + 1))
    this.selectsection = section;
    const modelref = this.modalService.open(content, { size: 'lg' });

  }
  tagcontent(content: any, i: number): void {
    this.currentEditLink = '';
    let section = this.fromressections[i] || {};
    this.currentSelectedType = section.type;
    this.sectionitemForm.get('link')?.setValue('')
    this.sectionitemForm.get('title')?.setValue('')
    this.sectionitemForm.get('department_id')?.setValue('')
    this.sectionitemForm.get('type')?.setValue('')
    this.sectionitemForm.get('section_id')?.setValue(i);
    this.sectionitemForm.get('id')?.setValue('');
    this.sectionitemForm.get('galleryimgid')?.setValue('');
    this.sectionitemForm.get('showtitle')?.setValue(section.showtitle == 'No' ? false : true);
    this.selectedimages = []
    // console.log("dribble =>", this.fromressections)

    this.sectionitemForm.get('position')?.setValue(parseInt(section.sectionitems.length + 1))
    this.selectsection = section;
    const modelref = this.modalService.open(content, { size: 'lg' });

  }

  saveblogs() {
    this.submit = true;
    const formtag: any = {};
    // console.log(this.fromressections[this.sectionitemForm.get('section_id').value]);
    let blogs: any = [];
    // console.log(this.blogress)
    this.blogress.forEach((e: any) => {
      blogs.push(e.id)
    });

    formtag.blogs = blogs;
    formtag.type = this.fromressections[this.sectionitemForm.get('section_id').value].type || 'Group';
    formtag.position = this.sectionitemForm.get('position').value
    formtag.title = this.fromressections[this.sectionitemForm.get('section_id').value].title
    formtag.showtitle = formtag.showtitle === true ? 1 : 0;
    formtag.section_id = this.fromressections[this.sectionitemForm.get('section_id').value].id
    formtag.setting = 'web'
    this.webservice.savesectionitemBlog(formtag).subscribe({
      next: resp => {
        this.toast.success('Successfully Added');
        this.modalService.dismissAll();
        this.selectsection = {}
        this.sectionitemForm.reset();
        this.submit = false;
        location.reload()
        // this.cdr.detectChanges();
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    });
  }
  savetag() {
    this.submit = true;
    const formtag: any = {};
    let blogs: any = [];
    this.tagress.forEach((e: any) => {
      blogs.push(e.id)
    })

    formtag.blogs = blogs;
    formtag.type = this.fromressections[this.sectionitemForm.get('section_id').value].type || 'Group';
    formtag.position = this.sectionitemForm.get('position').value
    formtag.title = this.fromressections[this.sectionitemForm.get('section_id').value].title
    formtag.showtitle = formtag.showtitle === true ? 1 : 0;
    formtag.section_id = this.fromressections[this.sectionitemForm.get('section_id').value].id
    formtag.setting = 'web'
    this.webservice.savesectionitemtag(formtag).subscribe({
      next: resp => {
        this.toast.success('Successfully Added');
        this.modalService.dismissAll();
        this.selectsection = {}
        this.sectionitemForm.reset();
        this.submit = false;
        location.reload()
        // this.cdr.detectChanges();
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    });
  }
  saveEvent() {
    this.submit = true;
    const formtag: any = {};
    let blogs: any = [];
    debugger
    this.eventres.forEach((e: any) => {

      blogs.push(e.id)
    })


    formtag.blogs = blogs;
    formtag.type = this.fromressections[this.sectionitemForm.get('section_id').value].type || 'Group';
    formtag.position = this.sectionitemForm.get('position').value
    formtag.title = this.fromressections[this.sectionitemForm.get('section_id').value].title
    formtag.showtitle = formtag.showtitle === true ? 1 : 0;
    formtag.section_id = this.fromressections[this.sectionitemForm.get('section_id').value].id
    formtag.setting = 'web'
    this.webservice.savesectionitemevent(formtag).subscribe({
      next: resp => {
        this.toast.success('Successfully Added');
        this.modalService.dismissAll();
        this.selectsection = {}
        this.sectionitemForm.reset();
        this.submit = false;
        location.reload()
        // this.cdr.detectChanges();
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    });
  }
}
