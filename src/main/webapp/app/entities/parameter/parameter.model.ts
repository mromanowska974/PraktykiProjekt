import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';

export interface IParameter {
  id: number;
  name?: string | null;
  value?: string | null;
  businessService?: Pick<IBusinessService, 'id'> | null;
  internalService?: Pick<IInternalService, 'id'> | null;
}

export type NewParameter = Omit<IParameter, 'id'> & { id: null };
