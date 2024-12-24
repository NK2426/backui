import { ChangeDetectorRef, Component, OnInit } from '@angular/core';


import { ActivatedRoute, Router } from '@angular/router';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Group } from '../../../models/groups';
import { Item } from '../../../models/item';
import { GroupService } from '../../../services/groups.service';

@Component({
  selector: 'app-viewgroup',
  templateUrl: './viewgroup.component.html',
  styleUrls: ['./viewgroup.component.scss']
})
export class ViewgroupComponent implements OnInit {

  baseurl = '';
  viewvendor: Group = {};
  items: Item[] = [];
  subitems: Item[] = [];
  constructor(
    private route: ActivatedRoute, private router: Router,
    private productservice: GroupService,
    private env: EnvService, private toast: ToastService, private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.productservice.find(uuid)
        .subscribe({
          next: data => {
            this.viewvendor = data
            // this.productservice.allgrpitems(data.id).subscribe({
            //   next:items=>{
            //     this.items = items
            //     //console.log(items)
            //   }
            // })
            // this.productservice.allsubgrpitems(data.id).subscribe({
            //   next:items=>{
            //     this.subitems = items
            //     //console.log(items)
            //   }
            // })
            // this.cd.detectChanges();
          }
        });
    }
  }

}
