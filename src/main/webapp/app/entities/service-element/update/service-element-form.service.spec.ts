import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../service-element.test-samples';

import { ServiceElementFormService } from './service-element-form.service';

describe('ServiceElement Form Service', () => {
  let service: ServiceElementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceElementFormService);
  });

  describe('Service methods', () => {
    describe('createServiceElementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createServiceElementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            price: expect.any(Object),
            description: expect.any(Object),
            valuationNumber: expect.any(Object),
            paymentType: expect.any(Object),
            startDate: expect.any(Object),
            periodOfProvisionOfServiceInMonths: expect.any(Object),
            typeOfPeriodOfProvisionOfService: expect.any(Object),
            endDate: expect.any(Object),
            status: expect.any(Object),
            businessService: expect.any(Object),
            internalService: expect.any(Object),
          })
        );
      });

      it('passing IServiceElement should create a new form with FormGroup', () => {
        const formGroup = service.createServiceElementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            price: expect.any(Object),
            description: expect.any(Object),
            valuationNumber: expect.any(Object),
            paymentType: expect.any(Object),
            startDate: expect.any(Object),
            periodOfProvisionOfServiceInMonths: expect.any(Object),
            typeOfPeriodOfProvisionOfService: expect.any(Object),
            endDate: expect.any(Object),
            status: expect.any(Object),
            businessService: expect.any(Object),
            internalService: expect.any(Object),
          })
        );
      });
    });

    describe('getServiceElement', () => {
      it('should return NewServiceElement for default ServiceElement initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createServiceElementFormGroup(sampleWithNewData);

        const serviceElement = service.getServiceElement(formGroup) as any;

        expect(serviceElement).toMatchObject(sampleWithNewData);
      });

      it('should return NewServiceElement for empty ServiceElement initial value', () => {
        const formGroup = service.createServiceElementFormGroup();

        const serviceElement = service.getServiceElement(formGroup) as any;

        expect(serviceElement).toMatchObject({});
      });

      it('should return IServiceElement', () => {
        const formGroup = service.createServiceElementFormGroup(sampleWithRequiredData);

        const serviceElement = service.getServiceElement(formGroup) as any;

        expect(serviceElement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IServiceElement should not enable id FormControl', () => {
        const formGroup = service.createServiceElementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewServiceElement should disable id FormControl', () => {
        const formGroup = service.createServiceElementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
