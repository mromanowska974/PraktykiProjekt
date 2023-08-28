import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { BusinessService, IBusinessService, NewBusinessService } from '../business-service.model';
import { InternalService } from 'app/entities/internal-service/internal-service.model';
import { IServiceElement } from 'app/entities/service-element/service-element.model';
import { IParameter } from 'app/entities/parameter/parameter.model';
import { ParameterType } from 'app/entities/enumerations/parameter-type.model';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { IServiceElementVerificationInfo } from 'app/entities/service-element-verification-info/service-element-verification-info.model';

export type PartialUpdateBusinessService = Partial<IBusinessService> & Pick<IBusinessService, 'id'>;

export type EntityResponseType = HttpResponse<IBusinessService>;
export type EntityArrayResponseType = HttpResponse<IBusinessService[]>;

@Injectable({ providedIn: 'root' })
export class BusinessServiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/business-services');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  //API
  create(businessService: BusinessService): Observable<EntityResponseType> {
    return this.http.post<IBusinessService>(this.resourceUrl, businessService, { observe: 'response' });
  }

  update(businessService: IBusinessService): Observable<EntityResponseType> {
    return this.http.put<IBusinessService>(`${this.resourceUrl}/${this.getBusinessServiceIdentifier(businessService)}`, businessService, {
      observe: 'response',
    });
  }

  partialUpdate(businessService: PartialUpdateBusinessService): Observable<EntityResponseType> {
    return this.http.patch<IBusinessService>(`${this.resourceUrl}/${this.getBusinessServiceIdentifier(businessService)}`, businessService, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBusinessService>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByInternalService(id: number): Observable<HttpResponse<{ name: string; symbol: string }[]>> {
    return this.http.get<{ name: string; symbol: string }[]>(`${this.resourceUrl}/byIS`, {
      observe: 'response',
      params: new HttpParams().append('id', id),
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBusinessService[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  findByClient(clientId: number): Observable<EntityArrayResponseType> {
    return this.http.get<IBusinessService[]>(`${this.resourceUrl}/by-client`, {
      params: new HttpParams().append('clientId', clientId),
      observe: 'response',
    });
  }

  findByDepartment(departmentId: number): Observable<EntityArrayResponseType> {
    return this.http.get<IBusinessService[]>(`${this.resourceUrl}/by-department`, {
      params: new HttpParams().append('departmentId', departmentId),
      observe: 'response',
    });
  }

  findByEmployee(employeeId: number): Observable<EntityArrayResponseType> {
    return this.http.get<IBusinessService[]>(`${this.resourceUrl}/by-employee`, {
      params: new HttpParams().append('employeeId', employeeId),
      observe: 'response',
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBusinessServiceIdentifier(businessService: Pick<IBusinessService, 'id'>): number {
    return businessService.id;
  }

  compareBusinessService(o1: Pick<IBusinessService, 'id'> | null, o2: Pick<IBusinessService, 'id'> | null): boolean {
    return o1 && o2 ? this.getBusinessServiceIdentifier(o1) === this.getBusinessServiceIdentifier(o2) : o1 === o2;
  }

  addBusinessServiceToCollectionIfMissing<Type extends Pick<IBusinessService, 'id'>>(
    businessServiceCollection: Type[],
    ...businessServicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const businessServices: Type[] = businessServicesToCheck.filter(isPresent);
    if (businessServices.length > 0) {
      const businessServiceCollectionIdentifiers = businessServiceCollection.map(
        businessServiceItem => this.getBusinessServiceIdentifier(businessServiceItem)!
      );
      const businessServicesToAdd = businessServices.filter(businessServiceItem => {
        const businessServiceIdentifier = this.getBusinessServiceIdentifier(businessServiceItem);
        if (businessServiceCollectionIdentifiers.includes(businessServiceIdentifier)) {
          return false;
        }
        businessServiceCollectionIdentifiers.push(businessServiceIdentifier);
        return true;
      });
      return [...businessServicesToAdd, ...businessServiceCollection];
    }
    return businessServiceCollection;
  }

  //NON-API
  isBusinessServiceSaved: boolean = false;
  businessService: BusinessService | null = new BusinessService();
  oldBusinessService: BusinessService | null = new BusinessService();
  serviceElementIndex: number;
  parameterIndex: number;
  action: string = '';

  isDataReceived: boolean = false;
  private serviceElementToSend = new BehaviorSubject<{
    serviceElement: IServiceElement;
    verificationInfo: IServiceElementVerificationInfo[];
  }>({
    serviceElement: {} as IServiceElement,
    verificationInfo: [],
  });
  toReceive = this.serviceElementToSend.asObservable();

  sendServiceElement(serviceElement: IServiceElement, verificationInfo: IServiceElementVerificationInfo[]) {
    this.serviceElementToSend.next({
      serviceElement: serviceElement,
      verificationInfo: verificationInfo,
    });
    this.isDataReceived = true;
  }

  serviceElementsOfMonthlyPaymentType: IServiceElement[] | null = [];
  serviceElementsOfOneTimePaymentType: IServiceElement[] | null = [];

  oldServiceElementsOfMonthlyPaymentType: IServiceElement[] | null = [];
  oldServiceElementsOfOneTimePaymentType: IServiceElement[] | null = [];

  parametersOfQualityType: IParameter[] | null = [];
  parametersOfQuantityType: IParameter[] | null = [];

  oldParametersOfQualityType: IParameter[] | null = [];
  oldParametersOfQuantityType: IParameter[] | null = [];

  formattedStartDatesMonthly: string[] = [];
  formattedEndDatesMonthly: string[] = [];
  formattedStartDatesOneTime: string[] = [];
  formattedEndDatesOneTime: string[] = [];

  parametersToDelete: IParameter[] | null = [];
  serviceElementsToDelete: IServiceElement[] | null = [];

  parametersToEdit: { index: number; parameterType: ParameterType }[] | null = [];
  serviceElementsToEdit: { index: number; paymentType: PaymentType }[] | null = [];

  verificationInfoList: IServiceElementVerificationInfo[] = [];
}
