import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../internal-service.test-samples';

import { InternalServiceFormService } from './internal-service-form.service';

describe('InternalService Form Service', () => {
  let service: InternalServiceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalServiceFormService);
  });

  describe('Service methods', () => {
    describe('createInternalServiceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInternalServiceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            symbol: expect.any(Object),
            functionalDescription: expect.any(Object),
            serviceComissions: expect.any(Object),
            exclusions: expect.any(Object),
            dutiesAndResponsibilities: expect.any(Object),
            personResponsibleForService: expect.any(Object),
            hoursOfService: expect.any(Object),
            serviceActivatingCost: expect.any(Object),
            priceListOfService: expect.any(Object),
            notes: expect.any(Object),
            status: expect.any(Object),
            criticalService: expect.any(Object),
            guaranteedLevelsOfProvisionOfService: expect.any(Object),
            periodOfProvisionOfService: expect.any(Object),
            windowOfService: expect.any(Object),
            levelOfAccessibility: expect.any(Object),
            planDisasterRecovery: expect.any(Object),
            rPO: expect.any(Object),
            rTO: expect.any(Object),
            employee: expect.any(Object),
            businessServices: expect.any(Object),
          })
        );
      });

      it('passing IInternalService should create a new form with FormGroup', () => {
        const formGroup = service.createInternalServiceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            symbol: expect.any(Object),
            functionalDescription: expect.any(Object),
            serviceComissions: expect.any(Object),
            exclusions: expect.any(Object),
            dutiesAndResponsibilities: expect.any(Object),
            personResponsibleForService: expect.any(Object),
            hoursOfService: expect.any(Object),
            serviceActivatingCost: expect.any(Object),
            priceListOfService: expect.any(Object),
            notes: expect.any(Object),
            status: expect.any(Object),
            criticalService: expect.any(Object),
            guaranteedLevelsOfProvisionOfService: expect.any(Object),
            periodOfProvisionOfService: expect.any(Object),
            windowOfService: expect.any(Object),
            levelOfAccessibility: expect.any(Object),
            planDisasterRecovery: expect.any(Object),
            rPO: expect.any(Object),
            rTO: expect.any(Object),
            employee: expect.any(Object),
            businessServices: expect.any(Object),
          })
        );
      });
    });

    describe('getInternalService', () => {
      it('should return NewInternalService for default InternalService initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createInternalServiceFormGroup(sampleWithNewData);

        const internalService = service.getInternalService(formGroup) as any;

        expect(internalService).toMatchObject(sampleWithNewData);
      });

      it('should return NewInternalService for empty InternalService initial value', () => {
        const formGroup = service.createInternalServiceFormGroup();

        const internalService = service.getInternalService(formGroup) as any;

        expect(internalService).toMatchObject({});
      });

      it('should return IInternalService', () => {
        const formGroup = service.createInternalServiceFormGroup(sampleWithRequiredData);

        const internalService = service.getInternalService(formGroup) as any;

        expect(internalService).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInternalService should not enable id FormControl', () => {
        const formGroup = service.createInternalServiceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInternalService should disable id FormControl', () => {
        const formGroup = service.createInternalServiceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
