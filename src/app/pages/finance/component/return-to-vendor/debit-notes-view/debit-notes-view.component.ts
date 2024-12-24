import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { environment } from 'src/environments/environment';
import { DEBIT_NOTES } from '../../../models/debit-notes';
import { Vendor } from '../../../models/purchaseorder';
import { DebitNotesService } from '../../../services/debit-notes.service';

@Component({
  selector: 'app-debit-notes-view',
  templateUrl: './debit-notes-view.component.html',
  styleUrls: ['./debit-notes-view.component.scss'],
  providers: [DebitNotesService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebitNotesViewComponent implements OnInit {

  constructor(private debitNotesService: DebitNotesService, private route: ActivatedRoute, private toast: ToastService, private utlis: UtilsService, private cd: ChangeDetectorRef) { }


  returnToVendorList!: DEBIT_NOTES.ReturnToVendorItem[];
  filteredReturnToVendorList!: DEBIT_NOTES.ReturnToVendorItem[];
  debitNote!: DEBIT_NOTES.DebitNotesItem;
  currentIndex = -1;
  title = 'Debit Note View'
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 20;
  pageSizes = [20, 30, 50, 100];
  showLabel = false;

  poidList!: DEBIT_NOTES.POID[];
  submit = false;
  poid = 0;
  vendorId = 0;
  psids: string[] = [];
  remarks = '';
  currentVendor: Vendor = {};
  selectedVendorId = 0;
  vendors: Vendor[] = [];
  currentPOID!: DEBIT_NOTES.POID;
  selectedPOID = 0;
  baseurl: string = ''
  showprint = true;
  ngOnInit(): void {
    this.baseurl = environment.PDF_BASE_URL;
    this.returnToVendorList = [];
    this.filteredReturnToVendorList = [];
    let uuid = this.route.snapshot.paramMap.get('uuid') || '';
    if (uuid != '') {
      this.debitNotesService.getDebitNote(uuid)
        .subscribe({
          next: resp => {
            this.debitNote = resp.data as DEBIT_NOTES.DebitNotesItem;
            this.selectedPOID = this.debitNote.po_id;
            // this.cd.detectChanges();
            this.list();
          }, error: error => {
            this.toast.failure("Error getting the audit.. Please Try again!!");
          }
        })
    }
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, 0, 0);
    this.debitNotesService.getDebitNotesPSIDList(params, this.selectedPOID)
      .subscribe({
        next: list => {
          this.returnToVendorList = list.data as DEBIT_NOTES.ReturnToVendorItem[];
          this.filteredReturnToVendorList = this.returnToVendorList.filter(item => item.debitnote == this.debitNote.id);
          // console.log(this.debitNote.id)

          this.psids = this.filteredReturnToVendorList.map(x => { return x.psid })
          // this.cd.detectChanges();
        }, error: error => {
          this.toast.failure("Error getting the audit.. Please Try again!!");
        }
      })
  }

  getStatusMessage(status: number) {
    let message;
    switch (status) {
      case 0:
        message = "Pending approval";
        break;
      case 1:
        message = "Send to approval";
        break;
      case 2:
        message = "Approved";
        break;
      case 3:
        message = "Rejected";
        break;
      default:
        message = "--";
        break;
    }
    return message;
  }

  approval(status: string) {
    if (confirm(`Are you sure you want to ${status}?`)) {
      if (this.debitNote.uuid) {
        let formData = {}
        formData = { 'uuid': this.debitNote.uuid, 'status': status }
        // console.log(formData)
        this.debitNotesService.approval(formData)
          .subscribe({
            next: response => {
              this.toast.success(`${status} Successfully`);
              this.ngOnInit()
            }, error: error => {
              this.toast.failure("Error sent. Please Try again!!");
            }
          })
      }
    }
  }

  download() {
    this.showprint = false;
    this.debitNotesService.download(this.debitNote.uuid).subscribe({
      next: resp => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = this.baseurl + this.debitNote.uuid + '.pdf';
          link.target = "new"
          //link.download = path;
          document.body.appendChild(link);
          // console.log(link)
          link.click();
          this.showprint = true;
          link.remove();
        }
        // this.cd.detectChanges();
      }, error: err => {
        this.toast.failure("Error while download file : " + err.error.message);
      }
    })
  }
}
