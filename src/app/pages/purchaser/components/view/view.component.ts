import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Productmapparam } from '../../models/product';
import { PurchaseorderService } from '../../services/purchaseorder.service';
// import { ToastService } from 'src/app/_helpers/toast.service';
import { CommonModule, DatePipe, JsonPipe, LocationStrategy, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { environment } from 'src/environments/environment';
import { Documents } from '../../models/documents';
import { Productvariants } from '../../models/productvariants';
import { Address, Poproess, Productselectimages, Purchaseorder, Vendor, Warehouse } from '../../models/purchaseorder';
import { Settings } from '../../models/settings';
import { CreatePoComponent } from '../create-po/create-po.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from 'src/app/_helpers/loader.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-view',
  standalone: true,
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    DatePipe,
    JsonPipe,
    MatStepperModule,
    CreatePoComponent,
    RouterModule,
    FormsModule,
    NgxPermissionsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit, OnChanges {
  data: Purchaseorder = {};
  purchaseitems!: any;
  comments = '';
  fromstatus = 'Create';
  tostatus = 'Process';
  poprocesslist: Poproess[] = [];
  status: Array<{ id: string; name: string }> = [];
  headapprove = { status: '', halt: '', comments: '' };
  actionreason = false;
  billaddress: Address = {};
  statuopenform: boolean = false;
  productmapparams: Productmapparam[] = [];
  productimages: Productselectimages[] = [];
  baseurl: string = '';
  taxvalue = 0;
  discount = 0;
  documentlist: Documents[] = [];
  vendocumentlist: Documents[] = [];
  submit = false;
  gsubmit = false;
  isdownload = false;
  settings?: Settings;

  addShipperForm!: FormGroup;
  docArray: Documents[] = [];
  vendocArray: Documents[] = [];
  warehouse: Warehouse;
  vendor?: Vendor = {};
  variants: Productvariants[] = [];
  mappedvaiants: any = {};

  public user = JSON.parse(sessionStorage.getItem('token') || '{}');
  analytics: any = [];
  taxtotal = { ifigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 };
  qtytotal = 0;
  showprint = true;
  showprintxl = true;
  EmpName: any;

  @Input() item: any;
  @Output() refreshList = new EventEmitter<string>();
  minDate: any;
  @ViewChild('potable', { static: false }) pdfTable: ElementRef;


  //
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private porderservice: PurchaseorderService,
    private modelservice: NgbModal,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private toast: ToastService,
    private datepipe: DatePipe,
    private http: HttpClient,
    private loc: LocationStrategy,
    private loaderService: LoaderService,
  ) { }
  angularRoute: any
  url: any;
  localhostui: "http://localhost:4200/"
  localhostvendor: "http://localhost:4300/"
  vprc: "https://fashionwrap.vprc.in/admin/"

  ngOnInit(): void {
    this.baseurl = environment.PDF_BASE_URL;
    this.minDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    //console.log("item ->", this.item)
    if (this.user && this.user.role === 3) {
      this.status = [{ id: 'Process', name: 'Send for approval' }];
    } else if (this.user && this.user.role === 4) {
      this.status = [
        { id: 'Approved', name: 'Approved' },
        { id: 'Revise', name: 'Revise' },
        { id: 'Halt', name: 'Halt' },
        { id: 'Reject', name: 'Reject' }
      ];
    }
    this.getData();
    this.angularRoute = this.loc.path();
    this.url = window.location.href;
    this.ref.detectChanges();

  }
  getwarehouse(id: any) {
    // console.log(this.data);
    this.porderservice.Warehouse(id).subscribe({
      next: (data) => {
        this.warehouse = data;
        this.warehouse.billingaddress = this.warehouse.billingaddress.split(',').join(',<br>');
        // console.log(this.warehouse.billingaddress);
        // console.log(this.warehouse);
        this.ref.detectChanges();
      }
    });
  }

  getData() {
    let uuid = this.route.snapshot.paramMap.get('uuid');
    let id;
    uuid = uuid !== null ? uuid : this.item;
    //console.log(uuid, '=>', this.item);
    if (uuid) {
      this.porderservice.fulldetailvar(uuid).subscribe({
        next: async (data) => {
          this.data = data;
          this.EmpName = data.purchase.uuid;
          id = data.warehouse.id;
          this.getwarehouse(id);
          //console.log('view data=>', this.data);
          if (data.documents != '' || data.vendocuments != '') {
            this.porderservice.documentlist().subscribe({
              next: (datalist) => {
                if (data.documents != '') {
                  this.documentlist = datalist.filter((data) => data.vendor_id == 0);
                  let docs: [] = data.documents.split(',');
                  this.docArray = datalist.filter((r1) => docs.some((r2) => r1.id == r2));
                }
                if (data.vendocuments != '') {
                  this.vendocumentlist = datalist.filter((data: any) => data?.vendor_id > 0);
                  let vendocs: [] = data.vendordocuments.split(',');
                  this.vendocArray = datalist.filter((r1) => vendocs.some((r2) => r1.id == r2));
                }
              }
            });
          }

          if (this.user && this.user.role === 3 && this.item == undefined) {
            if (data.status === 'Revise' || data.status === 'Vendor_revise') {
              this.statuopenform = true;
            }
          }
          if (this.user && this.user.role === 4) {
            if (data.status === 'Process' || data.status === 'Halt') {
              this.statuopenform = true;
            }
          }
          if (data.status == 'Revision') {
            this.fromstatus = 'Revision';
            this.tostatus = 'Revised';
          }

          if (data.purchaseorderitems) {
            let variantdata: Productvariants[] = [];

            if (data.purchaseorderitems) {
              this.taxtotal = { ifigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 };
              this.qtytotal = 0;
              await data.purchaseorderitems.map(async (orderitem: any) => {
                // console.log(orderitem.productselectimage?.path)
                let img: any = orderitem.productselectimage
                // if(this.vprc){
                //   await this.toDataURL(
                //     orderitem.productselectimage?.path,
                //     (dataUrl: any) => {
                //       console.log(dataUrl,'dataUrl');
                //       img.path = dataUrl
                //     }
                //   );
                // }


                // await this.porderservice.imageUrlToBase64(orderitem.productselectimage?.path).subscribe(
                //     (base64:any) => {
                //       img.path = 'data:image/png;base64,'+base64
                // })

                if (orderitem.purchaseitemdetails) {
                  orderitem.purchaseitemdetails.forEach((val: any) => {
                    if (val.productvariant.id) {
                      let checkvariant = variantdata.findIndex((res) => res.id === val.productvariant.id);
                      if (checkvariant < 0) {
                        variantdata.push({
                          id: val.productvariant.id,
                          name: val.productvariant.name,
                          productvariantvalues: val.productvariant.productvariantvalues || []
                        });
                      }
                      let pid = orderitem.product_id || 0;
                      if (!this.mappedvaiants[pid]) this.mappedvaiants[pid] = {};
                      this.mappedvaiants[pid][val.productvariant.id] = true;
                    }
                    this.variants = variantdata;
                  });
                }
                this.qtytotal += orderitem.quantity;

                if (orderitem.ifigst == 1) {
                  this.taxtotal.ifigst = 1;
                }
                this.taxtotal.ctaxtotal += parseFloat(orderitem.ctaxval);
                this.taxtotal.staxtotal += parseFloat(orderitem.staxval);
                this.taxtotal.itaxtotal += parseFloat(orderitem.itaxval);

                if (orderitem.product_id) {
                  //Analytics box commented need to update in future
                  /* this.porderservice.poanalytics(orderitem.product_id, data.vendor_id).subscribe({
                       next: analyticdata=>{
                         let checkanalytics = this.analytics.findIndex((res:any) => res.product_id+'' === orderitem.product_id+'')
                         if (checkanalytics < 0) {
                           analyticdata.product_id = orderitem.product_id
                           analyticdata.name = orderitem.product.name
 
                           this.analytics.push(analyticdata);
                        }
                       }
                     })*/
                }
              });
            }

            this.purchaseitems = data.purchaseorderitems[0]['purchaseitemdetails'];
          }
          if (data.user.addresses && data.user.addresses.length > 0) {
            this.billaddress = data.user.addresses[0];
          }
          // if(data.product && data.product.productmapparams)
          // {
          //   this.productmapparams = data.product.productmapparams;
          //   this.productmapparams = this.productmapparams?.filter(val=> val.value_id > 0 );
          // }

          if (data.product && data.product.productselectimages) {
            this.productimages = data.product.productselectimages;
          }
          if (data.discountype + '' === '1') this.discount = data.discount;
          else if (data.discountype + '' === '2') this.discount = (data.total * data.discount) / 100;

          if (data.taxpercentage > 0) {
            this.taxvalue = ((data.total - this.discount) * data.taxpercentage) / 100;
          }
          this.poprocess();
          this.addShipperForm = this.fb.group({
            uuid: [this.data.uuid],
            shipper_id: [this.data.shipper_id, [Validators.required]]
          });
          this.refreshList.emit('refresh');
          // this.porderservice.vendorlist(data.product.pid)
          // .subscribe({
          //   next: vendors => {
          //     this.vendor = vendors.find(res => res.vendor_id == data.vendor_id);
          //   }
          // });
          this.ref.detectChanges();
        },
        error: () => { }
      });
      this.porderservice.findsetting().subscribe({
        next: (data) => {
          this.settings = data;
          // this.ref.detectChanges();
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    //console.log(changes);
    this.getData();
  }

  poprocess() {
    this.porderservice.purchaserorderproess(this.data.id).subscribe({
      next: (data) => {
        this.poprocesslist = data;
        this.ref.detectChanges();
      }
    });
  }

  approve() {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Approval  Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to continue to approval?';
    modalRef.result.then(
      () => {
        this.porderservice
          .approve({ uuid: this.data.uuid, notes: this.comments, fromstatus: this.fromstatus, tostatus: this.tostatus })
          .subscribe({
            next: () => {
              this.toast.success('Successfully Send For Approval');
              this.statuopenform = false;
              this.ngOnInit();
            },
            error: (err) => {
              this.toast.failure(err);
            }
          });
      },
      () => {
        //console.log(err);
      }
    );
  }

  toFloat(x: any) {
    let xyz = parseInt(x) === x ? x : parseFloat(x).toFixed(2);
    return Number(xyz);
  }

  download() {
    this.showprint = false;
    this.porderservice.downloadvarpdf(this.data.uuid).subscribe({
      next: (resp) => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = this.baseurl + this.data.uuid + '.pdf';
          link.target = 'new';
          //link.download = path;
          document.body.appendChild(link);
          //console.log(link);
          // console.log(link.href);
          link.click();

          link.remove();
        }
      },
      error: (err) => {
        this.toast.failure('Error while download file : ' + err.error.message);
      }
    });
    this.showprint = true;
  }

  downloadexcel() {
    this.showprintxl = false;
    this.porderservice.downloadvarxl(this.data.uuid).subscribe({
      next: (resp) => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = environment.PDF_BASE_URL + this.data.uuid + '.xlsx';
          link.target = '_self';
          //link.download = path;
          document.body.appendChild(link);
          //console.log(this.baseurl, link);
          link.click();

          link.remove();
        }
      },
      error: (err) => {
        this.toast.failure('Error while download file : ' + err.error.message);
      }
    });
    this.showprintxl = true;
  }

  headapproval() {
    if (this.headapprove.status !== 'Approved' && this.headapprove.comments === '') {
      this.actionreason = true;
      return;
    } else {
      this.porderservice.headapproval(this.data.uuid, this.headapprove).subscribe({
        next: () => {
          this.toast.success('Successfully Update the Status');
          this.headapprove.comments = '';
          this.statuopenform = false;
          this.ngOnInit();
          this.router.navigate(['/po/po']);
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    }
  }

  src: string;
  showFullImage(event: any, image: any) {
    // console.log(event, event.target, event.target.src);
    this.modelservice.open(image, { size: 'lg' });
    this.src = event.target.src;
  }


  terms: boolean = false;
  Status!: boolean;
  async downloadAsPDF() {
    // this.terms = true;
    // this.showprint = false;
    // const width = this.pdfTable.nativeElement.clientWidth;
    // const height = this.pdfTable.nativeElement.clientHeight + 10;
    let orientation = 'p';
    let imageUnit = 'pt';
    // if (width > height) {
    //   orientation = 'l';
    // } else {
    //   orientation = 'p';
    // }
    let jsPdfOptions: any = {
      orientation: orientation,
      unit: imageUnit,
      format: 'a4'
    };
    //let pdf:any = new jsPDF(jsPdfOptions);
    // pdf.setFontSize(11);
    // const specialElementHandlers = {
    //   '#editor': function (element, renderer) {
    //     return true;
    //   }
    // };


    // let ele: any = document.querySelector('#potable')
    // let eleW = ele.offsetWidth
    // let eleH = ele.scrollHeight
    // let eleOffsetTop = ele.offsetTop
    // let eleOffsetLeft = ele.offsetLeft
    var canvas = document.createElement("canvas")
    // var abs = 0
    // let win_in = document.documentElement.clientWidth || document.body.clientWidth
    // let win_out = window.innerWidth
    // if (win_out > win_in) {
    //   abs = (win_out - win_in) / 2
    // }
    // canvas.width = eleW * 2
    // canvas.height = eleH * 2
    var context = canvas.getContext("2d")
    // context.scale(2, 2)
    // context.translate(-eleOffsetLeft - abs, -eleOffsetTop)
    var HTMLString = '<p>Text <strong> bold </strong> </p>';
    var HTMLStringContainer = document.createElement('div');
    HTMLStringContainer.innerHTML = HTMLString;

    var elements = HTMLStringContainer.childNodes;
    var term = document.getElementById('term');
    // console.log(term);
    var fullPdf = this.pdfTable.nativeElement.appendChild(term);
    // console.log(fullPdf);

    //using your above canvas code
    var element: any = elements[0];
    await html2canvas(this.pdfTable.nativeElement, {
      scale: 1.5,
      allowTaint: false,
      useCORS: true,
      logging: true
    }).then(async canvas => {
      let HTML_Width: any = canvas.width;
      let HTML_Height: any = canvas.height;
      let top_left_margin: any = 17;
      let PDF_Width: any = HTML_Width + (top_left_margin * 2);
      let PDF_Height: any = (PDF_Width * 1.5) + (top_left_margin * 2);
      let canvas_image_width: any = HTML_Width;
      let canvas_image_height: any = HTML_Height;
      let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
      canvas.getContext('2d');
      //canvas.getContext('2d').imageSmoothingEnabled = false;
      //canvas.getContext('2d').scale(3, 3)
      let imgData: any = canvas.toDataURL("image/jpeg", 1.0);
      // console.log(canvas,imgData)
      //let pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
      let pdf: any = new jsPDF({ orientation: 'portrait', unit: 'px', userUnit: 150, format: [PDF_Width, PDF_Height] });
      pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
      for (let i = 1; i <= totalPDFPages; i++) {
        pdf.addPage([PDF_Width, PDF_Height], 'p');
        pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
      }

      pdf.save("file.pdf");
      // this.showprint = true;
      this.terms = false
    });





  }
  async getBase64FromUrl(url: any) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = `${url}?__v=${Date.now()}`
    return new Promise(resolve => {
      img.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const base64String = canvas.toDataURL('image/png')
        resolve(base64String)
      }
    })
  }

  async toDataURL(url: any, callback: any) {

    this.http.get(url, { responseType: 'blob' })
      .subscribe((blob: any) => {
        const reader = new FileReader();
        const binaryString = reader.readAsDataURL(blob);
        // console.log(binaryString)
        reader.onload = (event: any) => {
          //console.log('Image in Base64: ', event.target.result);
          return event.target.result
        };
        reader.onerror = (event: any) => {
          //console.log("File could not be read: " + event.target.error.code);
          return "";
        };
      });

    // console.log(this.porderservice.getImgBlob(url))

  }
}
