import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: 27233,
};

export const sampleWithPartialData: IClient = {
  id: 96274,
};

export const sampleWithFullData: IClient = {
  id: 13781,
  name: 'responsive Chevrolet',
};

export const sampleWithNewData: NewClient = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
