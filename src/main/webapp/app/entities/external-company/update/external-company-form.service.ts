import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IExternalCompany, NewExternalCompany } from '../external-company.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExternalCompany for edit and NewExternalCompanyFormGroupInput for create.
 */
type ExternalCompanyFormGroupInput = IExternalCompany | PartialWithRequiredKeyOf<NewExternalCompany>;

type ExternalCompanyFormDefaults = Pick<NewExternalCompany, 'id'>;

type ExternalCompanyFormGroupContent = {
  id: FormControl<IExternalCompany['id'] | NewExternalCompany['id']>;
  name: FormControl<IExternalCompany['name']>;
  contractNumber: FormControl<IExternalCompany['contractNumber']>;
  sLAParameters: FormControl<IExternalCompany['sLAParameters']>;
  internalService: FormControl<IExternalCompany['internalService']>;
};

export type ExternalCompanyFormGroup = FormGroup<ExternalCompanyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExternalCompanyFormService {
  createExternalCompanyFormGroup(externalCompany: ExternalCompanyFormGroupInput = { id: null }): ExternalCompanyFormGroup {
    const externalCompanyRawValue = {
      ...this.getFormDefaults(),
      ...externalCompany,
    };
    return new FormGroup<ExternalCompanyFormGroupContent>({
      id: new FormControl(
        { value: externalCompanyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(externalCompanyRawValue.name),
      contractNumber: new FormControl(externalCompanyRawValue.contractNumber),
      sLAParameters: new FormControl(externalCompanyRawValue.sLAParameters),
      internalService: new FormControl(externalCompanyRawValue.internalService),
    });
  }

  getExternalCompany(form: ExternalCompanyFormGroup): IExternalCompany | NewExternalCompany {
    return form.getRawValue() as IExternalCompany | NewExternalCompany;
  }

  resetForm(form: ExternalCompanyFormGroup, externalCompany: ExternalCompanyFormGroupInput): void {
    const externalCompanyRawValue = { ...this.getFormDefaults(), ...externalCompany };
    form.reset(
      {
        ...externalCompanyRawValue,
        id: { value: externalCompanyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ExternalCompanyFormDefaults {
    return {
      id: null,
    };
  }
}
