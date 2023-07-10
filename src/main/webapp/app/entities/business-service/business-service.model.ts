import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { IClient } from 'app/entities/client/client.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { IDepartment } from 'app/entities/department/department.model';

export interface IBusinessService {
  id: number;
  name?: string | null;
  symbol?: string | null;
  functionalDescription?: string | null;
  exclusions?: string | null;
  dutiesAndResponsibilities?: string | null;
  personResponsibleForService?: string | null;
  hoursOfService?: string | null;
  serviceActivatingCost?: string | null;
  priceListOfService?: string | null;
  notes?: string | null;
  internalServices?: Pick<IInternalService, 'id'>[] | null;
  client?: Pick<IClient, 'id'> | null;
  employee?: Pick<IEmployee, 'id'> | null;
  department?: Pick<IDepartment, 'id'> | null;
}

export type NewBusinessService = Omit<IBusinessService, 'id'> & { id: null };
