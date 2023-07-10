import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInternalService } from '../internal-service.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../internal-service.test-samples';

import { InternalServiceService } from './internal-service.service';

const requireRestSample: IInternalService = {
  ...sampleWithRequiredData,
};

describe('InternalService Service', () => {
  let service: InternalServiceService;
  let httpMock: HttpTestingController;
  let expectedResult: IInternalService | IInternalService[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InternalServiceService);
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

    it('should create a InternalService', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const internalService = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(internalService).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a InternalService', () => {
      const internalService = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(internalService).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a InternalService', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of InternalService', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a InternalService', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInternalServiceToCollectionIfMissing', () => {
      it('should add a InternalService to an empty array', () => {
        const internalService: IInternalService = sampleWithRequiredData;
        expectedResult = service.addInternalServiceToCollectionIfMissing([], internalService);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(internalService);
      });

      it('should not add a InternalService to an array that contains it', () => {
        const internalService: IInternalService = sampleWithRequiredData;
        const internalServiceCollection: IInternalService[] = [
          {
            ...internalService,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInternalServiceToCollectionIfMissing(internalServiceCollection, internalService);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a InternalService to an array that doesn't contain it", () => {
        const internalService: IInternalService = sampleWithRequiredData;
        const internalServiceCollection: IInternalService[] = [sampleWithPartialData];
        expectedResult = service.addInternalServiceToCollectionIfMissing(internalServiceCollection, internalService);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(internalService);
      });

      it('should add only unique InternalService to an array', () => {
        const internalServiceArray: IInternalService[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const internalServiceCollection: IInternalService[] = [sampleWithRequiredData];
        expectedResult = service.addInternalServiceToCollectionIfMissing(internalServiceCollection, ...internalServiceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const internalService: IInternalService = sampleWithRequiredData;
        const internalService2: IInternalService = sampleWithPartialData;
        expectedResult = service.addInternalServiceToCollectionIfMissing([], internalService, internalService2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(internalService);
        expect(expectedResult).toContain(internalService2);
      });

      it('should accept null and undefined values', () => {
        const internalService: IInternalService = sampleWithRequiredData;
        expectedResult = service.addInternalServiceToCollectionIfMissing([], null, internalService, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(internalService);
      });

      it('should return initial array if no InternalService is added', () => {
        const internalServiceCollection: IInternalService[] = [sampleWithRequiredData];
        expectedResult = service.addInternalServiceToCollectionIfMissing(internalServiceCollection, undefined, null);
        expect(expectedResult).toEqual(internalServiceCollection);
      });
    });

    describe('compareInternalService', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInternalService(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInternalService(entity1, entity2);
        const compareResult2 = service.compareInternalService(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInternalService(entity1, entity2);
        const compareResult2 = service.compareInternalService(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInternalService(entity1, entity2);
        const compareResult2 = service.compareInternalService(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
