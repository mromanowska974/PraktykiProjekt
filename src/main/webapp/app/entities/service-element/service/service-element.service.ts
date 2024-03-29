import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IServiceElement, NewServiceElement, ServiceElement } from '../service-element.model';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { IServiceElementVerificationInfo } from 'app/entities/service-element-verification-info/service-element-verification-info.model';
import { IDepartment } from 'app/entities/department/department.model';

export type PartialUpdateServiceElement = Partial<IServiceElement> & Pick<IServiceElement, 'id'>;

type RestOf<T extends IServiceElement | NewServiceElement> = Omit<T, 'startDate' | 'endDate' | 'expirationDate'> & {
  startDate?: string | null;
  endDate?: string | null;
  expirationDate?: string | null;
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

  //API
  create(serviceElement: ServiceElement): Observable<EntityResponseType> {
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

  findByBusinessServiceAndPaymentType(id: number, paymentType: PaymentType): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestServiceElement[]>(`${this.resourceUrl}/byBS/${id}`, {
        params: new HttpParams().append('paymentType', paymentType),
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  findByInternalServiceAndPaymentType(id: number, paymentType: PaymentType): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestServiceElement[]>(`${this.resourceUrl}/byIS/${id}`, {
        params: new HttpParams().append('paymentType', paymentType),
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
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
      startDate: dayjs(serviceElement.startDate)?.toJSON() ?? null,
      endDate: dayjs(serviceElement.endDate)?.toJSON() ?? null,
      expirationDate: dayjs(serviceElement.expirationDate)?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restServiceElement: RestServiceElement): IServiceElement {
    return {
      ...restServiceElement,
      startDate: restServiceElement.startDate ? dayjs(restServiceElement.startDate) : undefined,
      endDate: restServiceElement.endDate ? dayjs(restServiceElement.endDate) : undefined,
      expirationDate: restServiceElement.expirationDate ? dayjs(restServiceElement.expirationDate) : undefined,
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

  //NON-API
  isServiceElementReceived: boolean = false;
  private serviceElement = new BehaviorSubject<{ serviceElement: IServiceElement; verificationInfo: IServiceElementVerificationInfo[] }>({
    serviceElement: {} as IServiceElement,
    verificationInfo: [],
  });
  toReceive = this.serviceElement.asObservable();

  sendCreatedServiceElement(serviceElement: IServiceElement, verificationInfo: IServiceElementVerificationInfo[]) {
    this.serviceElement.next({
      serviceElement: serviceElement,
      verificationInfo: verificationInfo,
    });
    this.isServiceElementReceived = true;
  }

  isDataReceived: boolean = false;
  private dataToSend = new BehaviorSubject<{ verificationInfo: IServiceElementVerificationInfo[]; leadingDepartment: IDepartment }>({
    verificationInfo: [],
    leadingDepartment: {} as IDepartment,
  });
  dataToReceive = this.dataToSend.asObservable();

  sendData(verificationInfo: IServiceElementVerificationInfo[], leadingDepartment: IDepartment) {
    this.dataToSend.next({
      verificationInfo: verificationInfo,
      leadingDepartment: leadingDepartment,
    });
    this.isDataReceived = true;
  }
}
