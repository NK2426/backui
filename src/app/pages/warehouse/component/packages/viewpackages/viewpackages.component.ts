import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Packages } from '../../../models/packages';
import { PackageService } from '../../../services/package.service';

@Component({
  selector: 'app-viewpackages',
  templateUrl: './viewpackages.component.html',
  styleUrls: ['./viewpackages.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class ViewpackagesComponent implements OnInit {

  @Input() selectedPackage: Packages = new Packages;
  @Output() editPackage = new EventEmitter<Packages>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams: any = [];
  constructor(private shelfservice: PackageService, private modelservice: NgbModal, private toast: ToastService) { }


  ngOnInit(): void {
  }

  editAction(Shelf: Packages): void {
    this.editPackage.emit(Shelf);
  }

  deleteShelf(shelf: Packages): void {
    if (confirm('Package Delete Confirmation . Do you want to delete?')) {
      this.shelfservice.delete(shelf).subscribe({
        next: resp => {
          this.toast.success('Package Deleted Successfully');
          this.refreshList.emit('refresh');
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }

}
