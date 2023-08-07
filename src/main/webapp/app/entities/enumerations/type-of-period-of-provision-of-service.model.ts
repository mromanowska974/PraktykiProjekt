export enum TypeOfPeriodOfProvisionOfService {
  MINIMAL = 'MINIMAL',

  FIXED = 'FIXED',
}

export const TypeOfPeriodMapping: Record<TypeOfPeriodOfProvisionOfService, string> = {
  [TypeOfPeriodOfProvisionOfService.MINIMAL]: 'Minimalna',
  [TypeOfPeriodOfProvisionOfService.FIXED]: 'Terminowa',
};
