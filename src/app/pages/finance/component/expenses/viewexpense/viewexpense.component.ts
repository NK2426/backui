import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Expense } from '../../../models/expenses';
import { ExpenseService } from '../../../services/expense.service';


@Component({
  selector: 'app-viewexpense',
  templateUrl: './viewexpense.component.html',
  styleUrls: ['./viewexpense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewexpenseComponent implements OnInit {

  viewexpense: Expense = {};
  baseurl: string = '';

  constructor(
    private route: ActivatedRoute, private router: Router,
    private expenseservice: ExpenseService,
    private env: EnvService, private toast: ToastService, private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.baseurl = this.env.SITE_URL;
    let uuid = this.route.snapshot.paramMap.get('uuid');

    if (uuid) {
      this.expenseservice.find(uuid)
        .subscribe({
          next: data => {
            if (data) {
              this.viewexpense = data || {}
            }
            this.cd.detectChanges();
          }
        });
    }
  }

  removeFile() {
    if (confirm('Are you sure you want to delete this file?')) {
      this.expenseservice.removeFile(this.viewexpense.uuid).subscribe({
        next: resp => {
          this.toast.success('Successfully Deleted');
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
          // this.cd.detectChanges();
        }, error: err => {
          console.log(err.error.message);
        }
      })
    }
  }

  numberFormat(num: any) {
    if (num) {
      var ans = num.toLocaleString('en-IN', { currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return ans;
    }
    else
      return 0;
  }

}
