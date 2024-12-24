import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Grn, Grnpaginate } from '../../../models/grn';
import { PurchaseorderService } from '../../../services/purchaseorder.service';


@Component({
  selector: 'app-view-three-way-matching',
  templateUrl: './view-three-way-matching.component.html',
  styleUrls: ['./view-three-way-matching.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewThreeWayMatchingComponent implements OnInit {


  allDetails: Grn[] = [];
  matchingPaginate!: Grnpaginate;
  currentIndex = -1;
  title = 'PO vs Receipt vs Invoice';
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(private purchaseOrderService: PurchaseorderService, private toast: ToastService, private utlis: UtilsService,private cd:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllThreeWayMatching();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.getAllThreeWayMatching();
  }

  getAllThreeWayMatching(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.purchaseOrderService.getThreeWayMatching(params)
      .subscribe({
        next: (details: any) => {
          if (details && details?.datas) {
            this.allDetails = details.datas;
            this.count = details.totalItems || 0;
            if (details.totalItems)
              this.count = details.totalItems;
          }
          this.cd.detectChanges();
        }, error: error => {
          this.toast.failure("Error getting the details.. Please Try again!!");
        }
      })
    
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.getAllThreeWayMatching();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getAllThreeWayMatching();
  }

  numberFormat(num: any) {
    return this.utlis.numberFormat(num);
  }

}
