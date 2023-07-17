import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { IClient } from 'app/entities/client/client.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { IDepartment } from 'app/entities/department/department.model';
import { StatusOfServiceElement } from 'app/entities/enumerations/status-of-service-element.model';

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
  status?: keyof typeof StatusOfServiceElement | null;
  internalServices?: Pick<IInternalService, 'id'>[] | null;
  client?: Pick<IClient, 'id' | 'name'> | null;
  employee?: Pick<IEmployee, 'id' | 'name' | 'surname'> | null;
  department?: Pick<IDepartment, 'id' | 'name'> | null;
}

export type NewBusinessService = Omit<IBusinessService, 'id'> & { id: null };
