import { IBusinessService, NewBusinessService } from './business-service.model';

export const sampleWithRequiredData: IBusinessService = {
  id: 34589,
};

export const sampleWithPartialData: IBusinessService = {
  id: 66278,
  exclusions: 'Witkowo Inna Security',
  dutiesAndResponsibilities: 'Direct Shoes',
  notes: 'żółty',
};

export const sampleWithFullData: IBusinessService = {
  id: 68467,
  name: 'blanditiis',
  symbol: 'whereas szary',
  functionalDescription: 'południowy Accounts',
  exclusions: 'Bicycle Tlen',
  dutiesAndResponsibilities: 'grej',
  personResponsibleForService: 'Coupe deposit',
  hoursOfService: 'kobieta',
  serviceActivatingCost: 'workforce',
  priceListOfService: 'Kip framework Bangladesz',
  notes: 'Keyboard',
};

export const sampleWithNewData: NewBusinessService = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
