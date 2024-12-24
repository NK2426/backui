import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../../../models/blog';
import { EventService } from '../../../services/events.service';
import { Events } from '../../../models/events';
import { NewsletterService } from '../../../services/newsletter.service';
import { Newsletter } from '../../../models/newsletter';
import { UtilsService } from 'src/app/_helpers/utils.service';

@Component({
  selector: 'app-viewnewsletter',
  templateUrl: './viewnewsletter.component.html',
  styleUrls: ['./viewnewsletter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewnewsletterComponent {
  @Input() data: Newsletter = {};

  formData!: FormGroup;
  warehouses: Newsletter[];

  jobs:any
  submit: boolean = false;
  currentWarehouse: Newsletter = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  breadCrumbItems: Array<{}> = [];

  /// Paginate //////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  edit: boolean = false;
  constructor(
    private warehouseservice: NewsletterService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private utlis: UtilsService,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.warehouseservice.view(id).subscribe({
        next: (data) => {
          this.data = {
            title: data.title,
            content: data.content,    
            link:data.link,
            type:data.type,
            status: data.status,
            image: data.image
          };
          // console.log(data);
          this.ref.detectChanges();
        },
        error: (err) => {
          // console.log('error page');
          this.router.navigate(['/catalog/news']);
        }
      });
    } else {
      console.log('if error');
    }
    this.list()
  }
  back() {
    this.router.navigate(['/catalog/news']);
  }
  handlePageChange(event: number): void {
    this.page = event;
  this.list()
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.list()
  }

  list(){
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
    this.warehouseservice.getAllEmail(params).subscribe({
      next: (warehouses) => {
        this.jobs = warehouses.datas;
        this.count = warehouses.totalItems || 0;
        this.cdr.detectChanges();
        if (warehouses.totalItems) this.count = warehouses.totalItems;
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });
  }
}
