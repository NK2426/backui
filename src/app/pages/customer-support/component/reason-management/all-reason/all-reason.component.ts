import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { REASONS } from '../../../models/reason';
import { ReasonService } from '../../../services/reason.service';


@Component({
  selector: 'app-all-reason',
  templateUrl: './all-reason.component.html',
  styleUrls: ['./all-reason.component.scss']
})
export class AllReasonComponent implements OnInit {
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  reasons?: REASONS.Reason[];
  reason?: REASONS.Reason;
  isEdit!: boolean;
  reasonID!: string;
  currentIndex = -1;
  formData!: FormGroup;
  options: any[] = []
  selectedCategory!: number;
  submit: Boolean = false;
  constructor(private reasonService: ReasonService, private formBuilder: FormBuilder, private toast: ToastService, private modalService: NgbModal, private utlis: UtilsService) { }

  get form() {
    return this.formData.controls;
  }

  ngOnInit(): void {
    this.getDepartmentList();
    this.formData = this.formBuilder.group({
      department_id: ['3', [Validators.required]],
      reason: ['', [Validators.required]],
      showvariant: [0],
      type: ['Return', [Validators.required]],
      status: ['1', [Validators.required]]
    });
    this.getReasonList();

  }

  getDepartmentList() {
    this.reasonService.getAllDepartment()
      .subscribe({
        next: dropdownResp => {
          if (dropdownResp && dropdownResp.data && dropdownResp.data.length) {
            this.options = dropdownResp.data;
            this.selectedCategory = this.options[0].did;
          }
        }, error: error => {
          this.toast.failure('Error retriving reasons, Try again!')
        }
      })
  }

  getReasonList(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.reasonService.getReasonList(params)
      .subscribe({
        next: reasons => {
          this.reasons = reasons.datas;
          if (reasons.totalItems)
            this.count = reasons.totalItems;
        }, error: error => {
          this.toast.failure('Error retriving reasons, Try again!')
        }
      })
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.getReasonList();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getReasonList();
  }


  addReason(content: any) {
    this.isEdit = false;
    this.modalService.open(content, { size: "lg" });
  }

  cancelAction() {
    this.modalService.dismissAll();
  }

  editReason(reason: REASONS.Reason, content: any) {
    if (reason.id) {
      this.isEdit = true;
      this.reason = reason;
      this.selectedCategory = reason.department_id;
      this.reasonID = reason.uuid;
      this.modalService.open(content, { size: "lg" });
      this.formData = this.formBuilder.group({
        department_id: [reason.department_id, [Validators.required]],
        reason: [reason.reason, [Validators.required]],
        showvariant: [reason.showvariant],
        type: [reason.type, [Validators.required]],
        //status: [reason.status, [Validators.required]],
      });
    }
  }

  upsertReason() {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.isEdit) {
      this.UpdateReason();
    } else {
      // create reason
      this.createReason();
    }

  }


  UpdateReason() {
    let payload = {
      department_id: this.formData.value.department_id,
      reason: this.formData.value.reason,
      showvariant: this.formData.value.showvariant,
      type: this.formData.value.type
    }
    this.reasonService.updateReason(this.reasonID, payload).subscribe({
      next: resp => {
        if (resp.status !== 200) {
          this.toast.failure('Error creating reason');
        }
        else {
          this.toast.success('Reason Updated Successfully');
          payload = {} as any;
          this.formData.reset();
          this.modalService.dismissAll();
          this.getReasonList();
        }
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    })
  }

  createReason() {
    let payload = {
      department_id: this.formData.value.department_id,
      reason: this.formData.value.reason,
      showvariant: this.formData.value.showvariant,
      type: this.formData.value.type
    }
    this.reasonService.createReason(payload).subscribe({
      next: resp => {
        if (resp.status !== 200) {
          this.toast.failure('Error creating reason');
        }
        else {
          this.toast.success('Reason Created Successfully');
          payload = {} as any;
          this.formData.reset();
          this.modalService.dismissAll();
          this.getReasonList();
        }
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    })
  }

  /*ng select dropdown change*/
  onDropDownChange(model: any) {
    this.selectedCategory = model.did;
  }

}
