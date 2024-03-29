import dayjs from 'dayjs/esm';
import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { StatusOfServiceElement } from 'app/entities/enumerations/status-of-service-element.model';
import { TypeOfPeriodOfProvisionOfService } from 'app/entities/enumerations/type-of-period-of-provision-of-service.model';

export interface IServiceElement {
  id: number;
  price?: number | null;
  description?: string | null;
  valuationNumber?: string | null;
  paymentType?: keyof typeof PaymentType | null;
  startDate?: dayjs.Dayjs | null;
  periodOfProvisionOfServiceInMonths?: number | null;
  endDate?: dayjs.Dayjs | null;
  status?: keyof typeof StatusOfServiceElement | null;
  bmcRegistration?: string | null;
  priceFromCalculation?: number | null;
  expirationDate?: dayjs.Dayjs | null;
  typeOfPeriodOfProvisionOfService?: keyof typeof TypeOfPeriodOfProvisionOfService | null;
  offerLocationLink?: string | null;
  businessService?: Pick<IBusinessService, 'id'> | null;
  internalService?: Pick<IInternalService, 'id'> | null;
}

export class ServiceElement implements IServiceElement {
  id: number;
  price?: number | null;
  description?: string | null;
  valuationNumber?: string | null;
  paymentType?: keyof typeof PaymentType | null;
  startDate?: dayjs.Dayjs | null;
  periodOfProvisionOfServiceInMonths?: number | null;
  endDate?: dayjs.Dayjs | null;
  status?: keyof typeof StatusOfServiceElement | null;
  bmcRegistration?: string | null;
  priceFromCalculation?: number | null;
  expirationDate?: dayjs.Dayjs | null;
  typeOfPeriodOfProvisionOfService?: keyof typeof TypeOfPeriodOfProvisionOfService | null;
  offerLocationLink?: string | null;
  businessService?: Pick<IBusinessService, 'id'> | null;
  internalService?: Pick<IInternalService, 'id'> | null;
}
export type NewServiceElement = Omit<IServiceElement, 'id'> & { id: null };
