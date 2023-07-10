import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../external-company.test-samples';

import { ExternalCompanyFormService } from './external-company-form.service';

describe('ExternalCompany Form Service', () => {
  let service: ExternalCompanyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalCompanyFormService);
  });

  describe('Service methods', () => {
    describe('createExternalCompanyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExternalCompanyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            contractNumber: expect.any(Object),
            sLAParameters: expect.any(Object),
            internalService: expect.any(Object),
          })
        );
      });

      it('passing IExternalCompany should create a new form with FormGroup', () => {
        const formGroup = service.createExternalCompanyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            contractNumber: expect.any(Object),
            sLAParameters: expect.any(Object),
            internalService: expect.any(Object),
          })
        );
      });
    });

    describe('getExternalCompany', () => {
      it('should return NewExternalCompany for default ExternalCompany initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createExternalCompanyFormGroup(sampleWithNewData);

        const externalCompany = service.getExternalCompany(formGroup) as any;

        expect(externalCompany).toMatchObject(sampleWithNewData);
      });

      it('should return NewExternalCompany for empty ExternalCompany initial value', () => {
        const formGroup = service.createExternalCompanyFormGroup();

        const externalCompany = service.getExternalCompany(formGroup) as any;

        expect(externalCompany).toMatchObject({});
      });

      it('should return IExternalCompany', () => {
        const formGroup = service.createExternalCompanyFormGroup(sampleWithRequiredData);

        const externalCompany = service.getExternalCompany(formGroup) as any;

        expect(externalCompany).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IExternalCompany should not enable id FormControl', () => {
        const formGroup = service.createExternalCompanyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExternalCompany should disable id FormControl', () => {
        const formGroup = service.createExternalCompanyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
