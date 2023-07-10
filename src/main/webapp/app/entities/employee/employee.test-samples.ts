import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 74647,
};

export const sampleWithPartialData: IEmployee = {
  id: 50689,
  name: 'Van parsing zowie',
  surname: 'interpłciowa wschód',
};

export const sampleWithFullData: IEmployee = {
  id: 76545,
  name: 'Senior',
  surname: 'Osoba',
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
