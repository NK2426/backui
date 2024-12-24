import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { ToastService } from 'src/app/_helpers/toast.service';
import { Group } from '../../../models/inventory';
import { Productvariantsvalues } from '../../../models/productvariants';
import { Shelfing } from '../../../models/shelfing';
import { ShelfingService } from '../../../services/shelfing.service';

@Component({
  selector: 'app-addshelf',
  templateUrl: './addshelf.component.html',
  styleUrls: ['./addshelf.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    RouterModule,
    QRCodeModule,
    ZXingScannerModule,
    NgbPaginationModule
  ]
})
export class AddshelfComponent implements OnInit {
  @Input() data: Shelfing = {};
  @Output() refreshList = new EventEmitter<string>();
  formData!: FormGroup;
  submit: Boolean = false;
  rowvalues: any = [];
  columnvalues: any = [];
  categories: any = [];
  subcategories: any = [];
  products: any = [];

  model: any;
  searching = false;
  searchFailed = false;
  group?: any = {
    
  };

  edit = false;
  variant: Productvariantsvalues = {};
  ///

  search: OperatorFunction<string, readonly Group[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.shefingservice.search(term).pipe(
          map((x: any) => {
            if (x.length > 0) {
              this.searchFailed = false;
              return x;
            } else {
              this.searchFailed = true;
              return ['No Results Found'];
            }
          }),
          tap(() => (this.searching = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );
  formatter = (x: any) => x.name;

  constructor(
    private shefingservice: ShelfingService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    var k,
      i = 'A'.charCodeAt(0);
    var loopEnd = 'Z'.charCodeAt(0);

    for (i; i <= loopEnd; i++) {
      k = i;
      k++;
      this.rowvalues.push(String.fromCharCode(i));
    }
    for (i = 1; i <= 100; i++) {
      this.columnvalues.push(i);
    }
    this.shefingservice.getClass().subscribe({
      next: (resp) => {
        this.categories = resp.data;
      },
      error: (err) => {
        this.toast.failure(err);
      }
    });

    this.shefingservice.getSubclass().subscribe({
      next: (resp) => {
        this.subcategories = resp.data;
      },
      error: (err) => {
        this.toast.failure(err);
      }
    });

    let rackvalue = this.data.rackvalue?.split('-');
    if (rackvalue) {
      this.data.rackvalue = rackvalue[0] || '';
      this.data.rackvalue2 = rackvalue[1] || '';
    }
    let rowvalue = this.data.rowvalue?.split('-');
    if (rowvalue) {
      this.data.rowvalue = rowvalue[0] || '';
      this.data.rowvalue2 = rowvalue[1] || '';
    }
    let columnvalue = this.data.columnvalue?.split('-');
    if (columnvalue) {
      this.data.columnvalue = columnvalue[0] || '';
      this.data.columnvalue2 = columnvalue[1] || '';
    }
    let binvalue = this.data.binvalue?.split('-');
    if (binvalue) {
      this.data.binvalue = binvalue[0] || '';
      this.data.binvalue2 = binvalue[1] || '';
    }

    this.formData = this.formBuilder.group({
      id: [this.data.id],
      rackvalue: ['A', [Validators.required]],
      rackvalue2: [this.data.rackvalue2, [Validators.required]],
      rowvalue: ['S', [Validators.required]],
      rowvalue2: [this.data.rowvalue2, [Validators.required]],
      columnvalue: ['R', [Validators.required]],
      columnvalue2: [this.data.columnvalue2, [Validators.required]],
      binvalue: ['B', [Validators.required]],
      binvalue2: [this.data.binvalue2, [Validators.required]],
      group_id: [this.data.group_id, [Validators.required]],
      department_id: [this.data.department_id, [Validators.required]],
      category_id: [this.data.category_id, [Validators.required]],
      subcategory_id: [this.data.subcategory_id, [Validators.required]],
      products: [''],
      maxcount: [this.data.maxcount, [Validators.pattern('[0-9]+'), Validators.required]],
      status: [1]
    });
    if (this.data.id) {
      this.edit = true;
      this.formData.get('rackvalue').disable();
      this.formData.get('rowvalue').disable();
      this.formData.get('columnvalue').disable();
      this.formData.get('binvalue').disable();
      this.group = this.data.group;
      let selfArray=this.data.shelfID.split('-');
      for (let index = 0; index < selfArray.length; index++) {
        let element = selfArray[index];
        switch (element.charAt(0)) {
          case 'R':
            this.formData.get('columnvalue2').setValue(element.charAt(1));
            this.formData.get('columnvalue2').disable();
            break;
          case 'A':
            this.formData.get('rackvalue2').setValue(element.charAt(1));
            this.formData.get('rackvalue2').disable();
            break;
          case 'S':
            this.formData.get('rowvalue2').setValue(element.charAt(1));
            this.formData.get('rowvalue2').disable();
            break;
          case 'B':
            this.formData.get('binvalue2').setValue(element.charAt(1));
            this.formData.get('binvalue2').disable();
            break;
          default:
            break;
        }
      }
    }
    // Adding default group for shelfing
    // else {
    //   this.getProducts(2544);
    //   this.formData.get('department_id')?.setValue(3);
    //   this.formData.get('category_id')?.setValue(31);
    //   this.formData.get('subcategory_id')?.setValue(855);
    //   this.formData.get('group_id')?.setValue(2544);
    // }
    //end
    this.cdr.detectChanges();
  }

  itemSelected($event: any) {
    const groupval = $event.item;
    this.group = groupval;

    if (groupval.id) {
      this.getProducts(groupval.id);
      this.formData.get('department_id')?.setValue(groupval.department_id);
      this.formData.get('category_id')?.setValue(groupval.category_id);
      this.formData.get('subcategory_id')?.setValue(groupval.subcategory_id);
      this.formData.get('group_id')?.setValue(groupval.id);
    }
  }

  getProducts(gid: any) {
    this.shefingservice.getProducts(gid).subscribe({
      next: (products) => {
        this.products = products.data;
        let productvariantvalues: any = [];
        if (this.edit) {
          this.products.map((x: any) => {
            productvariantvalues = productvariantvalues.concat(x.productvariantvalues);
          });
          this.variant = productvariantvalues.find((x: any) => x.id == this.data.products);
          // console.log(this.variant);
        }
      },
      error: (err) => {}
    });
  }

  getNextLetter(char: string): String {
    var code: number = char.charCodeAt(0);
    code++;
    return String.fromCharCode(code);
  }

  get form() {
    return this.formData.controls;
  }

  saveShelf(): void {
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.data) {
      let itemcount = this.data?.itemcount || 0;
      //console.log(itemcount)
      if (this.formData.value.maxcount < itemcount) {
        this.toast.failure('Enter maxcount greater than or equal to item count');
        return;
      }
    }
    if (this.data.id != null) {

      this.shefingservice.update(this.formData.value).subscribe({
        next: (resp) => {
          if (resp.status == 'failure') {
            this.toast.failure(resp.message);
          } else {
            this.toast.success('Shelf Updated Successfully');
            this.refreshList.emit('refresh');
            this.data = {};
            this.formData.reset();
            this.submit = false;
          }
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    } else {
      // console.log(this.formData);
      
      this.formData.value.range_from = this.formData.value.range_from == null ? 0 : this.formData.value.range_from;
      this.formData.value.range_to = this.formData.value.range_to == null ? 0 : this.formData.value.range_to;
      this.shefingservice.create(this.formData.value).subscribe({
        next: (resp) => {
          if (resp.status == 'failure') {
            this.toast.failure(resp.message);
          } else {
            this.toast.success('Shelf Created Successfully');
            this.refreshList.emit('refresh');
            this.data = {};
            this.formData.reset();
          }
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    }
  }
  cancelAction(): void {
    let type = 'cancel1';
    if (!this.data.id) {
      type = '';
    }
    this.refreshList.emit(type);
  }
}
