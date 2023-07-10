import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IExternalCompany } from '../external-company.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../external-company.test-samples';

import { ExternalCompanyService } from './external-company.service';

const requireRestSample: IExternalCompany = {
  ...sampleWithRequiredData,
};

describe('ExternalCompany Service', () => {
  let service: ExternalCompanyService;
  let httpMock: HttpTestingController;
  let expectedResult: IExternalCompany | IExternalCompany[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExternalCompanyService);
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

    it('should create a ExternalCompany', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const externalCompany = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(externalCompany).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExternalCompany', () => {
      const externalCompany = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(externalCompany).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExternalCompany', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExternalCompany', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ExternalCompany', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addExternalCompanyToCollectionIfMissing', () => {
      it('should add a ExternalCompany to an empty array', () => {
        const externalCompany: IExternalCompany = sampleWithRequiredData;
        expectedResult = service.addExternalCompanyToCollectionIfMissing([], externalCompany);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(externalCompany);
      });

      it('should not add a ExternalCompany to an array that contains it', () => {
        const externalCompany: IExternalCompany = sampleWithRequiredData;
        const externalCompanyCollection: IExternalCompany[] = [
          {
            ...externalCompany,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addExternalCompanyToCollectionIfMissing(externalCompanyCollection, externalCompany);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExternalCompany to an array that doesn't contain it", () => {
        const externalCompany: IExternalCompany = sampleWithRequiredData;
        const externalCompanyCollection: IExternalCompany[] = [sampleWithPartialData];
        expectedResult = service.addExternalCompanyToCollectionIfMissing(externalCompanyCollection, externalCompany);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(externalCompany);
      });

      it('should add only unique ExternalCompany to an array', () => {
        const externalCompanyArray: IExternalCompany[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const externalCompanyCollection: IExternalCompany[] = [sampleWithRequiredData];
        expectedResult = service.addExternalCompanyToCollectionIfMissing(externalCompanyCollection, ...externalCompanyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const externalCompany: IExternalCompany = sampleWithRequiredData;
        const externalCompany2: IExternalCompany = sampleWithPartialData;
        expectedResult = service.addExternalCompanyToCollectionIfMissing([], externalCompany, externalCompany2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(externalCompany);
        expect(expectedResult).toContain(externalCompany2);
      });

      it('should accept null and undefined values', () => {
        const externalCompany: IExternalCompany = sampleWithRequiredData;
        expectedResult = service.addExternalCompanyToCollectionIfMissing([], null, externalCompany, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(externalCompany);
      });

      it('should return initial array if no ExternalCompany is added', () => {
        const externalCompanyCollection: IExternalCompany[] = [sampleWithRequiredData];
        expectedResult = service.addExternalCompanyToCollectionIfMissing(externalCompanyCollection, undefined, null);
        expect(expectedResult).toEqual(externalCompanyCollection);
      });
    });

    describe('compareExternalCompany', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareExternalCompany(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareExternalCompany(entity1, entity2);
        const compareResult2 = service.compareExternalCompany(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareExternalCompany(entity1, entity2);
        const compareResult2 = service.compareExternalCompany(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareExternalCompany(entity1, entity2);
        const compareResult2 = service.compareExternalCompany(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
