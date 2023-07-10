import { IDepartment, NewDepartment } from './department.model';

export const sampleWithRequiredData: IDepartment = {
  id: 75882,
};

export const sampleWithPartialData: IDepartment = {
  id: 62134,
  name: 'parallelism Fantastic',
};

export const sampleWithFullData: IDepartment = {
  id: 94409,
  name: 'Coupe',
};

export const sampleWithNewData: NewDepartment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
