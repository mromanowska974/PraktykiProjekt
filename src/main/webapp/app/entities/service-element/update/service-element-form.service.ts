import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IServiceElement, NewServiceElement } from '../service-element.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IServiceElement for edit and NewServiceElementFormGroupInput for create.
 */
type ServiceElementFormGroupInput = IServiceElement | PartialWithRequiredKeyOf<NewServiceElement>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IServiceElement | NewServiceElement> = Omit<T, 'startDate' | 'endDate' | 'expirationDate'> & {
  startDate?: string | null;
  endDate?: string | null;
  expirationDate?: string | null;
};

type ServiceElementFormRawValue = FormValueOf<IServiceElement>;

type NewServiceElementFormRawValue = FormValueOf<NewServiceElement>;

type ServiceElementFormDefaults = Pick<NewServiceElement, 'id' | 'startDate' | 'endDate' | 'expirationDate'>;

type ServiceElementFormGroupContent = {
  id: FormControl<ServiceElementFormRawValue['id'] | NewServiceElement['id']>;
  price: FormControl<ServiceElementFormRawValue['price']>;
  description: FormControl<ServiceElementFormRawValue['description']>;
  valuationNumber: FormControl<ServiceElementFormRawValue['valuationNumber']>;
  paymentType: FormControl<ServiceElementFormRawValue['paymentType']>;
  startDate: FormControl<ServiceElementFormRawValue['startDate']>;
  periodOfProvisionOfServiceInMonths: FormControl<ServiceElementFormRawValue['periodOfProvisionOfServiceInMonths']>;
  typeOfPeriodOfProvisionOfService: FormControl<ServiceElementFormRawValue['typeOfPeriodOfProvisionOfService']>;
  endDate: FormControl<ServiceElementFormRawValue['endDate']>;
  status: FormControl<ServiceElementFormRawValue['status']>;
  bmcRegistration: FormControl<ServiceElementFormRawValue['bmcRegistration']>;
  priceFromCalculation: FormControl<ServiceElementFormRawValue['priceFromCalculation']>;
  expirationDate: FormControl<ServiceElementFormRawValue['expirationDate']>;
  businessService: FormControl<ServiceElementFormRawValue['businessService']>;
  internalService: FormControl<ServiceElementFormRawValue['internalService']>;
};

export type ServiceElementFormGroup = FormGroup<ServiceElementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ServiceElementFormService {
  createServiceElementFormGroup(serviceElement: ServiceElementFormGroupInput = { id: null }): ServiceElementFormGroup {
    const serviceElementRawValue = this.convertServiceElementToServiceElementRawValue({
      ...this.getFormDefaults(),
      ...serviceElement,
    });
    return new FormGroup<ServiceElementFormGroupContent>({
      id: new FormControl(
        { value: serviceElementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      price: new FormControl(serviceElementRawValue.price),
      description: new FormControl(serviceElementRawValue.description),
      valuationNumber: new FormControl(serviceElementRawValue.valuationNumber),
      paymentType: new FormControl(serviceElementRawValue.paymentType),
      startDate: new FormControl(serviceElementRawValue.startDate),
      periodOfProvisionOfServiceInMonths: new FormControl(serviceElementRawValue.periodOfProvisionOfServiceInMonths),
      typeOfPeriodOfProvisionOfService: new FormControl(serviceElementRawValue.typeOfPeriodOfProvisionOfService),
      endDate: new FormControl(serviceElementRawValue.endDate),
      status: new FormControl(serviceElementRawValue.status),
      bmcRegistration: new FormControl(serviceElementRawValue.bmcRegistration),
      priceFromCalculation: new FormControl(serviceElementRawValue.priceFromCalculation),
      expirationDate: new FormControl(serviceElementRawValue.expirationDate),
      businessService: new FormControl(serviceElementRawValue.businessService),
      internalService: new FormControl(serviceElementRawValue.internalService),
    });
  }

  getServiceElement(form: ServiceElementFormGroup): IServiceElement | NewServiceElement {
    return this.convertServiceElementRawValueToServiceElement(
      form.getRawValue() as ServiceElementFormRawValue | NewServiceElementFormRawValue
    );
  }

  resetForm(form: ServiceElementFormGroup, serviceElement: ServiceElementFormGroupInput): void {
    const serviceElementRawValue = this.convertServiceElementToServiceElementRawValue({ ...this.getFormDefaults(), ...serviceElement });
    form.reset(
      {
        ...serviceElementRawValue,
        id: { value: serviceElementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ServiceElementFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
      expirationDate: currentTime,
    };
  }

  private convertServiceElementRawValueToServiceElement(
    rawServiceElement: ServiceElementFormRawValue | NewServiceElementFormRawValue
  ): IServiceElement | NewServiceElement {
    return {
      ...rawServiceElement,
      startDate: dayjs(rawServiceElement.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawServiceElement.endDate, DATE_TIME_FORMAT),
      expirationDate: dayjs(rawServiceElement.expirationDate, DATE_TIME_FORMAT),
    };
  }

  private convertServiceElementToServiceElementRawValue(
    serviceElement: IServiceElement | (Partial<NewServiceElement> & ServiceElementFormDefaults)
  ): ServiceElementFormRawValue | PartialWithRequiredKeyOf<NewServiceElementFormRawValue> {
    return {
      ...serviceElement,
      startDate: serviceElement.startDate ? serviceElement.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: serviceElement.endDate ? serviceElement.endDate.format(DATE_TIME_FORMAT) : undefined,
      expirationDate: serviceElement.expirationDate ? serviceElement.expirationDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
