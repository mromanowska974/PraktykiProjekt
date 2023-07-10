import dayjs from 'dayjs/esm';

import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { StatusOfServiceElement } from 'app/entities/enumerations/status-of-service-element.model';

import { IServiceElement, NewServiceElement } from './service-element.model';

export const sampleWithRequiredData: IServiceElement = {
  id: 40614,
};

export const sampleWithPartialData: IServiceElement = {
  id: 61997,
  price: 65960,
  description: 'obediently Quality kandela',
  paymentType: 'MONTHLY',
  startDate: dayjs('2023-07-09T18:21'),
  periodOfProvisionOfServiceInMonths: 93925,
  typeOfPeriodOfProvisionOfService: 'immaculate',
  endDate: dayjs('2023-07-10T02:09'),
  status: 'ACTIVE',
};

export const sampleWithFullData: IServiceElement = {
  id: 59108,
  price: 40813,
  description: 'back pomorskie Factors',
  valuationNumber: 'Mercedes Account północ',
  paymentType: 'DISPOSABLE',
  startDate: dayjs('2023-07-10T00:26'),
  periodOfProvisionOfServiceInMonths: 20896,
  typeOfPeriodOfProvisionOfService: 'Architect',
  endDate: dayjs('2023-07-09T11:27'),
  status: 'ACTIVE',
};

export const sampleWithNewData: NewServiceElement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
