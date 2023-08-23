import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IServiceElementVerificationInfo } from '../service-element-verification-info.model';
import { ServiceElementVerificationInfoService } from '../service/service-element-verification-info.service';

import serviceElementVerificationInfoResolve from './service-element-verification-info-routing-resolve.service';

describe('ServiceElementVerificationInfo routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: ServiceElementVerificationInfoService;
  let resultServiceElementVerificationInfo: IServiceElementVerificationInfo | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(ServiceElementVerificationInfoService);
    resultServiceElementVerificationInfo = undefined;
  });

  describe('resolve', () => {
    it('should return IServiceElementVerificationInfo returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        serviceElementVerificationInfoResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultServiceElementVerificationInfo = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultServiceElementVerificationInfo).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        serviceElementVerificationInfoResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultServiceElementVerificationInfo = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultServiceElementVerificationInfo).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IServiceElementVerificationInfo>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        serviceElementVerificationInfoResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultServiceElementVerificationInfo = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultServiceElementVerificationInfo).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
