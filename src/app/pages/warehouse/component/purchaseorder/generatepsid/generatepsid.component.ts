import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { QRCodeModule } from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Inwarditem } from '../../../models/product';
import { Department, Purchaseitem, Purchaseorder, Subcategories } from '../../../models/purchaseorder';
import { BundleService } from '../../../services/bundle.service';
import { PurchaseorderService } from '../../../services/purchaseorder.service';


@Component({
  selector: 'app-generatepsid',
  templateUrl: './generatepsid.component.html',
  styleUrls: ['./generatepsid.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule]

})
export class GeneratepsidComponent implements OnInit {

  @ViewChild('printpsid') printpsid!: ElementRef;

  inwarditems: Inwarditem[] = [];
  poitem: Purchaseitem = {}
  purchaseorder: Purchaseorder = {}
  subcategory: Subcategories = {}
  department: Department = {}

  scanqrcode = '';
  showprint = true;

  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 24;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(
    private route: ActivatedRoute, private router: Router,
    private bundleservice: BundleService, private toast: ToastService,
    private modalService: NgbModal,
    private utlis: UtilsService,
    private poservice: PurchaseorderService
  ) { }
  ngOnInit(): void {
    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.scanqrcode = uuid;

      this.list()
    } else {
      //this.router.navigate(['/app/']);
    }
  }
  list() {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    let uuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.bundleservice.generatepsid(params, uuid)
      .subscribe({
        next: inwrditems => {
          this.inwarditems = inwrditems.datas || []
          this.count = inwrditems.totalItems || 0;
          this.poitem = inwrditems.poorderitems || {}
          this.subcategory = inwrditems.subcategory || {}
          this.department = inwrditems.department || {}
          this.purchaseorder = inwrditems.purchaseorder || {}
        },
        error: () => {
          //this.router.navigate(['/app/']);
        }
      });
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

  printPage() {

    // const doc = new jsPDF()
    // autoTable(doc, { html: '#printpsid', columnStyles: { 3: { cellWidth: 'auto' } } })
    // doc.save('psidgenerate.pdf')

    this.showprint = false;
    setTimeout(() => {
      let DATA: any = document.getElementById('printpsid');
      html2canvas(DATA).then((canvas) => {
        let fileWidth = 203;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/jpeg');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 2;
        PDF.addImage(FILEURI, 'PNG', 3, position, fileWidth, fileHeight);
        let sizecount = this.page === 1 ? 1 : (((this.page - 1) * this.pageSize) + 1)
        PDF.save('psids_from_' + sizecount + '.pdf');
        this.showprint = true;
      });
    }, 100);

  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  slice(x: any) {
    return x.slice(0, 20);
  }


}
