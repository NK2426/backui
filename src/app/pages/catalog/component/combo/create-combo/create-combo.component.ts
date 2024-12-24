import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { ComboService } from '../../../services/combo.service';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-create-combo',
  templateUrl: './create-combo.component.html',
  styleUrls: ['./create-combo.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class CreateComboComponent implements OnInit {

  isReturnable = false;
  isReplaceable = false;
  @Output() refreshList = new EventEmitter<string>();
  formData!: FormGroup;
  returns = [
    { name: '1', value: '1 Day' },
    { name: '2', value: '2 Days' },
    { name: '3', value: '3 Days' },
    { name: '4', value: '4 Days' },
    { name: '5', value: '5 Days' },
    { name: '6', value: '6 Days' },
    { name: '7', value: '7 Days' }
  ];
  terms = [
    { name: '1', value: 'Mugdha Policy' },
    { name: '2', value: 'Brand/manufacturer Policy' }
  ];
  submit: Boolean = false;
  statuses: Array<{ id: string, name: string }> = [];
  addfile: string = '';
  baseurl: string = '';
  fileName: any = '';
  minDate: any = '';

  constructor(private comboService: ComboService, private cdr: ChangeDetectorRef, private toast: ToastService, private formBuilder: FormBuilder, private utilty: UtilsService
  ) {
  }
  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      keywords: [''],
      returnable: [0],
      returntime: [0],
      replaceable: [0],
      terms: [0, Validators.required],
    });
  }


  get form() {
    return this.formData.controls;
  }

  checkValue(event: any) {
    const numb = +event;
    this.formData.get('returnable')?.patchValue(numb);
    this.isReturnable = true;
    this.isReplaceable = false;
  }

  checkReplaceableValue(event: any) {
    this.isReturnable = false;
    this.isReplaceable = true;
    const numb = +event;
    this.formData.get('replaceable')?.patchValue(numb);
  }
  saveNewCombo(): void {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }

    this.newCombo()
  }
  cancelAction(): void {
    let type = 'cancel';
    this.refreshList.emit(type);
  }

  newCombo() {
    const formd: any = new FormData();
    formd.append('name', this.formData.value.name);
    formd.append('description', this.formData.value.description);
    formd.append('keywords', this.formData.value.keywords);
    formd.append('returnable', this.formData.value.returnable);
    formd.append('returntime', this.formData.value.returntime);
    formd.append('replaceable', this.formData.value.replaceable);
    formd.append('replaceabletime', this.formData.value.replaceabletime);
    formd.append('terms', this.formData.value.terms);
    var msg = 'Created';

    this.comboService.createCombo(this.formData.value).subscribe({
      next: (resp) => {
        if (resp && resp.data) {
          this.toast.success('Combo Saved Successfully ');
          this.refreshList.emit('refresh');
        }
        // this.cdr.detectChanges();
      },
      error: (err) => {
        if (typeof err === 'string') {
          this.toast.failure(err);
        } else {
          this.toast.failure(err.error.message);
        }
      }
    });
  }



}
