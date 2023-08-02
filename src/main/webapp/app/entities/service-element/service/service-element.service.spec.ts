import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IServiceElement } from '../service-element.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../service-element.test-samples';

import { ServiceElementService, RestServiceElement } from './service-element.service';

const requireRestSample: RestServiceElement = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.toJSON(),
  endDate: sampleWithRequiredData.endDate?.toJSON(),
  expirationDate: sampleWithRequiredData.expirationDate?.toJSON(),
};

describe('ServiceElement Service', () => {
  let service: ServiceElementService;
  let httpMock: HttpTestingController;
  let expectedResult: IServiceElement | IServiceElement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ServiceElementService);
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

    it('should create a ServiceElement', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const serviceElement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(serviceElement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ServiceElement', () => {
      const serviceElement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(serviceElement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ServiceElement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ServiceElement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ServiceElement', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addServiceElementToCollectionIfMissing', () => {
      it('should add a ServiceElement to an empty array', () => {
        const serviceElement: IServiceElement = sampleWithRequiredData;
        expectedResult = service.addServiceElementToCollectionIfMissing([], serviceElement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceElement);
      });

      it('should not add a ServiceElement to an array that contains it', () => {
        const serviceElement: IServiceElement = sampleWithRequiredData;
        const serviceElementCollection: IServiceElement[] = [
          {
            ...serviceElement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addServiceElementToCollectionIfMissing(serviceElementCollection, serviceElement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ServiceElement to an array that doesn't contain it", () => {
        const serviceElement: IServiceElement = sampleWithRequiredData;
        const serviceElementCollection: IServiceElement[] = [sampleWithPartialData];
        expectedResult = service.addServiceElementToCollectionIfMissing(serviceElementCollection, serviceElement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceElement);
      });

      it('should add only unique ServiceElement to an array', () => {
        const serviceElementArray: IServiceElement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const serviceElementCollection: IServiceElement[] = [sampleWithRequiredData];
        expectedResult = service.addServiceElementToCollectionIfMissing(serviceElementCollection, ...serviceElementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const serviceElement: IServiceElement = sampleWithRequiredData;
        const serviceElement2: IServiceElement = sampleWithPartialData;
        expectedResult = service.addServiceElementToCollectionIfMissing([], serviceElement, serviceElement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serviceElement);
        expect(expectedResult).toContain(serviceElement2);
      });

      it('should accept null and undefined values', () => {
        const serviceElement: IServiceElement = sampleWithRequiredData;
        expectedResult = service.addServiceElementToCollectionIfMissing([], null, serviceElement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serviceElement);
      });

      it('should return initial array if no ServiceElement is added', () => {
        const serviceElementCollection: IServiceElement[] = [sampleWithRequiredData];
        expectedResult = service.addServiceElementToCollectionIfMissing(serviceElementCollection, undefined, null);
        expect(expectedResult).toEqual(serviceElementCollection);
      });
    });

    describe('compareServiceElement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareServiceElement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareServiceElement(entity1, entity2);
        const compareResult2 = service.compareServiceElement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareServiceElement(entity1, entity2);
        const compareResult2 = service.compareServiceElement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareServiceElement(entity1, entity2);
        const compareResult2 = service.compareServiceElement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
