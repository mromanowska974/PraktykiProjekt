import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IServiceElementVerificationInfo } from '../service-element-verification-info.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../service-element-verification-info.test-samples';

import { ServiceElementVerificationInfoService, RestServiceElementVerificationInfo } from './service-element-verification-info.service';

const requireRestSample: RestServiceElementVerificationInfo = {
  ...sampleWithRequiredData,
  verifyDate: sampleWithRequiredData.verifyDate?.toJSON(),
};

describe('ServiceElementVerificationInfo Service', () => {
  let service: ServiceElementVerificationInfoService;
  let httpMock: HttpTestingController;
  let expectedResult: IServiceElementVerificationInfo | IServiceElementVerificationInfo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ServiceElementVerificationInfoService);
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

    it('should create a ServiceElementVerificationInfo', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const serviceElementVerificationInfo = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(serviceElementVerificationInfo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ServiceElementVerificationInfo', () => {
      const serviceElementVerificationInfo = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(serviceElementVerificationInfo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ServiceElementVerificationInfo', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ServiceElementVerificationInfo', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ServiceElementVerificationInfo', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addServiceElementVerificationInfoToCollectionIfMissing', () => {
      it('should add a ServiceElementVerificationInfo to an empty array', () => {
        const serviceElementVerificationInfo: IServiceElementVerificationInfo = sampleWithRequiredData;
        expectedResult = service.addServiceElementVerificationInfoToCollectionIfMissing([], serviceElementVerificationInfo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceElementVerificationInfo);
      });

      it('should not add a ServiceElementVerificationInfo to an array that contains it', () => {
        const serviceElementVerificationInfo: IServiceElementVerificationInfo = sampleWithRequiredData;
        const serviceElementVerificationInfoCollection: IServiceElementVerificationInfo[] = [
          {
            ...serviceElementVerificationInfo,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addServiceElementVerificationInfoToCollectionIfMissing(
          serviceElementVerificationInfoCollection,
          serviceElementVerificationInfo
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ServiceElementVerificationInfo to an array that doesn't contain it", () => {
        const serviceElementVerificationInfo: IServiceElementVerificationInfo = sampleWithRequiredData;
        const serviceElementVerificationInfoCollection: IServiceElementVerificationInfo[] = [sampleWithPartialData];
        expectedResult = service.addServiceElementVerificationInfoToCollectionIfMissing(
          serviceElementVerificationInfoCollection,
          serviceElementVerificationInfo
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceElementVerificationInfo);
      });

      it('should add only unique ServiceElementVerificationInfo to an array', () => {
        const serviceElementVerificationInfoArray: IServiceElementVerificationInfo[] = [
          sampleWithRequiredData,
          sampleWithPartialData,
          sampleWithFullData,
        ];
        const serviceElementVerificationInfoCollection: IServiceElementVerificationInfo[] = [sampleWithRequiredData];
        expectedResult = service.addServiceElementVerificationInfoToCollectionIfMissing(
          serviceElementVerificationInfoCollection,
          ...serviceElementVerificationInfoArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const serviceElementVerificationInfo: IServiceElementVerificationInfo = sampleWithRequiredData;
        const serviceElementVerificationInfo2: IServiceElementVerificationInfo = sampleWithPartialData;
        expectedResult = service.addServiceElementVerificationInfoToCollectionIfMissing(
          [],
          serviceElementVerificationInfo,
          serviceElementVerificationInfo2
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceElementVerificationInfo);
        expect(expectedResult).toContain(serviceElementVerificationInfo2);
      });

      it('should accept null and undefined values', () => {
        const serviceElementVerificationInfo: IServiceElementVerificationInfo = sampleWithRequiredData;
        expectedResult = service.addServiceElementVerificationInfoToCollectionIfMissing(
          [],
          null,
          serviceElementVerificationInfo,
          undefined
        );
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceElementVerificationInfo);
      });

      it('should return initial array if no ServiceElementVerificationInfo is added', () => {
        const serviceElementVerificationInfoCollection: IServiceElementVerificationInfo[] = [sampleWithRequiredData];
        expectedResult = service.addServiceElementVerificationInfoToCollectionIfMissing(
          serviceElementVerificationInfoCollection,
          undefined,
          null
        );
        expect(expectedResult).toEqual(serviceElementVerificationInfoCollection);
      });
    });

    describe('compareServiceElementVerificationInfo', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareServiceElementVerificationInfo(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareServiceElementVerificationInfo(entity1, entity2);
        const compareResult2 = service.compareServiceElementVerificationInfo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareServiceElementVerificationInfo(entity1, entity2);
        const compareResult2 = service.compareServiceElementVerificationInfo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareServiceElementVerificationInfo(entity1, entity2);
        const compareResult2 = service.compareServiceElementVerificationInfo(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
