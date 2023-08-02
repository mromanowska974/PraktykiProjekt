import dayjs from 'dayjs/esm';

import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { StatusOfServiceElement } from 'app/entities/enumerations/status-of-service-element.model';

import { IServiceElement, NewServiceElement } from './service-element.model';

export const sampleWithRequiredData: IServiceElement = {
  id: 80703,
};

export const sampleWithPartialData: IServiceElement = {
  id: 5668,
  description: 'wschód',
  valuationNumber: 'microchip',
  startDate: dayjs('2023-07-09T19:57'),
  typeOfPeriodOfProvisionOfService: 'bluetooth biały',
  bmcRegistration: 'worriedly',
  priceFromCalculation: 24454,
};

export const sampleWithFullData: IServiceElement = {
  id: 1967,
  price: 52974,
  description: 'whispered Concrete firmware',
  valuationNumber: 'tempora',
  paymentType: 'MONTHLY',
  startDate: dayjs('2023-07-10T04:12'),
  periodOfProvisionOfServiceInMonths: 92686,
  typeOfPeriodOfProvisionOfService: 'matrix brązowy Plastic',
  endDate: dayjs('2023-07-10T07:03'),
  status: 'ACTIVE',
  bmcRegistration: 'customer index Wooden',
  priceFromCalculation: 66106,
  expirationDate: dayjs('2023-07-09T12:31'),
};

export const sampleWithNewData: NewServiceElement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
