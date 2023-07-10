import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExternalCompany } from '../external-company.model';
import { ExternalCompanyService } from '../service/external-company.service';

export const externalCompanyResolve = (route: ActivatedRouteSnapshot): Observable<null | IExternalCompany> => {
  const id = route.params['id'];
  if (id) {
    return inject(ExternalCompanyService)
      .find(id)
      .pipe(
        mergeMap((externalCompany: HttpResponse<IExternalCompany>) => {
          if (externalCompany.body) {
            return of(externalCompany.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default externalCompanyResolve;
