import { IInternalService } from 'app/entities/internal-service/internal-service.model';

export interface IExternalCompany {
  id: number;
  name?: string | null;
  contractNumber?: string | null;
  sLAParameters?: string | null;
  internalService?: Pick<IInternalService, 'id'> | null;
}

export type NewExternalCompany = Omit<IExternalCompany, 'id'> & { id: null };
