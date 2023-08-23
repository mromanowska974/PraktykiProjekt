import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../service-element-verification-info.test-samples';

import { ServiceElementVerificationInfoFormService } from './service-element-verification-info-form.service';

describe('ServiceElementVerificationInfo Form Service', () => {
  let service: ServiceElementVerificationInfoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceElementVerificationInfoFormService);
  });

  describe('Service methods', () => {
    describe('createServiceElementVerificationInfoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createServiceElementVerificationInfoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            isDepartmentLeading: expect.any(Object),
            verifiedBy: expect.any(Object),
            verifyDate: expect.any(Object),
            department: expect.any(Object),
            serviceElement: expect.any(Object),
          })
        );
      });

      it('passing IServiceElementVerificationInfo should create a new form with FormGroup', () => {
        const formGroup = service.createServiceElementVerificationInfoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            isDepartmentLeading: expect.any(Object),
            verifiedBy: expect.any(Object),
            verifyDate: expect.any(Object),
            department: expect.any(Object),
            serviceElement: expect.any(Object),
          })
        );
      });
    });

    describe('getServiceElementVerificationInfo', () => {
      it('should return NewServiceElementVerificationInfo for default ServiceElementVerificationInfo initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createServiceElementVerificationInfoFormGroup(sampleWithNewData);

        const serviceElementVerificationInfo = service.getServiceElementVerificationInfo(formGroup) as any;

        expect(serviceElementVerificationInfo).toMatchObject(sampleWithNewData);
      });

      it('should return NewServiceElementVerificationInfo for empty ServiceElementVerificationInfo initial value', () => {
        const formGroup = service.createServiceElementVerificationInfoFormGroup();

        const serviceElementVerificationInfo = service.getServiceElementVerificationInfo(formGroup) as any;

        expect(serviceElementVerificationInfo).toMatchObject({});
      });

      it('should return IServiceElementVerificationInfo', () => {
        const formGroup = service.createServiceElementVerificationInfoFormGroup(sampleWithRequiredData);

        const serviceElementVerificationInfo = service.getServiceElementVerificationInfo(formGroup) as any;

        expect(serviceElementVerificationInfo).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IServiceElementVerificationInfo should not enable id FormControl', () => {
        const formGroup = service.createServiceElementVerificationInfoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewServiceElementVerificationInfo should disable id FormControl', () => {
        const formGroup = service.createServiceElementVerificationInfoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
