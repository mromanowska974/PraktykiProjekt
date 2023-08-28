import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IServiceElementVerificationInfo, NewServiceElementVerificationInfo } from '../service-element-verification-info.model';

export type PartialUpdateServiceElementVerificationInfo = Partial<IServiceElementVerificationInfo> &
  Pick<IServiceElementVerificationInfo, 'id'>;

type RestOf<T extends IServiceElementVerificationInfo | NewServiceElementVerificationInfo> = Omit<T, 'verifyDate'> & {
  verifyDate?: string | null;
};

export type RestServiceElementVerificationInfo = RestOf<IServiceElementVerificationInfo>;

export type NewRestServiceElementVerificationInfo = RestOf<NewServiceElementVerificationInfo>;

export type PartialUpdateRestServiceElementVerificationInfo = RestOf<PartialUpdateServiceElementVerificationInfo>;

export type EntityResponseType = HttpResponse<IServiceElementVerificationInfo>;
export type EntityArrayResponseType = HttpResponse<IServiceElementVerificationInfo[]>;

@Injectable({ providedIn: 'root' })
export class ServiceElementVerificationInfoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/service-element-verification-infos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(serviceElementVerificationInfo: IServiceElementVerificationInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceElementVerificationInfo);
    return this.http
      .post<RestServiceElementVerificationInfo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(serviceElementVerificationInfo: IServiceElementVerificationInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceElementVerificationInfo);
    return this.http
      .put<RestServiceElementVerificationInfo>(
        `${this.resourceUrl}/${this.getServiceElementVerificationInfoIdentifier(serviceElementVerificationInfo)}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(serviceElementVerificationInfo: PartialUpdateServiceElementVerificationInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(serviceElementVerificationInfo);
    return this.http
      .patch<RestServiceElementVerificationInfo>(
        `${this.resourceUrl}/${this.getServiceElementVerificationInfoIdentifier(serviceElementVerificationInfo)}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestServiceElementVerificationInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestServiceElementVerificationInfo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getServiceElementVerificationInfoIdentifier(serviceElementVerificationInfo: Pick<IServiceElementVerificationInfo, 'id'>): number {
    return serviceElementVerificationInfo.id;
  }

  compareServiceElementVerificationInfo(
    o1: Pick<IServiceElementVerificationInfo, 'id'> | null,
    o2: Pick<IServiceElementVerificationInfo, 'id'> | null
  ): boolean {
    return o1 && o2
      ? this.getServiceElementVerificationInfoIdentifier(o1) === this.getServiceElementVerificationInfoIdentifier(o2)
      : o1 === o2;
  }

  addServiceElementVerificationInfoToCollectionIfMissing<Type extends Pick<IServiceElementVerificationInfo, 'id'>>(
    serviceElementVerificationInfoCollection: Type[],
    ...serviceElementVerificationInfosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const serviceElementVerificationInfos: Type[] = serviceElementVerificationInfosToCheck.filter(isPresent);
    if (serviceElementVerificationInfos.length > 0) {
      const serviceElementVerificationInfoCollectionIdentifiers = serviceElementVerificationInfoCollection.map(
        serviceElementVerificationInfoItem => this.getServiceElementVerificationInfoIdentifier(serviceElementVerificationInfoItem)!
      );
      const serviceElementVerificationInfosToAdd = serviceElementVerificationInfos.filter(serviceElementVerificationInfoItem => {
        const serviceElementVerificationInfoIdentifier =
          this.getServiceElementVerificationInfoIdentifier(serviceElementVerificationInfoItem);
        if (serviceElementVerificationInfoCollectionIdentifiers.includes(serviceElementVerificationInfoIdentifier)) {
          return false;
        }
        serviceElementVerificationInfoCollectionIdentifiers.push(serviceElementVerificationInfoIdentifier);
        return true;
      });
      return [...serviceElementVerificationInfosToAdd, ...serviceElementVerificationInfoCollection];
    }
    return serviceElementVerificationInfoCollection;
  }

  protected convertDateFromClient<
    T extends IServiceElementVerificationInfo | NewServiceElementVerificationInfo | PartialUpdateServiceElementVerificationInfo
  >(serviceElementVerificationInfo: T): RestOf<T> {
    return {
      ...serviceElementVerificationInfo,
      verifyDate: serviceElementVerificationInfo.verifyDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restServiceElementVerificationInfo: RestServiceElementVerificationInfo): IServiceElementVerificationInfo {
    return {
      ...restServiceElementVerificationInfo,
      verifyDate: restServiceElementVerificationInfo.verifyDate ? dayjs(restServiceElementVerificationInfo.verifyDate) : undefined,
    };
  }

  protected convertResponseFromServer(
    res: HttpResponse<RestServiceElementVerificationInfo>
  ): HttpResponse<IServiceElementVerificationInfo> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(
    res: HttpResponse<RestServiceElementVerificationInfo[]>
  ): HttpResponse<IServiceElementVerificationInfo[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
