import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { State, Vendor, Vendorpaginate } from '../../models/vendor';
import { VendorService } from '../../services/vendor.service';
import { agentpaginate, vendoragent } from 'src/app/pages/hr/models/vendoragent';
import { vendorAgentService } from 'src/app/pages/hr/services/vendorAgent.service';

@Component({
  selector: 'app-vendoragent',
  templateUrl: './vendoragent.component.html',
  styleUrls: ['./vendoragent.component.scss'],
  // standalone: true,
  // imports: [FormsModule, NgbPaginationModule, NgbDatepickerModule, CommonModule,
  //   RouterModule, NgSelectModule, SharedModule]
})
export class VendoragentComponent implements OnInit {
  agent?: vendoragent[];
  agentpaginate?: agentpaginate = {};
  currentAgent: vendoragent = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  breadCrumbItems: Array<{}> = [];
  search = '';
  page = 1;
  count = 0;
  pageSize: any = 10;
  pageSizes = [10, 20, 30, 50, 100];
  constructor(
    private vendorservice: vendorAgentService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private utlis: UtilsService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
    this.vendorservice.getAll(params).subscribe({
      next: (agent) => {
        // console.log(agent);
        this.agent = agent.datas
        // console.log(this.agent);

        this.count = agent.totalItems || 0;
        
        if (agent.totalItems) this.count = agent.totalItems;

        this.cdr.detectChanges();
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });
  }
  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }
  
  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.vendorservice.getAll(params)
      .subscribe({
        next: roles => {
          this.agent = roles.datas;
          this.count = roles.totalItems || 0;
          if (roles.totalItems) {
            this.count = roles.totalItems;
          }
          this.cdr.detectChanges()
        }, error: error => {
         this.toast.failure(error)
        }
      })
  }

 
  handlePageChange(event: any): void {
    // //console.log('insode', event);
    this.page = event;
    this.list();
  }

  handlePageSizeChange(event: any): void {
    // //console.log('insode size', event);
    this.pageSize = event.target.value;
    this.page = 1;
    this.list();
  }

  setActiveRoles(content: any, agent: vendoragent, index: number): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentAgent = agent;
    this.addAction = false;
    this.viewAction = true;
  }
  refreshList(type: any): void {
    this.addAction = false;
    if (type == 'cancel') {
      this.viewAction = true;
    } else {
      this.modalService.dismissAll();
      if (type == 'refresh')
        this.list();
      this.currentIndex = -1;
    }

  }
  addRoles(content: any): void {
    this.modalService.open(content);
    this.addAction = true;
    this.viewAction = false;
    this.currentIndex = -1;
    this.currentAgent = {};
  }
  editRoles(agents: vendoragent): void {
    this.addAction = true;
    this.viewAction = false;
    let agent = Object.assign({}, agents)
    this.currentAgent = agent;
  }
}
