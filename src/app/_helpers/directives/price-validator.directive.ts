import { Directive, Input, NgModule } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
@Directive({
  selector: '[appPriceMRPValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PriceMRPValidatorDirective,
      multi: true
    }
  ]
})


export class PriceMRPValidatorDirective implements Validator {
  @Input('appPriceMRPValidator') price!: string;
  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && Number(control.value) <= Number(this.price)) {
      return { priceInvalid: true };
    } else if (control.value === '') {
      return null;
    } else {
      return null;
    }
  }
}


export class PriceMRPValidatorDirectiveModule { }
