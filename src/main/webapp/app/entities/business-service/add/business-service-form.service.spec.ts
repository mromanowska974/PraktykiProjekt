import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../business-service.test-samples';

import { BusinessServiceFormService } from './business-service-form.service';

describe('BusinessService Form Service', () => {
  let service: BusinessServiceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessServiceFormService);
  });

  describe('Service methods', () => {
    describe('createBusinessServiceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBusinessServiceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            symbol: expect.any(Object),
            functionalDescription: expect.any(Object),
            exclusions: expect.any(Object),
            dutiesAndResponsibilities: expect.any(Object),
            personResponsibleForService: expect.any(Object),
            hoursOfService: expect.any(Object),
            serviceActivatingCost: expect.any(Object),
            priceListOfService: expect.any(Object),
            notes: expect.any(Object),
            status: expect.any(Object),
            internalServices: expect.any(Object),
            client: expect.any(Object),
            employee: expect.any(Object),
            department: expect.any(Object),
          })
        );
      });

      it('passing IBusinessService should create a new form with FormGroup', () => {
        const formGroup = service.createBusinessServiceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            symbol: expect.any(Object),
            functionalDescription: expect.any(Object),
            exclusions: expect.any(Object),
            dutiesAndResponsibilities: expect.any(Object),
            personResponsibleForService: expect.any(Object),
            hoursOfService: expect.any(Object),
            serviceActivatingCost: expect.any(Object),
            priceListOfService: expect.any(Object),
            notes: expect.any(Object),
            status: expect.any(Object),
            internalServices: expect.any(Object),
            client: expect.any(Object),
            employee: expect.any(Object),
            department: expect.any(Object),
          })
        );
      });
    });

    describe('getBusinessService', () => {
      it('should return NewBusinessService for default BusinessService initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBusinessServiceFormGroup(sampleWithNewData);

        const businessService = service.getBusinessService(formGroup) as any;

        expect(businessService).toMatchObject(sampleWithNewData);
      });

      it('should return NewBusinessService for empty BusinessService initial value', () => {
        const formGroup = service.createBusinessServiceFormGroup();

        const businessService = service.getBusinessService(formGroup) as any;

        expect(businessService).toMatchObject({});
      });

      it('should return IBusinessService', () => {
        const formGroup = service.createBusinessServiceFormGroup(sampleWithRequiredData);

        const businessService = service.getBusinessService(formGroup) as any;

        expect(businessService).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBusinessService should not enable id FormControl', () => {
        const formGroup = service.createBusinessServiceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBusinessService should disable id FormControl', () => {
        const formGroup = service.createBusinessServiceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
