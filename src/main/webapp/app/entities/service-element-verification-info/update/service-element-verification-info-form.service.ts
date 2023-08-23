import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IServiceElementVerificationInfo, NewServiceElementVerificationInfo } from '../service-element-verification-info.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IServiceElementVerificationInfo for edit and NewServiceElementVerificationInfoFormGroupInput for create.
 */
type ServiceElementVerificationInfoFormGroupInput =
  | IServiceElementVerificationInfo
  | PartialWithRequiredKeyOf<NewServiceElementVerificationInfo>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IServiceElementVerificationInfo | NewServiceElementVerificationInfo> = Omit<T, 'verifyDate'> & {
  verifyDate?: string | null;
};

type ServiceElementVerificationInfoFormRawValue = FormValueOf<IServiceElementVerificationInfo>;

type NewServiceElementVerificationInfoFormRawValue = FormValueOf<NewServiceElementVerificationInfo>;

type ServiceElementVerificationInfoFormDefaults = Pick<NewServiceElementVerificationInfo, 'id' | 'isDepartmentLeading' | 'verifyDate'>;

type ServiceElementVerificationInfoFormGroupContent = {
  id: FormControl<ServiceElementVerificationInfoFormRawValue['id'] | NewServiceElementVerificationInfo['id']>;
  isDepartmentLeading: FormControl<ServiceElementVerificationInfoFormRawValue['isDepartmentLeading']>;
  verifiedBy: FormControl<ServiceElementVerificationInfoFormRawValue['verifiedBy']>;
  verifyDate: FormControl<ServiceElementVerificationInfoFormRawValue['verifyDate']>;
  department: FormControl<ServiceElementVerificationInfoFormRawValue['department']>;
  serviceElement: FormControl<ServiceElementVerificationInfoFormRawValue['serviceElement']>;
};

export type ServiceElementVerificationInfoFormGroup = FormGroup<ServiceElementVerificationInfoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ServiceElementVerificationInfoFormService {
  createServiceElementVerificationInfoFormGroup(
    serviceElementVerificationInfo: ServiceElementVerificationInfoFormGroupInput = { id: null }
  ): ServiceElementVerificationInfoFormGroup {
    const serviceElementVerificationInfoRawValue = this.convertServiceElementVerificationInfoToServiceElementVerificationInfoRawValue({
      ...this.getFormDefaults(),
      ...serviceElementVerificationInfo,
    });
    return new FormGroup<ServiceElementVerificationInfoFormGroupContent>({
      id: new FormControl(
        { value: serviceElementVerificationInfoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      isDepartmentLeading: new FormControl(serviceElementVerificationInfoRawValue.isDepartmentLeading),
      verifiedBy: new FormControl(serviceElementVerificationInfoRawValue.verifiedBy),
      verifyDate: new FormControl(serviceElementVerificationInfoRawValue.verifyDate),
      department: new FormControl(serviceElementVerificationInfoRawValue.department),
      serviceElement: new FormControl(serviceElementVerificationInfoRawValue.serviceElement),
    });
  }

  getServiceElementVerificationInfo(
    form: ServiceElementVerificationInfoFormGroup
  ): IServiceElementVerificationInfo | NewServiceElementVerificationInfo {
    return this.convertServiceElementVerificationInfoRawValueToServiceElementVerificationInfo(
      form.getRawValue() as ServiceElementVerificationInfoFormRawValue | NewServiceElementVerificationInfoFormRawValue
    );
  }

  resetForm(
    form: ServiceElementVerificationInfoFormGroup,
    serviceElementVerificationInfo: ServiceElementVerificationInfoFormGroupInput
  ): void {
    const serviceElementVerificationInfoRawValue = this.convertServiceElementVerificationInfoToServiceElementVerificationInfoRawValue({
      ...this.getFormDefaults(),
      ...serviceElementVerificationInfo,
    });
    form.reset(
      {
        ...serviceElementVerificationInfoRawValue,
        id: { value: serviceElementVerificationInfoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ServiceElementVerificationInfoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      isDepartmentLeading: false,
      verifyDate: currentTime,
    };
  }

  private convertServiceElementVerificationInfoRawValueToServiceElementVerificationInfo(
    rawServiceElementVerificationInfo: ServiceElementVerificationInfoFormRawValue | NewServiceElementVerificationInfoFormRawValue
  ): IServiceElementVerificationInfo | NewServiceElementVerificationInfo {
    return {
      ...rawServiceElementVerificationInfo,
      verifyDate: dayjs(rawServiceElementVerificationInfo.verifyDate, DATE_TIME_FORMAT),
    };
  }

  private convertServiceElementVerificationInfoToServiceElementVerificationInfoRawValue(
    serviceElementVerificationInfo:
      | IServiceElementVerificationInfo
      | (Partial<NewServiceElementVerificationInfo> & ServiceElementVerificationInfoFormDefaults)
  ): ServiceElementVerificationInfoFormRawValue | PartialWithRequiredKeyOf<NewServiceElementVerificationInfoFormRawValue> {
    return {
      ...serviceElementVerificationInfo,
      verifyDate: serviceElementVerificationInfo.verifyDate
        ? serviceElementVerificationInfo.verifyDate.format(DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
