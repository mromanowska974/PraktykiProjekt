import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBusinessService } from '../business-service.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../business-service.test-samples';

import { BusinessServiceService } from './business-service.service';

const requireRestSample: IBusinessService = {
  ...sampleWithRequiredData,
};

describe('BusinessService Service', () => {
  let service: BusinessServiceService;
  let httpMock: HttpTestingController;
  let expectedResult: IBusinessService | IBusinessService[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BusinessServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a BusinessService', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const businessService = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(businessService).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BusinessService', () => {
      const businessService = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(businessService).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BusinessService', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BusinessService', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BusinessService', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBusinessServiceToCollectionIfMissing', () => {
      it('should add a BusinessService to an empty array', () => {
        const businessService: IBusinessService = sampleWithRequiredData;
        expectedResult = service.addBusinessServiceToCollectionIfMissing([], businessService);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessService);
      });

      it('should not add a BusinessService to an array that contains it', () => {
        const businessService: IBusinessService = sampleWithRequiredData;
        const businessServiceCollection: IBusinessService[] = [
          {
            ...businessService,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBusinessServiceToCollectionIfMissing(businessServiceCollection, businessService);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BusinessService to an array that doesn't contain it", () => {
        const businessService: IBusinessService = sampleWithRequiredData;
        const businessServiceCollection: IBusinessService[] = [sampleWithPartialData];
        expectedResult = service.addBusinessServiceToCollectionIfMissing(businessServiceCollection, businessService);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessService);
      });

      it('should add only unique BusinessService to an array', () => {
        const businessServiceArray: IBusinessService[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const businessServiceCollection: IBusinessService[] = [sampleWithRequiredData];
        expectedResult = service.addBusinessServiceToCollectionIfMissing(businessServiceCollection, ...businessServiceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const businessService: IBusinessService = sampleWithRequiredData;
        const businessService2: IBusinessService = sampleWithPartialData;
        expectedResult = service.addBusinessServiceToCollectionIfMissing([], businessService, businessService2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessService);
        expect(expectedResult).toContain(businessService2);
      });

      it('should accept null and undefined values', () => {
        const businessService: IBusinessService = sampleWithRequiredData;
        expectedResult = service.addBusinessServiceToCollectionIfMissing([], null, businessService, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessService);
      });

      it('should return initial array if no BusinessService is added', () => {
        const businessServiceCollection: IBusinessService[] = [sampleWithRequiredData];
        expectedResult = service.addBusinessServiceToCollectionIfMissing(businessServiceCollection, undefined, null);
        expect(expectedResult).toEqual(businessServiceCollection);
      });
    });

    describe('compareBusinessService', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBusinessService(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBusinessService(entity1, entity2);
        const compareResult2 = service.compareBusinessService(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBusinessService(entity1, entity2);
        const compareResult2 = service.compareBusinessService(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBusinessService(entity1, entity2);
        const compareResult2 = service.compareBusinessService(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
