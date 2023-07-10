import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IServiceElement } from '../service-element.model';
import { ServiceElementService } from '../service/service-element.service';

export const serviceElementResolve = (route: ActivatedRouteSnapshot): Observable<null | IServiceElement> => {
  const id = route.params['id'];
  if (id) {
    return inject(ServiceElementService)
      .find(id)
      .pipe(
        mergeMap((serviceElement: HttpResponse<IServiceElement>) => {
          if (serviceElement.body) {
            return of(serviceElement.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default serviceElementResolve;
