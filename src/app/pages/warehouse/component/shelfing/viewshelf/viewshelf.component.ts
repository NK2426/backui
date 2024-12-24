import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Shelfing } from '../../../models/shelfing';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { QRCodeModule } from 'angularx-qrcode';
import { ShelfingService } from '../../../services/shelfing.service';

import { ToastService } from 'src/app/_helpers/toast.service';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-viewshelf',
  templateUrl: './viewshelf.component.html',
  styleUrls: ['./viewshelf.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule]
})
export class ViewshelfComponent implements OnInit {

  @Input() selectedShelf: Shelfing = new Shelfing;
  @Output() editShelf = new EventEmitter<Shelfing>();
  @Output() refreshList = new EventEmitter<string>();
  assignedparams: any = [];
  showprint: boolean = true;
  constructor(private shelfservice: ShelfingService, private cdr: ChangeDetectorRef, private modelservice: NgbModal, private toast: ToastService) { }


  ngOnInit(): void {
  }

  editAction(Shelf: Shelfing): void {
    this.editShelf.emit(Shelf);
  }

  deleteShelf(shelf: Shelfing): void {
    if (confirm('Shelf Delete Confirmation . Do you want to delete?')) {
      this.shelfservice.delete(shelf).subscribe({
        next: resp => {
          this.toast.success('Shelf Deleted Successfully');
          this.refreshList.emit('refresh');
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }

  printPage() {

    // const doc = new jsPDF()
    // autoTable(doc, { html: '#printpsid', columnStyles: { 3: { cellWidth: 'auto' } } })
    // doc.save('psidgenerate.pdf')

    this.showprint = false;
    setTimeout(() => {
      let DATA: any = document.getElementById('print');
      html2canvas(DATA).then((canvas) => {
        let fileWidth = 180;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/jpeg');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 2;
        PDF.addImage(FILEURI, 'PNG', 3, position, fileWidth, fileHeight);
        //let sizecount = this.page === 1 ? 1 : (((this.page - 1) * this.pageSize)+1)
        PDF.save(this.selectedShelf?.shelfID + '.pdf');
        this.showprint = true;
      });
    }, 100);

  }

}
