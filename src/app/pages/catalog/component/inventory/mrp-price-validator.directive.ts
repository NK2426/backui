import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
@Directive({
  selector: '[appMRPPriceValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MRPPriceValidatorDirective,
      multi: true
    }
  ], standalone: true
})
export class MRPPriceValidatorDirective implements Validator {
  @Input('appMRPPriceValidator') mrp!: string;
  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && Number(control.value) > Number(this.mrp)) {
      return { priceInvalid: true };
    }
    return null;
  }
}
