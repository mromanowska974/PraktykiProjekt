import { IEmployee } from 'app/entities/employee/employee.model';
import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { StatusOfServiceCard } from 'app/entities/enumerations/status-of-service-card.model';

export interface IInternalService {
  id: number;
  name?: string | null;
  symbol?: string | null;
  functionalDescription?: string | null;
  serviceComissions?: string | null;
  exclusions?: string | null;
  dutiesAndResponsibilities?: string | null;
  personResponsibleForService?: string | null;
  hoursOfService?: string | null;
  serviceActivatingCost?: string | null;
  priceListOfService?: string | null;
  notes?: string | null;
  status?: keyof typeof StatusOfServiceCard | null;
  criticalService?: boolean | null;
  guaranteedLevelsOfProvisionOfService?: string | null;
  periodOfProvisionOfService?: string | null;
  windowOfService?: string | null;
  levelOfAccessibility?: string | null;
  planDisasterRecovery?: string | null;
  rPO?: string | null;
  rTO?: string | null;
  employee?: Pick<IEmployee, 'id' | 'name' | 'surname'> | null;
  businessServices?: Pick<IBusinessService, 'id'>[] | null;
}

export class InternalService implements IInternalService {
  id: number;
  name?: string | null;
  symbol?: string | null;
  functionalDescription?: string | null;
  serviceComissions?: string | null;
  exclusions?: string | null;
  dutiesAndResponsibilities?: string | null;
  personResponsibleForService?: string | null;
  hoursOfService?: string | null;
  serviceActivatingCost?: string | null;
  priceListOfService?: string | null;
  notes?: string | null;
  status?: keyof typeof StatusOfServiceCard | null;
  criticalService?: boolean | null;
  guaranteedLevelsOfProvisionOfService?: string | null;
  periodOfProvisionOfService?: string | null;
  windowOfService?: string | null;
  levelOfAccessibility?: string | null;
  planDisasterRecovery?: string | null;
  rPO?: string | null;
  rTO?: string | null;
  employee?: Pick<IEmployee, 'id' | 'name'> | null;
  businessServices?: Pick<IBusinessService, 'id'>[] | null;
}

export type NewInternalService = Omit<IInternalService, 'id'> & { id: null };
