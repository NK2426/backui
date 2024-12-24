import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Image } from '../../../models/inventory';
import { WebteamService } from '../../../services/webteam.service';

import { environment } from 'src/environments/environment';
import { Item } from '../../../models/item';


@Component({
  selector: 'app-stockdetail',
  templateUrl: './stockdetail.component.html',
  styleUrls: ['./stockdetail.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class StockdetailComponent implements OnInit {

  baseurl: string = '';
  item?: Item = {};
  images: Image[] = [];
  constructor(
    private route: ActivatedRoute, private router: Router,
    private webteamservice: WebteamService, private cdr: ChangeDetectorRef, private toast: ToastService,
    private modalService: NgbModal,
    private utlis: UtilsService
  ) { }

  ngOnInit(): void {
    this.baseurl = environment.CATALOG_URL;
    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (!uuid) {
      this.router.navigate(['/app/stocks']);
    } else {
      this.webteamservice.findproduct(uuid)
        .subscribe({
          next: items => {
            // this.cdr.detectChanges();
            this.item = items.item || {};
            this.images = items.itemimagelist
          },
          error: (err) => {
            let msg = (err.error.message) ? err.error.message : 'Item not found';
            this.item = {};
            this.toast.failure(msg);
            this.router.navigate(['/app/stocks']);
          }
        });
    }
  }

}
