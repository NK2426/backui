import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ToastService } from 'src/app/_helpers//toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Item } from '../../../models/item';
import { WebteamService } from '../../../services/webteam.service';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-productgroups',
  templateUrl: './productgroups.component.html',
  styleUrls: ['./productgroups.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class ProductgroupsComponent implements OnInit {

  qcgroups: Item[] = [];
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
    private webteamservice: WebteamService, private cdr: ChangeDetectorRef, private toast: ToastService,
    private modalService: NgbModal,
    private utlis: UtilsService
  ) { }

  ngOnInit(): void {
    this.list()
  }
  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.webteamservice.getAll(params)
      .subscribe({
        next: items => {
          this.qcgroups = items.datas || [];
          this.count = items.totalItems || 0;
          // this.cdr.detectChanges();
        },
        error: () => {
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

}
