import { IParameter, NewParameter } from './parameter.model';

export const sampleWithRequiredData: IParameter = {
  id: 94143,
};

export const sampleWithPartialData: IParameter = {
  id: 63552,
  name: 'input past',
};

export const sampleWithFullData: IParameter = {
  id: 94781,
  name: 'invoice intently kobieta',
  value: 'Rial Van enormous',
};

export const sampleWithNewData: NewParameter = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
