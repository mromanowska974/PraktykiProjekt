import dayjs from 'dayjs/esm';
import { IDepartment } from 'app/entities/department/department.model';
import { IServiceElement } from 'app/entities/service-element/service-element.model';

export interface IServiceElementVerificationInfo {
  id: number;
  isDepartmentLeading?: boolean | null;
  verifiedBy?: string | null;
  verifyDate?: dayjs.Dayjs | null;
  department?: Pick<IDepartment, 'id' | 'name'> | null;
  serviceElement?: Pick<IServiceElement, 'id'> | null;
}

export type NewServiceElementVerificationInfo = Omit<IServiceElementVerificationInfo, 'id'> & { id: null };
