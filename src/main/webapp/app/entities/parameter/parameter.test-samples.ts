import { ParameterType } from 'app/entities/enumerations/parameter-type.model';

import { IParameter, NewParameter } from './parameter.model';

export const sampleWithRequiredData: IParameter = {
  id: 79742,
};

export const sampleWithPartialData: IParameter = {
  id: 55175,
  value: 'past thigh invoice',
};

export const sampleWithFullData: IParameter = {
  id: 88956,
  name: 'kobieta excepting',
  value: 'Rial Van enormous',
  type: 'QUANTITY',
};

export const sampleWithNewData: NewParameter = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
