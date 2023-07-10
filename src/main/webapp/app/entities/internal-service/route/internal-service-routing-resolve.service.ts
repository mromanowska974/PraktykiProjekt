import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInternalService } from '../internal-service.model';
import { InternalServiceService } from '../service/internal-service.service';

export const internalServiceResolve = (route: ActivatedRouteSnapshot): Observable<null | IInternalService> => {
  const id = route.params['id'];
  if (id) {
    return inject(InternalServiceService)
      .find(id)
      .pipe(
        mergeMap((internalService: HttpResponse<IInternalService>) => {
          if (internalService.body) {
            return of(internalService.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default internalServiceResolve;
