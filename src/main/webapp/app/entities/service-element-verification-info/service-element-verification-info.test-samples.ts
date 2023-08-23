import dayjs from 'dayjs/esm';

import { IServiceElementVerificationInfo, NewServiceElementVerificationInfo } from './service-element-verification-info.model';

export const sampleWithRequiredData: IServiceElementVerificationInfo = {
  id: 83226,
};

export const sampleWithPartialData: IServiceElementVerificationInfo = {
  id: 97793,
  verifiedBy: 'since',
};

export const sampleWithFullData: IServiceElementVerificationInfo = {
  id: 59897,
  isDepartmentLeading: true,
  verifiedBy: 'kobieta PNG zachód',
  verifyDate: dayjs('2023-08-22T20:48'),
};

export const sampleWithNewData: NewServiceElementVerificationInfo = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
