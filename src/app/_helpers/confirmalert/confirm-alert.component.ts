import { Component, Input, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector:'app-confirm-alert',
    templateUrl:'./confirm-alert.component.html'
})

export class ConfirmAlert {

  @Input() confirmationBoxTitle: any;
  @Input() confirmationMessage: any;
  
  constructor(public modal: NgbActiveModal, private _modalService: NgbModal) {
  }
  ngOnInit(): void {
  }

  

}