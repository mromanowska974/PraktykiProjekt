import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInternalService, NewInternalService } from '../internal-service.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInternalService for edit and NewInternalServiceFormGroupInput for create.
 */
type InternalServiceFormGroupInput = IInternalService | PartialWithRequiredKeyOf<NewInternalService>;

type InternalServiceFormDefaults = Pick<NewInternalService, 'id' | 'criticalService' | 'businessServices'>;

type InternalServiceFormGroupContent = {
  id: FormControl<IInternalService['id'] | NewInternalService['id']>;
  name: FormControl<IInternalService['name']>;
  symbol: FormControl<IInternalService['symbol']>;
  functionalDescription: FormControl<IInternalService['functionalDescription']>;
  serviceComissions: FormControl<IInternalService['serviceComissions']>;
  exclusions: FormControl<IInternalService['exclusions']>;
  dutiesAndResponsibilities: FormControl<IInternalService['dutiesAndResponsibilities']>;
  personResponsibleForService: FormControl<IInternalService['personResponsibleForService']>;
  hoursOfService: FormControl<IInternalService['hoursOfService']>;
  serviceActivatingCost: FormControl<IInternalService['serviceActivatingCost']>;
  priceListOfService: FormControl<IInternalService['priceListOfService']>;
  notes: FormControl<IInternalService['notes']>;
  status: FormControl<IInternalService['status']>;
  criticalService: FormControl<IInternalService['criticalService']>;
  guaranteedLevelsOfProvisionOfService: FormControl<IInternalService['guaranteedLevelsOfProvisionOfService']>;
  periodOfProvisionOfService: FormControl<IInternalService['periodOfProvisionOfService']>;
  windowOfService: FormControl<IInternalService['windowOfService']>;
  levelOfAccessibility: FormControl<IInternalService['levelOfAccessibility']>;
  planDisasterRecovery: FormControl<IInternalService['planDisasterRecovery']>;
  rPO: FormControl<IInternalService['rPO']>;
  rTO: FormControl<IInternalService['rTO']>;
  employee: FormControl<IInternalService['employee']>;
  businessServices: FormControl<IInternalService['businessServices']>;
};

export type InternalServiceFormGroup = FormGroup<InternalServiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InternalServiceFormService {
  createInternalServiceFormGroup(internalService: InternalServiceFormGroupInput = { id: null }): InternalServiceFormGroup {
    const internalServiceRawValue = {
      ...this.getFormDefaults(),
      ...internalService,
    };
    return new FormGroup<InternalServiceFormGroupContent>({
      id: new FormControl(
        { value: internalServiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(internalServiceRawValue.name),
      symbol: new FormControl(internalServiceRawValue.symbol),
      functionalDescription: new FormControl(internalServiceRawValue.functionalDescription),
      serviceComissions: new FormControl(internalServiceRawValue.serviceComissions),
      exclusions: new FormControl(internalServiceRawValue.exclusions),
      dutiesAndResponsibilities: new FormControl(internalServiceRawValue.dutiesAndResponsibilities),
      personResponsibleForService: new FormControl(internalServiceRawValue.personResponsibleForService),
      hoursOfService: new FormControl(internalServiceRawValue.hoursOfService),
      serviceActivatingCost: new FormControl(internalServiceRawValue.serviceActivatingCost),
      priceListOfService: new FormControl(internalServiceRawValue.priceListOfService),
      notes: new FormControl(internalServiceRawValue.notes),
      status: new FormControl(internalServiceRawValue.status),
      criticalService: new FormControl(internalServiceRawValue.criticalService),
      guaranteedLevelsOfProvisionOfService: new FormControl(internalServiceRawValue.guaranteedLevelsOfProvisionOfService),
      periodOfProvisionOfService: new FormControl(internalServiceRawValue.periodOfProvisionOfService),
      windowOfService: new FormControl(internalServiceRawValue.windowOfService),
      levelOfAccessibility: new FormControl(internalServiceRawValue.levelOfAccessibility),
      planDisasterRecovery: new FormControl(internalServiceRawValue.planDisasterRecovery),
      rPO: new FormControl(internalServiceRawValue.rPO),
      rTO: new FormControl(internalServiceRawValue.rTO),
      employee: new FormControl(internalServiceRawValue.employee),
      businessServices: new FormControl(internalServiceRawValue.businessServices ?? []),
    });
  }

  getInternalService(form: InternalServiceFormGroup): IInternalService | NewInternalService {
    return form.getRawValue() as IInternalService | NewInternalService;
  }

  resetForm(form: InternalServiceFormGroup, internalService: InternalServiceFormGroupInput): void {
    const internalServiceRawValue = { ...this.getFormDefaults(), ...internalService };
    form.reset(
      {
        ...internalServiceRawValue,
        id: { value: internalServiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): InternalServiceFormDefaults {
    return {
      id: null,
      criticalService: false,
      businessServices: [],
    };
  }
}
