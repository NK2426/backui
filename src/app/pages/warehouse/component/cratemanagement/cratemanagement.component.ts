import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { CRATEMANAGEMENT } from '../../models/crate';
import { CrateService } from '../../services/crate.service';
import { UpsertcrateComponent } from './upsertcrate/upsertcrate.component';
import { ViewcrateComponent } from './viewcrate/viewcrate.component';
@Component({
  selector: 'app-cratemanagement',
  templateUrl: './cratemanagement.component.html',
  styleUrls: ['./cratemanagement.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule, ViewcrateComponent, UpsertcrateComponent]
})
export class CratemanagementComponent implements OnInit {


  crateList?: CRATEMANAGEMENT.Crate[];
  cratepaginate?: CRATEMANAGEMENT.Cratepaginate = {};
  currentCrate!: CRATEMANAGEMENT.Crate;
  currentIndex = -1;
  addCrate = false;
  viewCrate = false;

  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(private crateService: CrateService, private cdr: ChangeDetectorRef, private modalService: NgbModal, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.list();
  }
  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.crateService.getCrate(params)
      .subscribe({
        next: (crateList: any) => {
          this.crateList = crateList.datas as any;
          this.cdr.detectChanges();
          if (crateList.totalItems)
            this.count = crateList.totalItems;
        }, error: (error: any) => {
          this.toast.failure('Error retriving the list. Try Again');
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

  setActiveCrate(content: any, crate: CRATEMANAGEMENT.Crate, index: number): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentCrate = crate;
    this.addCrate = false;
    this.viewCrate = true;
  }
  refreshList(type: any): void {
    this.addCrate = false;
    if (type == 'cancel') {
      this.viewCrate = true;
    } else {
      this.modalService.dismissAll();
      if (type == 'refresh')
        this.list();
      this.currentIndex = -1;
    }

  }
  insertCrate(content: any): void {
    this.modalService.open(content);
    this.addCrate = true;
    this.viewCrate = false;
    this.currentIndex = -1;
    this.currentCrate = {} as any;
  }

  editCrate(crate: CRATEMANAGEMENT.Crate): void {
    this.addCrate = true;
    this.viewCrate = false;
    let eCrate = Object.assign({}, crate)
    this.currentCrate = eCrate;
  }

}
