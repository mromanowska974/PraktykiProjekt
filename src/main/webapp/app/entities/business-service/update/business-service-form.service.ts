import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBusinessService, NewBusinessService } from '../business-service.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBusinessService for edit and NewBusinessServiceFormGroupInput for create.
 */
type BusinessServiceFormGroupInput = IBusinessService | PartialWithRequiredKeyOf<NewBusinessService>;

type BusinessServiceFormDefaults = Pick<NewBusinessService, 'id' | 'internalServices'>;

type BusinessServiceFormGroupContent = {
  id: FormControl<IBusinessService['id'] | NewBusinessService['id']>;
  name: FormControl<IBusinessService['name']>;
  symbol: FormControl<IBusinessService['symbol']>;
  functionalDescription: FormControl<IBusinessService['functionalDescription']>;
  exclusions: FormControl<IBusinessService['exclusions']>;
  dutiesAndResponsibilities: FormControl<IBusinessService['dutiesAndResponsibilities']>;
  personResponsibleForService: FormControl<IBusinessService['personResponsibleForService']>;
  hoursOfService: FormControl<IBusinessService['hoursOfService']>;
  serviceActivatingCost: FormControl<IBusinessService['serviceActivatingCost']>;
  priceListOfService: FormControl<IBusinessService['priceListOfService']>;
  notes: FormControl<IBusinessService['notes']>;
  internalServices: FormControl<IBusinessService['internalServices']>;
  client: FormControl<IBusinessService['client']>;
  employee: FormControl<IBusinessService['employee']>;
  department: FormControl<IBusinessService['department']>;
};

export type BusinessServiceFormGroup = FormGroup<BusinessServiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BusinessServiceFormService {
  createBusinessServiceFormGroup(businessService: BusinessServiceFormGroupInput = { id: null }): BusinessServiceFormGroup {
    const businessServiceRawValue = {
      ...this.getFormDefaults(),
      ...businessService,
    };
    return new FormGroup<BusinessServiceFormGroupContent>({
      id: new FormControl(
        { value: businessServiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(businessServiceRawValue.name),
      symbol: new FormControl(businessServiceRawValue.symbol),
      functionalDescription: new FormControl(businessServiceRawValue.functionalDescription),
      exclusions: new FormControl(businessServiceRawValue.exclusions),
      dutiesAndResponsibilities: new FormControl(businessServiceRawValue.dutiesAndResponsibilities),
      personResponsibleForService: new FormControl(businessServiceRawValue.personResponsibleForService),
      hoursOfService: new FormControl(businessServiceRawValue.hoursOfService),
      serviceActivatingCost: new FormControl(businessServiceRawValue.serviceActivatingCost),
      priceListOfService: new FormControl(businessServiceRawValue.priceListOfService),
      notes: new FormControl(businessServiceRawValue.notes),
      internalServices: new FormControl(businessServiceRawValue.internalServices ?? []),
      client: new FormControl(businessServiceRawValue.client),
      employee: new FormControl(businessServiceRawValue.employee),
      department: new FormControl(businessServiceRawValue.department),
    });
  }

  getBusinessService(form: BusinessServiceFormGroup): IBusinessService | NewBusinessService {
    return form.getRawValue() as IBusinessService | NewBusinessService;
  }

  resetForm(form: BusinessServiceFormGroup, businessService: BusinessServiceFormGroupInput): void {
    const businessServiceRawValue = { ...this.getFormDefaults(), ...businessService };
    form.reset(
      {
        ...businessServiceRawValue,
        id: { value: businessServiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BusinessServiceFormDefaults {
    return {
      id: null,
      internalServices: [],
    };
  }
}
