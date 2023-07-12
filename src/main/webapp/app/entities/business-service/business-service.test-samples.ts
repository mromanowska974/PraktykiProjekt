import { StatusOfServiceElement } from 'app/entities/enumerations/status-of-service-element.model';

import { IBusinessService, NewBusinessService } from './business-service.model';

export const sampleWithRequiredData: IBusinessService = {
  id: 16668,
};

export const sampleWithPartialData: IBusinessService = {
  id: 3117,
  functionalDescription: 'Inna Security opolskie',
  exclusions: 'Bedfordshire bandwidth solid',
  priceListOfService: 'over Borders generating',
  notes: 'Diesel Gasoline południowy',
  status: 'NON_ACTIVE',
};

export const sampleWithFullData: IBusinessService = {
  id: 75913,
  name: 'Bicycle Tlen',
  symbol: 'grej',
  functionalDescription: 'Coupe deposit',
  exclusions: 'kobieta',
  dutiesAndResponsibilities: 'workforce',
  personResponsibleForService: 'Kip framework Bangladesz',
  hoursOfService: 'Keyboard',
  serviceActivatingCost: 'Electric',
  priceListOfService: 'Practical circuit Direct',
  notes: 'zielony Metal',
  status: 'ACTIVE',
};

export const sampleWithNewData: NewBusinessService = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
