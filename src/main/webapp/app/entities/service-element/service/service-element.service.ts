import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IServiceElement, NewServiceElement } from '../service-element.model';

export type PartialUpdateServiceElement = Partial<IServiceElement> & Pick<IServiceElement, 'id'>;

type RestOf<T extends IServiceElement | NewServiceElement> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestServiceElement = RestOf<IServiceElement>;

export type NewRestServiceElement = RestOf<NewServiceElement>;

export type PartialUpdateRestServiceElement = RestOf<PartialUpdateServiceElement>;

export type EntityResponseType = HttpResponse<IServiceElement>;
export type EntityArrayResponseType = HttpResponse<IServiceElement[]>;

@Injectable({ providedIn: 'root' })
export class ServiceElementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/service-elements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(serviceElement: NewServiceElement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceElement);
    return this.http
      .post<RestServiceElement>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(serviceElement: IServiceElement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceElement);
    return this.http
      .put<RestServiceElement>(`${this.resourceUrl}/${this.getServiceElementIdentifier(serviceElement)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(serviceElement: PartialUpdateServiceElement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceElement);
    return this.http
      .patch<RestServiceElement>(`${this.resourceUrl}/${this.getServiceElementIdentifier(serviceElement)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestServiceElement>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestServiceElement[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getServiceElementIdentifier(serviceElement: Pick<IServiceElement, 'id'>): number {
    return serviceElement.id;
  }

  compareServiceElement(o1: Pick<IServiceElement, 'id'> | null, o2: Pick<IServiceElement, 'id'> | null): boolean {
    return o1 && o2 ? this.getServiceElementIdentifier(o1) === this.getServiceElementIdentifier(o2) : o1 === o2;
  }

  addServiceElementToCollectionIfMissing<Type extends Pick<IServiceElement, 'id'>>(
    serviceElementCollection: Type[],
    ...serviceElementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const serviceElements: Type[] = serviceElementsToCheck.filter(isPresent);
    if (serviceElements.length > 0) {
      const serviceElementCollectionIdentifiers = serviceElementCollection.map(
        serviceElementItem => this.getServiceElementIdentifier(serviceElementItem)!
      );
      const serviceElementsToAdd = serviceElements.filter(serviceElementItem => {
        const serviceElementIdentifier = this.getServiceElementIdentifier(serviceElementItem);
        if (serviceElementCollectionIdentifiers.includes(serviceElementIdentifier)) {
          return false;
        }
        serviceElementCollectionIdentifiers.push(serviceElementIdentifier);
        return true;
      });
      return [...serviceElementsToAdd, ...serviceElementCollection];
    }
    return serviceElementCollection;
  }

  protected convertDateFromClient<T extends IServiceElement | NewServiceElement | PartialUpdateServiceElement>(
    serviceElement: T
  ): RestOf<T> {
    return {
      ...serviceElement,
      startDate: serviceElement.startDate?.toJSON() ?? null,
      endDate: serviceElement.endDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restServiceElement: RestServiceElement): IServiceElement {
    return {
      ...restServiceElement,
      startDate: restServiceElement.startDate ? dayjs(restServiceElement.startDate) : undefined,
      endDate: restServiceElement.endDate ? dayjs(restServiceElement.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestServiceElement>): HttpResponse<IServiceElement> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestServiceElement[]>): HttpResponse<IServiceElement[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
