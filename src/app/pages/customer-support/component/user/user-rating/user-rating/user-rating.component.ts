import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { SortEvent } from 'src/app/helpers/directives/advance-sortable.directive';
import { ToastService } from '../../../../../../_helpers/toast.service';
import { USER } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { SortableDirective } from 'src/app/_helpers/directives/advance-sortable.directive';
import { Product } from 'src/app/pages/category-head/models/product';

@Component({
  selector: 'app-user-rating',
  templateUrl: './user-rating.component.html',
  styleUrls: ['./user-rating.component.scss']
})
export class UserRatingComponent implements OnInit {

  userProductRating?: USER.UserProductRating[];
  userProductRatingPagination!: USER.UserProductRatingPagination;
  currentUserProductRating!: USER.UserProductRating;
  currentIndex = -1;
  product: any = [];

  // Pagination and search config
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  selectedColumn = ''; selectedDirection = '';
  viewAction = false;
  @ViewChildren(SortableDirective) headers!: QueryList<SortableDirective>;

  constructor(private userService: UserService, private modelService: NgbModal, private toast: ToastService) { }

  ngOnInit(): void {
    this.getUserProductRating();
  }

  getRequestParams(search: string, column: string, direction: string, page: number, pageSize: number): any {
    let params = { 'search': '', 'orderby': '', 'order': '', 'page': page, 'size': pageSize };
    if (search)
      params['search'] = search;
    if (column)
      params['orderby'] = column;
    if (direction)
      params['order'] = direction;
    if (page)
      params['page'] = page - 1;
    if (pageSize)
      params['size'] = pageSize;

    return params;
  }


  getUserProductRating(): void {
    const params = this.getRequestParams(this.search, this.selectedColumn, this.selectedDirection, this.page, this.pageSize)
    this.userService.getUserProductRating(params)
      .subscribe({
        next: (userProductRating:any) => {
          this.userProductRating = userProductRating.datas;
          if (userProductRating.totalItems)
            this.count = userProductRating.totalItems;
        }, error: (error:any) => {
          //this.authRedirect.next(error)
        }
      })
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.getUserProductRating();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getUserProductRating();
  }

  setActiveRating(content: any, brand: USER.UserProductRating, index: number): void {
    this.modelService.open(content);
    this.currentIndex = index;
    this.currentUserProductRating = brand;
    this.viewAction = true;
  }

  addRating(content: any): void {
    this.modelService.open(content);
    this.viewAction = false;
    this.currentIndex = -1;
  }

  viewRating(rating: USER.UserProductRating): void {
    this.viewAction = true;
    let epo = Object.assign({}, rating)
    this.currentUserProductRating = epo;
  }

  approve(status: any) {
    let stat = status == 'Approve' ? 1 : -1;
    let formdata = { status: stat, uuid: this.currentUserProductRating.uuid }

    this.userService.approveRating(formdata).subscribe({
      next: resp => {
        if (stat == 1) {
          this.toast.success('Approved Successfully');
        }
        else {
          this.toast.success('Declined Successfully');
        }
        this.getUserProductRating();
        this.modelService.dismissAll()
      }, error: error => {
        //this.authRedirect.next(error)
      }
    })

  }

  getStatus(status: any) {
    if (status == 0)
      return 'Pending';
    else if (status == 1)
      return 'Approved'
    else if (status == -1)
      return 'Rejected'
    else
      return '--'
  }

  onSort({ column, direction }: any) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    if (this.product) {
      this.product = this.sortProduct(this.product, column, direction);
    }
    this.selectedColumn = column;
    this.selectedDirection = direction;
    this.getUserProductRating();
  }
  sortProduct(products: Product[], column: string, direction: string): Product[] {
    if (direction === '' || column === '') {
      return products;
    } else {
      let res: number;
      return [...products].sort((a: any, b: any) => {
        if (column.indexOf('.') != -1) {
          let arrayType = column.split('.');
          if (arrayType.length === 2) {
            // for depth 2 . Need to write condition for depth 3
            res = this.compare(`${a[arrayType[0]][arrayType[1]]}`, `${b[arrayType[0]][arrayType[1]]}`);
          }
        } else {
          res = this.compare(`${a[column]}`, `${b[column]}`);
        }
        return direction === 'asc' ? res : -res;
      });
    }
  }

  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
}
