import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';

import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { environment } from 'src/environments/environment';
import { Shelfing, Shelfingpaginate } from '../../models/shelfing';
import { ShelfingService } from '../../services/shelfing.service';
import { AddshelfComponent } from './addshelf/addshelf.component';
import { ViewshelfComponent } from './viewshelf/viewshelf.component';
@Component({
  selector: 'app-shelfing',
  templateUrl: './shelfing.component.html',
  styleUrls: ['./shelfing.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule, ZXingScannerModule, NgbPaginationModule, ViewshelfComponent, AddshelfComponent]
})
export class ShelfingComponent implements OnInit {

  shelves?: Shelfing[];
  shelfingpaginate?: Shelfingpaginate = {};
  currentShelf: Shelfing = {};
  currentIndex = -1;

  addAction = false;
  viewAction = false;
  breadCrumbItems: Array<{}> = [];

  /// Paginate //////////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  showprint = true;
  baseurl: string = ''

  constructor(private shelfservices: ShelfingService, private cdr: ChangeDetectorRef, private modalService: NgbModal, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard', url: '/warehouse' }, { label: 'Shelves', active: true }];
    this.list();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    this.baseurl = environment.PDF_BASE_URL;
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.shelfservices.getAll(params)
      .subscribe({
        next: shelves => {
          this.shelves = shelves.datas;
          this.count = shelves.totalItems || 0;
          if (shelves.totalItems)
            this.count = shelves.totalItems;
          this.cdr.detectChanges();
        }, error: error => {
          //this.authRedirect.next(error)
        }
      })
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

  setActiveDepartment(content: any, shelf: Shelfing, index: number): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentShelf = shelf;
    this.addAction = false;
    this.viewAction = true;
  }
  refreshList(type: any): void {
    this.addAction = false;
    if (type == 'cancel') {
      this.viewAction = true;
    } else {
      this.modalService.dismissAll();
      if (type == 'refresh')
        this.list();
      this.currentIndex = -1;
    }

  }
  addShelf(content: any): void {
    this.modalService.open(content);
    this.addAction = true;
    this.viewAction = false;
    this.currentIndex = -1;
    this.currentShelf = {};
  }
  editShelf(shelf: Shelfing): void {
    this.addAction = true;
    this.viewAction = false;
    let eshelf = Object.assign({}, shelf)
    this.currentShelf = eshelf;
  }


  downloadqrcodes() {
    this.showprint = false;
    this.shelfservices.download().subscribe({
      next: resp => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = environment.PDF_BASE_URL + 'binqrcodes.pdf';
          link.target = "new"
          //link.download = path;
          document.body.appendChild(link);
          //console.log(link)
          link.click();
          this.showprint = true;
          link.remove();
        }

      }, error: err => {
        this.toast.failure("Error while download file : " + err.error.message);
      }
    })
  }

}
