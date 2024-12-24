import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bankaccount } from '../../../models/bankaccounts';
import { BankaccountsService } from '../../../services/bankaccounts.service';


@Component({
  selector: 'app-viewbankaccount',
  templateUrl: './viewbankaccount.component.html',
  styleUrls: ['./viewbankaccount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewbankaccountComponent implements OnInit {

  viewaccount: Bankaccount = {};

  constructor(
    private route: ActivatedRoute, private router: Router,
    private accountservice: BankaccountsService, private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    //this.baseurl = this.env.SITE_URL;
    let uuid = this.route.snapshot.paramMap.get('uuid');

    if (uuid) {
      this.accountservice.find(uuid)
        .subscribe({
          next: data => {
            if (data) {
              this.viewaccount = data || {}
            }
            this.cd.detectChanges();
          }
        });
    }
  }
}
