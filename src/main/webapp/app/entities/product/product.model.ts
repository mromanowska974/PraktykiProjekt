import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { ProductType } from 'app/entities/enumerations/product-type.model';

export interface IProduct {
  id: number;
  name?: string | null;
  type?: keyof typeof ProductType | null;
  internalService?: Pick<IInternalService, 'id'> | null;
}

export type NewProduct = Omit<IProduct, 'id'> & { id: null };
