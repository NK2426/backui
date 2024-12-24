import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { TAGS } from '../../../models/tag';
import { TagService } from '../../../services/tag.service';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-all-tag',
  templateUrl: './all-tag.component.html',
  styleUrls: ['./all-tag.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class AllTagComponent implements OnInit {

  tags?: TAGS.Tag[];
  tagPagination!: TAGS.TagPaginate;
  currentTag!: TAGS.Tag;
  currentIndex = -1;

  // Pagination and search config
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  constructor(private tagService: TagService, private cdr: ChangeDetectorRef, private router: Router, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.getTagList();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.getTagList();
  }


  getTagList(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.tagService.getTagList(params)
      .subscribe({
        next: tags => {
          this.tags = tags.datas;
          this.count = tags.totalItems || 0;
          if (tags.totalItems)
            this.count = tags.totalItems;
          // this.cdr.detectChanges();
        }, error: error => {
          this.toast.failure('Error retriving the list, Try again!')
        }
      })
  }

  createTag() {
    this.router.navigate(['/catalog/tags/1']);
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.getTagList();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getTagList();
  }

}
