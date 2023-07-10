import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBusinessService } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';

export const businessServiceResolve = (route: ActivatedRouteSnapshot): Observable<null | IBusinessService> => {
  const id = route.params['id'];
  if (id) {
    return inject(BusinessServiceService)
      .find(id)
      .pipe(
        mergeMap((businessService: HttpResponse<IBusinessService>) => {
          if (businessService.body) {
            return of(businessService.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default businessServiceResolve;
