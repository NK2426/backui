import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { environment } from 'src/environments/environment';
import { Purchaseorder } from '../../../models/purchaseorder';
import { PurchaseorderService } from '../../../services/purchaseorder.service';


@Component({
  selector: 'app-viewpo',
  templateUrl: './viewpo.component.html',
  styleUrls: ['./viewpo.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule]
})
export class ViewpoComponent implements OnInit {

  @Input() selectedPO: Purchaseorder = new Purchaseorder;
  @Output() viewPO = new EventEmitter<Purchaseorder>();
  @Output() refreshList = new EventEmitter<string>();
   fileName: any = '';
  addfile: string = '';
  baseurl: string = '';
  formData!: FormGroup; typeForm!: FormGroup;
  submit: boolean = false;
  constructor(private poservice: PurchaseorderService, private toast: ToastService, private cdr: ChangeDetectorRef, private formBuilder: FormBuilder, private modelservice: NgbModal) { }

  ngOnInit(): void {
    this.baseurl = environment.WAREHOUSE_SITE_URL;
    this.formData = this.formBuilder.group({
      uuid: [this.selectedPO.uuid],
      remarks: [this.selectedPO.remarks, [Validators.required]],
      invoiceno: [this.selectedPO.invoiceno, [Validators.required]],
      invoiceitemcount: [this.selectedPO.invoiceitemcount || 0, [Validators.required, Validators.min(1)]],
      //imgpath: ['', (this.fileName == '') ? [Validators.required] : ''],
    });
    this.cdr.detectChanges();
  }

  get form() {
    return this.formData.controls;
  }

  /* onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var mimeType = event.target.files[0].type;
      if (!mimeType.match('image.*')) {
        this.formData.controls['imgpath'].setValue('');
        this.toast.failure("Upload Image only");
      }
      else this.formData.controls['imgpath'].setValue(file);
    }
  } */

  saveRemarks(): void {
    this.submit = true;
    if (this.formData.invalid) {
      //console.log(this.formData)
      return;
    }
    if (confirm('Are you sure want to proceed? ')) {

      this.poservice.updateRemarks(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('P.O. Received Successfully');
          this.refreshList.emit('refresh');
          this.formData.reset();
          this.submit = false;
        }, error: err => {
          this.toast.failure(err);
        }
      })
    }
  }

  cancelAction(): void {
    let type = 'cancel1';
    if (!this.selectedPO.id) {
      type = '';
    }
    this.refreshList.emit(type);
  }

}
