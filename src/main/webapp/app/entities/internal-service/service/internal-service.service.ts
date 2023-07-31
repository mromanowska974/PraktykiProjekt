import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInternalService, InternalService, NewInternalService } from '../internal-service.model';

export type PartialUpdateInternalService = Partial<IInternalService> & Pick<IInternalService, 'id'>;

export type EntityResponseType = HttpResponse<IInternalService>;
export type EntityArrayResponseType = HttpResponse<IInternalService[]>;

@Injectable({ providedIn: 'root' })
export class InternalServiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/internal-services');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  //API
  create(internalService: InternalService): Observable<EntityResponseType> {
    return this.http.post<IInternalService>(this.resourceUrl, internalService, { observe: 'response' });
  }

  update(internalService: IInternalService): Observable<EntityResponseType> {
    return this.http.put<IInternalService>(`${this.resourceUrl}/${this.getInternalServiceIdentifier(internalService)}`, internalService, {
      observe: 'response',
    });
  }

  partialUpdate(internalService: PartialUpdateInternalService): Observable<EntityResponseType> {
    return this.http.patch<IInternalService>(`${this.resourceUrl}/${this.getInternalServiceIdentifier(internalService)}`, internalService, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInternalService>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInternalService[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInternalServiceIdentifier(internalService: Pick<IInternalService, 'id'>): number {
    return internalService.id;
  }

  compareInternalService(o1: Pick<IInternalService, 'id'> | null, o2: Pick<IInternalService, 'id'> | null): boolean {
    return o1 && o2 ? this.getInternalServiceIdentifier(o1) === this.getInternalServiceIdentifier(o2) : o1 === o2;
  }

  addInternalServiceToCollectionIfMissing<Type extends Pick<IInternalService, 'id'>>(
    internalServiceCollection: Type[],
    ...internalServicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const internalServices: Type[] = internalServicesToCheck.filter(isPresent);
    if (internalServices.length > 0) {
      const internalServiceCollectionIdentifiers = internalServiceCollection.map(
        internalServiceItem => this.getInternalServiceIdentifier(internalServiceItem)!
      );
      const internalServicesToAdd = internalServices.filter(internalServiceItem => {
        const internalServiceIdentifier = this.getInternalServiceIdentifier(internalServiceItem);
        if (internalServiceCollectionIdentifiers.includes(internalServiceIdentifier)) {
          return false;
        }
        internalServiceCollectionIdentifiers.push(internalServiceIdentifier);
        return true;
      });
      return [...internalServicesToAdd, ...internalServiceCollection];
    }
    return internalServiceCollection;
  }

  //NON-API
  isInternalServiceSelected = false;
  internalServiceSelected = new EventEmitter<IInternalService>();

  isNewInternalServiceCreated = false;
  private internalServiceCreated = new BehaviorSubject<any>('');
  test = this.internalServiceCreated.asObservable();

  sendCreatedInternalService(internalService: InternalService | undefined) {
    this.internalServiceCreated.next(internalService);
  }
}
