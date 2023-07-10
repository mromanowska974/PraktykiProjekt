import { IExternalCompany, NewExternalCompany } from './external-company.model';

export const sampleWithRequiredData: IExternalCompany = {
  id: 99602,
};

export const sampleWithPartialData: IExternalCompany = {
  id: 74476,
  name: 'Chęciny bypassing Mężczyzna',
  sLAParameters: 'barring',
};

export const sampleWithFullData: IExternalCompany = {
  id: 39771,
  name: 'zachód',
  contractNumber: 'those revolutionary invoice',
  sLAParameters: 'gargantuan kobieta',
};

export const sampleWithNewData: NewExternalCompany = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
