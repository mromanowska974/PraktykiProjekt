import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExternalCompany, NewExternalCompany } from '../external-company.model';

export type PartialUpdateExternalCompany = Partial<IExternalCompany> & Pick<IExternalCompany, 'id'>;

export type EntityResponseType = HttpResponse<IExternalCompany>;
export type EntityArrayResponseType = HttpResponse<IExternalCompany[]>;

@Injectable({ providedIn: 'root' })
export class ExternalCompanyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/external-companies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(externalCompany: NewExternalCompany): Observable<EntityResponseType> {
    return this.http.post<IExternalCompany>(this.resourceUrl, externalCompany, { observe: 'response' });
  }

  update(externalCompany: IExternalCompany): Observable<EntityResponseType> {
    return this.http.put<IExternalCompany>(`${this.resourceUrl}/${this.getExternalCompanyIdentifier(externalCompany)}`, externalCompany, {
      observe: 'response',
    });
  }

  partialUpdate(externalCompany: PartialUpdateExternalCompany): Observable<EntityResponseType> {
    return this.http.patch<IExternalCompany>(`${this.resourceUrl}/${this.getExternalCompanyIdentifier(externalCompany)}`, externalCompany, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExternalCompany>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExternalCompany[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExternalCompanyIdentifier(externalCompany: Pick<IExternalCompany, 'id'>): number {
    return externalCompany.id;
  }

  compareExternalCompany(o1: Pick<IExternalCompany, 'id'> | null, o2: Pick<IExternalCompany, 'id'> | null): boolean {
    return o1 && o2 ? this.getExternalCompanyIdentifier(o1) === this.getExternalCompanyIdentifier(o2) : o1 === o2;
  }

  addExternalCompanyToCollectionIfMissing<Type extends Pick<IExternalCompany, 'id'>>(
    externalCompanyCollection: Type[],
    ...externalCompaniesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const externalCompanies: Type[] = externalCompaniesToCheck.filter(isPresent);
    if (externalCompanies.length > 0) {
      const externalCompanyCollectionIdentifiers = externalCompanyCollection.map(
        externalCompanyItem => this.getExternalCompanyIdentifier(externalCompanyItem)!
      );
      const externalCompaniesToAdd = externalCompanies.filter(externalCompanyItem => {
        const externalCompanyIdentifier = this.getExternalCompanyIdentifier(externalCompanyItem);
        if (externalCompanyCollectionIdentifiers.includes(externalCompanyIdentifier)) {
          return false;
        }
        externalCompanyCollectionIdentifiers.push(externalCompanyIdentifier);
        return true;
      });
      return [...externalCompaniesToAdd, ...externalCompanyCollection];
    }
    return externalCompanyCollection;
  }
}
