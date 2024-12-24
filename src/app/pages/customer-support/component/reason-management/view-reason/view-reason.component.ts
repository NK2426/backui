import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
import { REASONS } from '../../../models/reason';
import { ReasonService } from '../../../services/reason.service';


@Component({
  selector: 'app-view-reason',
  templateUrl: './view-reason.component.html',
  styleUrls: ['./view-reason.component.scss']
})
export class ViewReasonComponent implements OnInit {
  currentReason!: REASONS.Reason;
  currentReasonUUID!: string;
  constructor(private route: ActivatedRoute, private reasonService: ReasonService, private toast: ToastService) { }

  ngOnInit(): void {

    let reasonUUID = this.route.snapshot.paramMap.get('reasonUUID');
    if (reasonUUID) {
      this.getSelectedReason(reasonUUID);
    }
  }

  getSelectedReason(reasonUUID: string) {
    this.reasonService.getReasonByID(reasonUUID).subscribe({
      next: resp => {
        this.currentReason = resp.data;
        this.currentReasonUUID = resp.data.uuid;
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    })
  }

}
