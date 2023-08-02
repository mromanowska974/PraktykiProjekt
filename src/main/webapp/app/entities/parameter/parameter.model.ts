import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { ParameterType } from 'app/entities/enumerations/parameter-type.model';

export interface IParameter {
  id: number;
  name?: string | null;
  value?: string | null;
  type?: keyof typeof ParameterType | null;
  businessService?: Pick<IBusinessService, 'id'> | null;
  internalService?: Pick<IInternalService, 'id'> | null;
}

export class Parameter implements IParameter {
  id: number;
  name?: string | null;
  value?: string | null;
  type?: keyof typeof ParameterType | null;
  businessService?: Pick<IBusinessService, 'id'> | null;
  internalService?: Pick<IInternalService, 'id'> | null;
}

export type NewParameter = Omit<IParameter, 'id'> & { id: null };
