import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { QRCodeModule } from 'angularx-qrcode';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { environment } from 'src/environments/environment';
import { InventoryService } from '../..//services/inventory.service';
import { PurchaseorderService } from '../..//services/purchaseorder.service';
import { Categories, Inwarditem, Product, Productimage, Subcategories } from '../../models/product';
import { Productmapparam } from '../../models/productparameters';
import { Productvariants } from '../../models/productvariants';
import { Brands, Purchaseorder } from '../../models/purchaseorder';
import { DepartmentsService } from 'src/app/pages/category-head/services/departments.service';
import { Department } from '../../models/department';
import { Group } from 'src/app/pages/category-head/models/groups';
import { ProductvariantsService } from 'src/app/pages/category-head/services/productvariants.service';
import { ProductsService } from 'src/app/pages/category-head/services/products.service';
import { BarCodeService } from '../../services/barcode.service';
import { BarCode } from '../../models/barcode';
import { Observable, of, OperatorFunction } from 'rxjs';
import { BrandsService } from '../../services/brands.service';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { startWith } from 'rxjs/operators';

import { catchError, debounceTime, distinctUntilChanged, map, switchMap, take, tap } from 'rxjs/operators';
import { CompressImageService } from 'src/app/pages/purchaser/services/compress-image.service';
import { Vendor } from 'src/app/pages/purchaser/models/view';

@Component({
  selector: 'app-view-barcode',
  templateUrl: './view-barcode.component.html',
  styleUrls: ['./view-barcode.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    RouterModule,
    QRCodeModule,
    ZXingScannerModule,
    SharedModule
    // BarcodeScannerLivestreamModule
  ]
})
export class ViewBarcodeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryservice: InventoryService,
    private barcodeservice: BarCodeService,
    private toast: ToastService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private utlis: UtilsService,
    private fbdisput: FormBuilder,
    private poservice: PurchaseorderService,
    private cdr: ChangeDetectorRef,
    private departmentservice: DepartmentsService,
    private productvariantsservice: ProductvariantsService,
    private productservice: ProductsService,
    private brandsservices: BrandsService,
    private porderservice: PurchaseorderService,
    private compressImage: CompressImageService // private warehouseservice: WarehouseManagerService,
  ) { }
  barcode: any;
  ngOnInit() {
    let barcode = this.route.snapshot.paramMap.get('barcode')
    this.barcodeservice.view(barcode).subscribe({
      next: (items: any) => {
        this.barcode = items
        // console.log(this.barcode);
      },
      error: (err) => {
        console.log(err, '=>', typeof err);
        // this.disputeForm.reset()
      }
    })
  }
}
