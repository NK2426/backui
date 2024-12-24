import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, forwardRef, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDatepicker, NgbDatepickerConfig, NgbDateStruct, NgbModule, NgbPopover, NgbPopoverConfig, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { noop } from 'rxjs';
import { DateTimeModel } from './date-time-model';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [CommonModule, FormsModule,
    NgbModule]
})
export class DateTimePickerComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnChanges {
  @Input() dateString!: string;

  @Input() inputDatetimeFormat = 'M/d/yyyy H:mm:ss';
  @Input() hourStep = 1;
  @Input() minuteStep = 15;
  @Input() secondStep = 30;
  @Input() seconds = true;
  @Input() minDate: any;
  @Input() disabled = false;

  showTimePickerToggle = false;

  datetime: DateTimeModel = new DateTimeModel();
  firstTimeAssign = true;

  @ViewChild(NgbDatepicker) dp!: NgbDatepicker;

  @ViewChild(NgbPopover) popover!: NgbPopover;

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

  ngControl!: NgControl;

  constructor(private config: NgbPopoverConfig, private inj: Injector, private datePickerConfig: NgbDatepickerConfig) {
    config.autoClose = 'outside';
    config.placement = 'auto';

  }

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['minDate']) {
      let todayDate = new Date();
      if (!Object.keys(this.minDate).length) {
        this.minDate = { day: todayDate.getDate(), month: todayDate.getMonth() + 1, year: todayDate.getFullYear() }
      }
      this.datePickerConfig.minDate = this.minDate;
    }
  }

  ngAfterViewInit(): void {
    this.popover.hidden.subscribe($event => {
      this.showTimePickerToggle = false;
    });
  }

  writeValue(newModel: string) {
    if (newModel) {
      this.datetime = Object.assign(this.datetime, DateTimeModel.fromLocalString(newModel));
      this.dateString = newModel;
      this.setDateStringModel();
    } else {
      this.datetime = new DateTimeModel();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDateTimeState($event?: any) {
    this.showTimePickerToggle = !this.showTimePickerToggle;
    if ($event) $event.stopPropagation();
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange($event: any) {
    const value = $event.target.value;
    const dt = DateTimeModel.fromLocalString(value);

    if (dt) {
      this.datetime = dt;
      this.setDateStringModel();
    } else if (value.trim() === '') {
      this.datetime = new DateTimeModel();
      this.dateString = '';
      this.onChange(this.dateString);
    } else {
      this.onChange(value);
    }
  }

  onDateChange($event: string | NgbDateStruct | any) {
    if ($event.year) {
      $event = `${$event.year}-${$event.month}-${$event.day}`
    }
    const date = DateTimeModel.fromLocalString($event);

    if (!date) {
      this.dateString = this.dateString;
      return;
    }

    if (!this.datetime) {
      this.datetime = date;
    }

    this.datetime.year = date.year;
    this.datetime.month = date.month;
    this.datetime.day = date.day;
    this.datetime.hour = new Date().getHours() + 1;
    this.datetime.minute = new Date().getMinutes();
    this.datetime.second = new Date().getSeconds();
    this.dp && this.dp.navigateTo({ year: this.datetime.year, month: this.datetime.month });
    this.setDateStringModel();
  }

  onTimeChange(event: NgbTimeStruct) {
    let currentHH = new Date().getHours();
    let currentMM = new Date().getMinutes();
    let currentSS = new Date().getSeconds();
    let currentDate = new Date().getDate();
    if ((event.hour <= currentHH && currentDate === this.datetime.day) || (event.hour <= currentHH && event.minute <= currentMM && currentDate === this.datetime.day)) {
      this.datetime.hour = currentHH + 1;
      this.datetime.minute = currentMM;
      this.datetime.second = currentSS;
    } else {
      this.datetime.hour = event.hour;
      this.datetime.minute = event.minute;
      this.datetime.second = event.second;
    }


    this.setDateStringModel();
  }

  setDateStringModel() {
    this.dateString = this.datetime.toString();

    if (!this.firstTimeAssign) {
      this.onChange(this.dateString);
    } else {
      // Skip very first assignment to null done by Angular
      if (this.dateString !== null) {
        this.firstTimeAssign = false;
      }
    }
  }

  inputBlur($event: any) {
    this.onTouched();
  }
}
