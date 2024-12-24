import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Grn, Grnitem } from '../../models/grn';
import { Bundle } from '../../models/inventory';
import { Inwarditem } from '../../models/product';
import { Productvariants } from '../../models/productvariants';
import { Purchaseorder } from '../../models/purchaseorder';
import { BundleService } from '../../services/bundle.service';
import { PurchaseorderService } from '../../services/purchaseorder.service';

import { ToastService } from 'src/app/_helpers/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule]
})
export class GrnComponent implements OnInit {
  bundles: Bundle[] = [];
  purchaseorder?: Purchaseorder;
  currentBundle: Bundle = {};
  currentIndex = -1;
  currentInitem?: Inwarditem[] = [];
  currentdIndex = -1;
  bundleitemscount = 0; bundleinwardcount = 0;
  poTotalQty: number = 0;
  invoiceqty: number = 0;
  receivedTotalQty: number = 0;
  damagedTotalQty: number = 0;
  variants: Productvariants[] = [];
  mappedvaiants: any = {}
  disputes: any = [];
  qcreport: any = {}
  disputeitems: any = [];
  grn: Grn = {};
  showprint = true;
  poid = '';
  grnitems: Grnitem[] = [];
  constructor(private bundleservice: BundleService, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private poservice: PurchaseorderService, private modelservice: NgbModal, private toast: ToastService, private router: Router) { }

  ngOnInit(): void {
    let grnid: any = this.route.snapshot.paramMap.get('id')
    this.poservice.grnitemdetail(grnid).subscribe({
      next: resp => {
        this.grn = resp || [];
        this.poid = this.grn.grnid?.split('-')[0] || '';
       
        this.grnitems = this.grn?.grnitems || [];//?.filter(x => x.tatkalpo_id == 0) 
        
        let variantdata: Productvariants[] = [];
        this.grn?.grnitems?.forEach((orderitem: any, index: number) => {

          if (orderitem) {
            this.invoiceqty += orderitem.receivedqty;
            this.poTotalQty += orderitem.quantity;
            this.damagedTotalQty += orderitem.disputeqty;
            this.receivedTotalQty += orderitem.inwarditemcount;
            //this.qcreport[index] = { damage: damaged.length, inventory: received.length }
          }
        });
        //Sync GRN with grnitems inwarditemcount & disputeqty update
        this.poservice.grnSync(grnid).subscribe({})
        // this.bundleservice.viewGrn(resp.id).subscribe({
        //   next: resp => {
        //     this.grn = resp;
        //   },
        //   error: () => {
        //   }
        // })

      },
      error: () => {
      }
    })

    // this.bundleservice.getbundles(poid).subscribe({
    //   next: resp => {
    //     this.bundles = resp || [];
    //     //console.log(resp);
    //     this.bundleitemscount = this.bundles.reduce(function (sum: any, current: any) {
    //       return sum + parseInt(current.itemscount);
    //     }, 0)
    //     this.bundleinwardcount = this.bundles.reduce(function (sum: any, current: any) {
    //       return sum + parseInt(current.inwardcount);
    //     }, 0)
    //   },
    //   error: () => {
    //   }
    // })
  }

  setActiveGrn(content: any, bundle: Bundle, index: number): void {
    const modelref = this.modelservice.open(content, { size: 'md' });
    this.currentIndex = index;
    this.currentBundle = bundle;
  }

  setDamagedGrn(dcontent: any, poitem: any, index: number): void {
    const modelref = this.modelservice.open(dcontent, { size: 'md' });
    this.currentdIndex = index;
   
    this.poservice.getdisputeitems({ poid: poitem }).subscribe({
      next: resp => {
        this.disputeitems = resp;
      },
      error: () => {
      }
    })
  }

  closegrn() {
    if (confirm('Are you sure you want to close this GRN ?')) {
      this.poservice.grnclosegrn(this.grn?.grnid).subscribe({
        next: resp => {
          this.toast.success('GRN closed successfully');
          this.router.navigate(['/warehouse/goods-receipt']);
        }
      })
    }
  }

  downloadgrn() {
    this.showprint = false;
    this.poservice.grnpdfdownload(this.grn.grnid).subscribe({
      next: resp => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = environment.PDF_BASE_URL + 'GRN_' + this.grn.grnid + '.pdf';
          link.target = "new"
          //link.download = path;
          document.body.appendChild(link);
          //console.log(link)
          link.click();
          this.showprint = true;
          link.remove();
        }

      }, error: err => {
        this.toast.failure("Error while download file : " + err);
      }
    })
  }

}
