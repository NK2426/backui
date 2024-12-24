import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Bundle } from '../../../models/inventory';
import { BundleService } from '../../../services/bundle.service';

@Component({
  selector: 'app-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule]
})
export class BundlesComponent implements OnInit {

  bundles!: Bundle[];
  purchaseitems!: any;
  comments = '';
  fromstatus = 'Create';
  tostatus = 'Process';
  selectedBrand: any = {}
  status: Array<{ id: string, name: string }> = [{ id: 'Accepted', name: 'Accepted' }, { id: 'Declined', name: 'Declined' }, { id: 'Halt', name: 'Halt' }, { id: 'Reject', name: 'Reject' }];
  actionreason = false;
  scanqrcode = '';
  selectBundle: Bundle = {};
  scanBundle: Bundle = {};
  currentIndex = -1;
  viewCompare = false;

  type = ''
  inwarditemcount = ''

  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(
    private route: ActivatedRoute, private router: Router,
    private bundleservice: BundleService, private toast: ToastService,
    private modalService: NgbModal, private cdr: ChangeDetectorRef,
    private utlis: UtilsService
  ) { }

  ngOnInit(): void {

    this.list();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {

    let type = this.route.snapshot.paramMap.get('type') || '';
    if (type) {
      type = type.toLocaleLowerCase()
      this.type = type[0].toUpperCase() + type.slice(1);
    }
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.bundleservice.getAll(params, type)
      .subscribe({
        next: bundles => {
          this.bundles = bundles.datas || [];
          this.count = bundles.totalItems || 0;
          this.cdr.detectChanges();
        },
        error: () => {
        }
      });
    if (this.type == 'Shipped')
      this.type = 'Download';
    else if (this.type === 'Qc')
      this.type = 'Product Check'
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.list();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.list();
  }
  viewBundle(content: any, bundle: Bundle, index: number): void {
    const modelref = this.modalService.open(content, { size: 'lg' });
    this.currentIndex = index;
    this.selectBundle = bundle;

    modelref.result.then(
      () => { },
      () => {
        this.scanBundle = {};
        this.selectBundle = {};
        this.scanqrcode = '';
        this.viewCompare = false;
      })

  }
  verifyQRcode() {
    let bundleid = this.scanqrcode
    // this.bundleservice.find(this.scanqrcode)
    //   .subscribe({
    //     next: bundle => {
    //       this.scanBundle = bundle || {};
    //       this.viewCompare = true;
    //     },
    //     error: () => {
    //       this.scanBundle = {};
    //       this.viewCompare = true;
    //     }
    //   });
  }

  move(fstatus: string = 'Inward', mstatus: string, bundle: Bundle) {

    if (confirm(`Do you want to continue to move ${fstatus} stage to ${mstatus} stage ?`)) {

      let data = { bundleID: bundle.bundleID, status: mstatus, inwardcount: this.inwarditemcount }
      this.bundleservice.move(data).subscribe({
        next: resp => {
          this.toast.success('Successfully Moved');
          this.viewCompare = false;
          this.ngOnInit()
          this.modalService.dismissAll()
          this.redirectTo('/app/bundles/' + mstatus);
          //this.router.navigateByUrl('/app/bundles/'+mstatus,{skipLocationChange: true});

        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

}
