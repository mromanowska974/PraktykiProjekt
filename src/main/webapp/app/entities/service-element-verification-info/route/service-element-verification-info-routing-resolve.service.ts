import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IServiceElementVerificationInfo } from '../service-element-verification-info.model';
import { ServiceElementVerificationInfoService } from '../service/service-element-verification-info.service';

export const serviceElementVerificationInfoResolve = (
  route: ActivatedRouteSnapshot
): Observable<null | IServiceElementVerificationInfo> => {
  const id = route.params['id'];
  if (id) {
    return inject(ServiceElementVerificationInfoService)
      .find(id)
      .pipe(
        mergeMap((serviceElementVerificationInfo: HttpResponse<IServiceElementVerificationInfo>) => {
          if (serviceElementVerificationInfo.body) {
            return of(serviceElementVerificationInfo.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default serviceElementVerificationInfoResolve;
