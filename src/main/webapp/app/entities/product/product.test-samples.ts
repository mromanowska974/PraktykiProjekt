import { ProductType } from 'app/entities/enumerations/product-type.model';

import { IProduct, NewProduct } from './product.model';

export const sampleWithRequiredData: IProduct = {
  id: 92269,
};

export const sampleWithPartialData: IProduct = {
  id: 55628,
  name: 'Solutions wschód groupware',
};

export const sampleWithFullData: IProduct = {
  id: 5515,
  name: 'Orchestrator',
  type: 'CRITICAL',
};

export const sampleWithNewData: NewProduct = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
