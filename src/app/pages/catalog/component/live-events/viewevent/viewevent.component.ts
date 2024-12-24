import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../../../models/blog';
import { EventService } from '../../../services/events.service';
import { Events } from '../../../models/events';

@Component({
  selector: 'app-viewevent',
  templateUrl: './viewevent.component.html',
  styleUrls: ['./viewevent.component.scss']
})
export class VieweventComponent {
  @Input() data: Events = {};

  formData!: FormGroup;
  warehouses: Blog[];
  submit: boolean = false;

  edit: boolean = false;
  constructor(
    private warehouseservice: EventService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.warehouseservice.view(id).subscribe({
        next: (data) => {
          this.data = {
            title: data.title,
            content: data.content,
            link_name:data.link_name,
            slug:data.slug,
            type:data.type,
            status: data.status,
            image: data.image
          };
          // console.log(data);
          this.ref.detectChanges();
        },
        error: (err) => {
          console.log('error page');
          this.router.navigate(['/catalog/live-events']);
        }
      });
    } else {
      console.log('if error');
    }
  }
  back() {
    this.router.navigate(['/catalog/live-events']);
  }
}
