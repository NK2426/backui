import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Product } from '../../../models/product';
import { Address, Vendor, Vendordetail, Vendors } from '../../../models/vendor';
import { VendorService } from '../../../services/vendor.service';

@Component({
  selector: 'app-viewvendor',
  templateUrl: './viewvendor.component.html',
  styleUrls: ['./viewvendor.component.scss'],
  standalone: true,
  imports: [FormsModule, NgbPaginationModule, NgbDatepickerModule, CommonModule, RouterModule, NgSelectModule]
})
export class ViewvendorComponent implements OnInit {
  viewvendor: Vendor = {};
  vendors: Vendors = {};
  vendordetail: Vendordetail = {};
  baddress: Address = {};
  agentName: any;
  agentCat :any;
  saddress: Address = {};
  vendorproducts?: Product[];
  variants: any = [];
  constructor(private route: ActivatedRoute, private router: Router, private userservice: VendorService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (history.state.uuid) {
      this.userservice.find(history.state.uuid).subscribe({
        next: (data: any) => {
          if (data) {
            this.viewvendor = data.vendor || {};
            // console.log(this.viewvendor);

            this.vendorproducts = data.vendorproducts;
            this.vendors = data;
            this.agentName = data.agent[0][0].name
            this.agentCat = data.category[0][0].name

            // console.log(this.agentName,  this.agentCat);

            this.vendorproducts?.forEach((mapproduct) => {
              mapproduct.productsmaps?.map((prodmap) => {
                if (prodmap) this.variants?.push(prodmap);
                //console.log(this.variants);
              });
            });
            if (data.vendor && data.vendor.vendordetail) this.vendordetail = data.vendor.vendordetail || {};
            this.baddress = data.address[0] || {};
            this.saddress = data.address[1] || {};
          }
        }
      });
    }
    // this.cd.detectChanges();
  }
}
