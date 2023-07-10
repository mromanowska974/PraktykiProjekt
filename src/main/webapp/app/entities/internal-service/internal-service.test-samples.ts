import { StatusOfServiceCard } from 'app/entities/enumerations/status-of-service-card.model';

import { IInternalService, NewInternalService } from './internal-service.model';

export const sampleWithRequiredData: IInternalService = {
  id: 67541,
};

export const sampleWithPartialData: IInternalService = {
  id: 99293,
  functionalDescription: 'directional',
  dutiesAndResponsibilities: 'repudiandae',
  personResponsibleForService: 'District flagellate',
  serviceActivatingCost: 'fooey',
  priceListOfService: 'monitor hack fioletowy',
  notes: 'Games lest Identity',
  guaranteedLevelsOfProvisionOfService: 'parsing',
  levelOfAccessibility: 'mężczyzna',
};

export const sampleWithFullData: IInternalService = {
  id: 98068,
  name: 'Account RSS',
  symbol: 'Investment',
  functionalDescription: 'duh',
  serviceComissions: 'systematic pish biały',
  exclusions: 'Home sneaky Crew',
  dutiesAndResponsibilities: 'Analyst',
  personResponsibleForService: 'City',
  hoursOfService: 'północny',
  serviceActivatingCost: 'Jeep',
  priceListOfService: 'Awesome Gasoline',
  notes: 'Sausages Architect',
  status: 'NON_BINDING',
  criticalService: false,
  guaranteedLevelsOfProvisionOfService: 'particularise',
  periodOfProvisionOfService: 'Investment loud toolset',
  windowOfService: 'Wooden reciprocal',
  levelOfAccessibility: 'past moisturize duh',
  planDisasterRecovery: 'deposit Garden confidentiality',
  rPO: 'Account śląskie',
  rTO: '24/7 Krosno',
};

export const sampleWithNewData: NewInternalService = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
